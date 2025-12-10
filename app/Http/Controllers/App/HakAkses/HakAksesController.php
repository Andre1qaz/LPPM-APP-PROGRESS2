<?php

namespace App\Http\Controllers\App\HakAkses;

use App\Helper\ConstHelper;
use App\Helper\ToolsHelper;
use App\Http\Api\UserApi;
use App\Http\Controllers\Controller;
use App\Models\HakAksesModel;
use App\Models\User; // Import Model User untuk fallback
use Illuminate\Http\Request;
use Inertia\Inertia;

class HakAksesController extends Controller
{
    public function index(Request $request)
    {
        $auth = $request->attributes->get('auth');
        
        // ✅ [SECURE] Pengecekan Hak Akses Diaktifkan Kembali
        $isEditor = $this->checkIsEditor($auth);
        
        if (! $isEditor) {
            // Jika bukan Admin, tendang ke Home
            return redirect()->route('home')->with('error', 'Anda tidak memiliki hak akses untuk halaman ini.');
        }

        return Inertia::render('app/hak-akses/hak-akses-page', [
            // SELALU diperlukan, tapi LAZY loading
            'aksesList' => function () {
                $aksesList = HakAksesModel::all();

                // LOGIKA PENGAMBILAN DATA USER
                // Coba ambil dari API, jika gagal ambil dari DB Lokal
                try {
                    $token = ToolsHelper::getAuthToken();
                    $usersList = [];

                    if ($token) {
                        $response = UserApi::postReqUsersByIds(
                            $token,
                            $aksesList->pluck('user_id')->unique()->toArray(),
                        );
                        
                        if ($response && isset($response->data->users)) {
                            $usersList = collect($response->data->users)->map(function ($user) {
                                return (object) $user;
                            })->all();
                        }
                    }
                } catch (\Exception $e) {
                    // Silent fail
                }

                // Fallback ke tabel lokal users jika API error/kosong
                if (empty($usersList)) {
                    $usersList = User::whereIn('id', $aksesList->pluck('user_id'))->get();
                }

                foreach ($aksesList as $akses) {
                    // Mapping data user
                    $akses->user = collect($usersList)->firstWhere('id', $akses->user_id);
                    
                    $data_akses = explode(',', $akses->akses);
                    sort($data_akses);
                    $akses->data_akses = $data_akses;
                }

                // Jika user kosong (data tidak sinkron), tetap tampilkan agar bisa diedit/dihapus
                return $aksesList->values();
            },
            // SELALU diperlukan dan SELALU dikirim
            'pageName' => Inertia::always('Hak Akses'),
            'auth' => Inertia::always($auth),
            'isEditor' => Inertia::always($isEditor),
            // Gunakan daftar role sesuai SRS SPDRS
            'optionRoles' => Inertia::always([
                "Admin", 
                "Dosen", 
                "Reviewer", 
                "Kprodi", 
                "LppmKetua", 
                "LppmAnggota", 
                "Keuangan", 
                "Hrd"
            ]),
        ]);
    }

    public function postChange(Request $request)
    {
        // ✅ [SECURE] Cek Izin
        $auth = $request->attributes->get('auth');
        if (!$this->checkIsEditor($auth)) {
            return back()->with('error', 'Anda tidak memiliki izin untuk mengubah hak akses.');
        }

        $request->validate([
            'userId' => 'required',
            'hakAkses' => 'required|array',
        ]);

        // Hapus akses lama
        HakAksesModel::where('user_id', $request->userId)->delete();

        // Simpan hak akses baru
        // Menggunakan ToolsHelper::generateId() untuk UUID PostgreSQL
        HakAksesModel::create([
            'id' => ToolsHelper::generateId(),
            'user_id' => $request->userId,
            'akses' => implode(',', $request->hakAkses),
        ]);

        return back()->with('success', 'Hak akses berhasil diperbarui.');
    }

    public function postDelete(Request $request)
    {
        // ✅ [SECURE] Cek Izin
        $auth = $request->attributes->get('auth');
        if (!$this->checkIsEditor($auth)) {
            return back()->with('error', 'Anda tidak memiliki izin untuk mengubah hak akses.');
        }

        $request->validate([
            'userId' => 'required',
        ]);

        // Hapus akses
        HakAksesModel::where('user_id', $request->userId)->delete();

        return back()->with('success', 'Hak akses pengguna berhasil dihapus.');
    }

    public function postDeleteSelected(Request $request)
    {
        // ✅ [SECURE] Cek Izin
        $auth = $request->attributes->get('auth');
        if (!$this->checkIsEditor($auth)) {
            return back()->with('error', 'Anda tidak memiliki izin untuk mengubah hak akses.');
        }

        $request->validate([
            'userIds' => 'required|array',
        ]);

        // Hapus akses
        HakAksesModel::whereIn('user_id', $request->userIds)->delete();

        return back()->with('success', 'Hak akses untuk pengguna yang dipilih berhasil dihapus.');
    }

    private function checkIsEditor($auth)
    {
        // Helper sederhana untuk cek role Admin
        // Cek di property 'akses' (dari DB HakAksesModel)
        if (isset($auth->akses) && is_array($auth->akses) && in_array('Admin', $auth->akses)) {
            return true;
        }
        // Cek di property 'roles' (dari Middleware HandleInertiaRequests)
        if (isset($auth->roles) && is_array($auth->roles) && in_array('Admin', $auth->roles)) {
            return true;
        }
        
        return false;
    }
}