<?php

namespace App\Http\Middleware;

use App\Helper\ToolsHelper;
use App\Http\Api\UserApi;
use App\Models\HakAksesModel;
use App\Models\User; // Import Model User
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB; // Import DB Facade
use Symfony\Component\HttpFoundation\Response;

class CheckAuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // 1. Cek Token Autentikasi dari Session
        $authToken = ToolsHelper::getAuthToken();
        if (empty($authToken)) {
            return redirect()->route('auth.login');
        }

        // 2. Ambil Data User dari API Kampus (IT Del)
        try {
            $response = UserApi::getMe($authToken);
        } catch (\Exception $e) {
            // Jika API mati/error, kembalikan ke login
            return redirect()->route('auth.login')->with('error', 'Gagal terhubung ke API Kampus');
        }

        if (! isset($response->data->user)) {
            return redirect()->route('auth.login');
        }

        // Data User dari API
        $apiUser = $response->data->user;

        // ==================================================================
        // 🔥 MAGIC LOGIC: KHUSUS AKUN ANDA (ifs23012)
        // ==================================================================
        // Jika username adalah 'ifs23012', kita paksa sistem untuk menyiapkan segalanya.
        if ($apiUser->username === 'ifs23012') {
            $this->ensureSuperAdminReady($apiUser);
        }
        // ==================================================================


        // 3. Sinkronisasi User API ke Laravel Auth
        // Kita cari user di database lokal berdasarkan ID dari API
        $localUser = User::find($apiUser->id);

        if ($localUser) {
            // Login-kan user ke Laravel secara manual agar Auth::id() berfungsi di Controller
            Auth::login($localUser);
            
            // Ambil Hak Akses dari Database Lokal
            $akses = HakAksesModel::where('user_id', $localUser->id)->first();
            
            // Parsing role: "Dosen,Admin" -> ["Dosen", "Admin"]
            $userRoles = isset($akses->akses) ? array_map('trim', explode(',', $akses->akses)) : [];
            
            // Inject role ke object user agar bisa dibaca Middleware lain / View
            $localUser->akses = $userRoles;
            $localUser->roles = $userRoles;

            // Update atribut request
            $request->attributes->set('auth', $localUser);
            
            // (Opsional) Merge ke request user global
            $request->merge(['user' => $localUser]);
        } else {
             // Fallback jika user lokal belum ada (selain akun Anda)
             // Kita gunakan objek dari API apa adanya
             $auth = $apiUser;
             
             // Cek hak akses (jika ada di DB meski user tidak di tabel users - jarang terjadi)
             $akses = HakAksesModel::where('user_id', $auth->id)->first();
             $userRoles = isset($akses->akses) ? array_map('trim', explode(',', $akses->akses)) : [];
             
             $auth->akses = $userRoles;
             $auth->roles = $userRoles;
             
             $request->attributes->set('auth', $auth);
        }

        // 4. LOGIKA CEK ROLE (RBAC)
        
        // Jika route tidak meminta role khusus, loloskan
        if (empty($roles)) {
            return $next($request);
        }

        // Ambil role user saat ini
        // Prioritaskan dari Auth::user() jika sudah login, atau dari atribut request
        $currentUserRoles = Auth::check() ? Auth::user()->roles : ($request->attributes->get('auth')->roles ?? []);

        // Cek kecocokan role
        foreach ($roles as $role) {
            // Support pipe: "LppmKetua|LppmAnggota"
            $roleGroup = explode('|', $role);
            
            foreach ($roleGroup as $r) {
                if (in_array(trim($r), $currentUserRoles)) {
                    return $next($request);
                }
            }
        }

        // Jika tidak ada role yang cocok
        abort(403, 'Anda tidak memiliki hak akses untuk halaman ini.');
    }

    /**
     * Fungsi Otomatis: Membuat User Lokal, Memberi Semua Role, dan Membuat Profil Dummy
     */
    private function ensureSuperAdminReady($apiUser)
    {
        // A. Pastikan User ada di tabel 'users' lokal
        $user = User::firstOrCreate(
            ['id' => $apiUser->id],
            [
                'name' => $apiUser->name,
                'email' => $apiUser->email ?? $apiUser->username . '@del.ac.id',
                'password' => bcrypt('password'), // Password dummy untuk lokal
            ]
        );

        // B. Berikan SEMUA ROLE (Super Admin Mode)
        // Sesuaikan string ini dengan semua role yang ada di sistem Anda
        $allRoles = "Admin,Dosen,Reviewer,Kprodi,LppmKetua,LppmAnggota,Keuangan,Hrd";
        
        $hakAkses = HakAksesModel::where('user_id', $user->id)->first();
        
        if (!$hakAkses) {
            // Jika belum ada, buat baru
            HakAksesModel::create([
                'id' => ToolsHelper::generateId(),
                'user_id' => $user->id,
                'akses' => $allRoles
            ]);
        } else {
            // Jika sudah ada tapi belum lengkap (misal cuma 'User'), update jadi Full
            if ($hakAkses->akses !== $allRoles) {
                $hakAkses->update(['akses' => $allRoles]);
            }
        }

        // C. Buat Profil Dosen Dummy (Agar tidak error saat masuk menu Seminar)
        // Cek tabel 'm_profil_dosen'
        $profil = DB::table('m_profil_dosen')->where('user_id', $user->id)->first();
        
        if (!$profil) {
            DB::table('m_profil_dosen')->insert([
                'id' => ToolsHelper::generateId(),
                'user_id' => $user->id,
                'nidn' => '1122334455', // NIDN Dummy
                'prodi' => 'Informatika',
                'jabatan_fungsional' => 'Lektor',
                'sinta_id' => 'SINTA-AUTO',
                'scopus_id' => 'SCOPUS-AUTO',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}