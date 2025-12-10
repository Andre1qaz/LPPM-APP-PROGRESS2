<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Helper\ToolsHelper;
use App\Models\User;
use App\Models\HakAksesModel;

class DosenProfileSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Cari user yang punya role 'Dosen'
        // Gunakan where 'akses' like '%Dosen%' karena formatnya "Admin,Dosen"
        $hakAksesList = HakAksesModel::where('akses', 'like', '%Dosen%')->get();

        if ($hakAksesList->isEmpty()) {
            $this->command->warn('Belum ada user dengan role Dosen. Pastikan sudah assign role di menu Hak Akses.');
            return;
        }

        foreach ($hakAksesList as $hakAkses) {
            $userId = $hakAkses->user_id;

            // 2. Cek apakah user ini sudah punya profil
            // PERBAIKAN: Menggunakan nama tabel 'm_profil_dosen' sesuai DB Grace
            $exist = DB::table('m_profil_dosen')->where('user_id', $userId)->exists();

            if (!$exist) {
                // 3. Buatkan Profil Dummy
                DB::table('m_profil_dosen')->insert([
                    'id' => ToolsHelper::generateId(),
                    'user_id' => $userId,
                    'nidn' => '12345678' . rand(10, 99), // NIDN Random
                    'prodi' => 'S1 Informatika',
                    'jabatan_fungsional' => 'Lektor',
                    'sinta_id' => 'SINTA-' . rand(100, 999),
                    'scopus_id' => 'SCOPUS-' . rand(1000, 9999),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                
                // Info di terminal
                $user = User::find($userId);
                $name = $user ? $user->name : 'Unknown';
                $this->command->info("Profil Dosen (m_profil_dosen) dibuat untuk: $name");
            } else {
                $this->command->line("User ID $userId sudah punya profil.");
            }
        }
    }
}