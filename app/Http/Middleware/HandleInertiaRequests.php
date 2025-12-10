<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
// Import Helper dan Model untuk logika Fallback Auth
use App\Helper\ToolsHelper;
use App\Http\Api\UserApi;
use App\Models\HakAksesModel;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // 1. Coba ambil data user yang seharusnya diset oleh CheckAuthMiddleware
        $authUser = $request->attributes->get('auth');

        // 2. [LOGIKA BARU] Jika auth belum ada (misal middleware auth belum jalan), 
        //    coba ambil data user secara manual (Fail-safe mechanism)
        if (!$authUser) {
            try {
                // Ambil token dari session
                $authToken = ToolsHelper::getAuthToken();
                
                if ($authToken) {
                    // Panggil API User untuk mendapatkan data diri
                    $response = UserApi::getMe($authToken);
                    
                    if (isset($response->data->user)) {
                        $authUser = $response->data->user;
                        
                        // Ambil Role/Hak Akses dari Database lokal
                        $akses = HakAksesModel::where('user_id', $authUser->id)->first();
                        
                        // Parsing role dari string "Admin,Dosen" menjadi array ["Admin", "Dosen"]
                        $userRoles = isset($akses->akses) ? array_map('trim', explode(',', $akses->akses)) : [];
                        
                        // Tempelkan role ke objek user
                        $authUser->akses = $userRoles;
                        $authUser->roles = $userRoles;
                        
                        // Simpan kembali ke request agar bisa dipakai di tempat lain dalam satu siklus request ini
                        $request->attributes->set('auth', $authUser);
                    }
                }
            } catch (\Exception $e) {
                // Jika gagal (token expired/API error), biarkan $authUser null (dianggap Guest/Tamu)
            }
        }

        return [
            ...parent::share($request),
            
            // Struktur objek 'auth' yang dikirim ke Frontend (React)
            'auth' => [
                // Objek user lengkap (id, nama, foto) untuk komponen NavUser
                'user' => $authUser, 
                
                // Array roles untuk logika permission di app-layout (fungsi hasRole)
                'roles' => $authUser->roles ?? [], 
                
                // Array akses (alias roles) untuk menjaga kompatibilitas kode lama
                'akses' => $authUser->akses ?? [], 
            ],

            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'appName' => config('app.name'),
        ];
    }
}