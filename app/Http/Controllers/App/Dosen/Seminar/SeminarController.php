<?php

namespace App\Http\Controllers\App\Dosen\Seminar;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seminar\StoreSeminarDataRequest;
use App\Models\SeminarModel;
use App\Models\SeminarPenulisModel; // Pastikan Model Penulis diimport
use App\Models\ProfilDosenModel;
use App\Models\HakAksesModel;
use App\Models\User;
use App\Helper\ToolsHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SeminarController extends Controller
{
    // ====================================================
    // 1. DAFTAR SEMINAR (INDEX) - DENGAN FILTER DAN SEARCH
    // ====================================================
    public function index(Request $request)
    {
        $profil = ProfilDosenModel::where('user_id', Auth::id())->first();
        $search = $request->input('search');
        $status = $request->input('status');

        $seminars = [];
        if ($profil) {
            $seminars = SeminarModel::where('dosen_profil_id', $profil->id)
                
                // LOGIKA SEARCH (Mencari di Judul dan Nama Forum)
                ->when($search, function ($query, $search) {
                    $query->where(function ($q) use ($search) {
                        $q->where('judul_makalah', 'like', '%' . $search . '%')
                          ->orWhere('nama_forum', 'like', '%' . $search . '%');
                    });
                })
                
                // LOGIKA FILTER STATUS
                ->when($status, function ($query, $status) {
                    $query->where('status_progress', $status);
                })
                
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return Inertia::render('app/dosen/seminar/seminar-page', [
            'pageName' => 'Daftar Seminar Saya',
            'seminars' => $seminars,
            // 🔥 KIRIMKAN KEMBALI FILTER YANG AKTIF KE FRONTEND
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    // ====================================================
    // 2. REGISTRASI AWAL (CREATE)
    // ====================================================
      public function create()
      {
          $profil = ProfilDosenModel::where('user_id', Auth::id())->first();
          if (!$profil || empty($profil->nidn)) {
              return redirect()->route('profile.index')
                  ->with('error', 'Mohon lengkapi Profil (NIDN) terlebih dahulu.');
          }

          return Inertia::render('app/dosen/seminar/registrasi-awal', [
              'pageName' => 'Registrasi Pengajuan Dana',
          ]);
      }

      // ====================================================
      // 3. SIMPAN DATA AWAL (STORE)
      // ====================================================
      
      public function store(Request $request)
    {
        // 1. Validasi Input Lengkap
        $request->validate([
            'judul_makalah' => 'required|string|max:255',
            'penulis' => 'nullable|array',
            'penulis.*.nama' => 'required_with:penulis|string',
            
            // Input Logika Pedoman
            'kategori_luaran' => 'required|string',
            'jumlah_penulis' => 'required',
            'tipe_penulis' => 'required|string', 
            'urutan_penulis' => 'required',
            
            'kewajiban' => 'nullable|array',
        ]);

        DB::beginTransaction();
        try {
            $profil = ProfilDosenModel::where('user_id', Auth::id())->firstOrFail();

            // ====================================================
            // LOGIKA HITUNG PAGU FINAL (100% dari Batas Maksimal Registrasi Seminar)
            // ====================================================
            $maxDanaFinal = 0; // Pagu final registrasi
            $kategoriLuaran = $request->kategori_luaran;

            // TAHAP 1: Menentukan Pagu Dasar Registrasi (Bab 3.1 Poin 1)
            // Semua seminar yang memenuhi syarat mendapatkan 100% dari pagu sesuai indeksasi.
            if (str_contains($kategoriLuaran, 'Terindeks')) {
                // Asumsi: Jurnal Internasional Terindeks = Scopus dan Scimagojr 
                $maxDanaFinal = 10000000; // Rp 10.000.000 (Pagu C)
            } elseif (str_contains($kategoriLuaran, 'Internasional') || str_contains($kategoriLuaran, 'Terakreditasi')) {
                // Asumsi: Prosiding Internasional (Terindeks Salah Satu Scopus/WoS) 
                $maxDanaFinal = 5000000; // Rp 5.000.000 (Pagu B)
            } else {
                // Nasional / Prosiding Nasional (Tidak Terindeks) 
                $maxDanaFinal = 1500000; // Rp 1.500.000 (Pagu A)
            }

            // TAHAP 2: Cek Kelayakan Dasar (Wajib menghadiri seminar dan presentasi) 
            // Posisi penulis TIDAK MEMPENGARUHI BESARAN DANA, hanya kelayakan menghadiri.
            
            // Contoh Kelayakan Dasar: Dosen harus tercantum sebagai penulis (asumsi selalu terpenuhi)
            // Jika Dosen mengisi sebagai Co-Author, pagu tetap 100% dari Pagu Dasar.
            
            // Jika Dosen memilih status yang tidak logis (misal urutan > jumlah penulis), 
            // kita bisa menetapkan pagu 0, namun kita anggap validasi di Frontend cukup.
            
            // Pagu Final adalah 100% dari Pagu Dasar Registrasi
            // ====================================================

            // 3. Simpan Data Seminar (Draft)
            $seminar = SeminarModel::create([
                'id' => ToolsHelper::generateId(),
                'dosen_profil_id' => $profil->id,
                'judul_makalah' => $request->judul_makalah,
                
                // Simpan Metadata & Hasil Hitungan ke JSON
                'kewajiban_penelitian' => [
                    'checklist' => $request->kewajiban,
                    'meta_penulis' => [
                        'jumlah' => $request->jumlah_penulis,
                        'tipe' => $request->tipe_penulis,
                        'urutan' => $request->urutan_penulis,
                    ],
                    'kategori_luaran' => $request->kategori_luaran,
                    // Kita simpan Pagu Final 100%
                    'estimasi_max_dana' => $maxDanaFinal 
                ],
                
                // Default Value
                'nama_forum' => '-', 
                'institusi_penyelenggara' => '-',
                'tanggal_mulai' => now(), 
                'tanggal_selesai' => now(),
                'tempat_pelaksanaan' => '-',
                'biaya_registrasi' => 0,
                'status_progress' => 'draft',
            ]);

            // 4. Simpan Data Penulis (Looping)
            if ($request->has('penulis') && is_array($request->penulis)) {
                foreach ($request->penulis as $p) {
                    if (!empty($p['nama'])) {
                        SeminarPenulisModel::create([
                            'id' => ToolsHelper::generateId(),
                            'seminar_id' => $seminar->id,
                            'nama' => $p['nama'],
                            'tipe_penulis' => 'Anggota'
                        ]);
                    }
                }
            }

            DB::commit();

            return redirect()->route('dosen.seminar.step1', ['id' => $seminar->id])
                ->with('success', 'Registrasi berhasil. Pagu dana disetujui: Rp ' . number_format($maxDanaFinal));

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal: ' . $e->getMessage() . ' Line: ' . $e->getLine());
        }
    }

    // ====================================================
    // 4. STEP 1: LENGKAPI DATA (EDIT)
    // ====================================================
    public function editStep1($id)
    {
        $seminar = $this->getSeminar($id);
        
        // Load relasi penulis agar muncul di form edit jika perlu
        $seminar->load('penulis'); 

        return Inertia::render('app/dosen/seminar/step-1-data', [
            'pageName' => 'Lengkapi Data Seminar',
            'seminar' => $seminar 
        ]);
    }

    public function updateStep1(StoreSeminarDataRequest $request, $id)
    {
        DB::beginTransaction();
        try {
            $seminar = $this->getSeminar($id);
            
            // 1. Update Data Utama Seminar (Judul, Forum, Waktu, Biaya, dll)
            $seminar->update($request->validated());

            // 2. Update Data Penulis (Opsional, jika form Step 1 mengirim data penulis juga)
            // Karena view Step 1 Anda sekarang HANYA input detail seminar, bagian ini opsional.
            // Namun saya biarkan agar robust jika nanti Anda ingin edit penulis di step 1.
            /* if ($request->has('penulis')) {
                SeminarPenulisModel::where('seminar_id', $seminar->id)->delete();
                foreach ($request->penulis as $p) {
                    if (!empty($p['nama'])) {
                        SeminarPenulisModel::create([
                            'id' => ToolsHelper::generateId(),
                            'seminar_id' => $seminar->id,
                            'nama' => $p['nama'],
                            'tipe_penulis' => 'Anggota'
                        ]);
                    }
                }
            }
            */

            DB::commit();

            // Redirect ke Step 2 (Upload Paper)
            return redirect()->route('dosen.seminar.step2', ['id' => $seminar->id])
                ->with('success', 'Data seminar tersimpan.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal update: ' . $e->getMessage());
        }
    }

    // ====================================================
    // 5. STEP 2: UPLOAD PAPER
    // ====================================================
    public function createStep2($id)
    {
        $seminar = $this->getSeminar($id);
        
        // Ambil reviewer dari hak akses dan profil dosen
        $reviewers = HakAksesModel::where('akses', 'like', '%Reviewer%')
                        ->get()
                        ->map(function($hak) {
                            $user = User::find($hak->user_id);
                            $profilReviewer = ProfilDosenModel::where('user_id', $hak->user_id)->first();
                            
                            // Hanya tampilkan user yang punya profil dosen (NIDN)
                            if ($user && $profilReviewer) {
                                return [
                                    'value' => $profilReviewer->id, // ID Profil Dosen (bukan User ID)
                                    'label' => $user->name
                                ];
                            }
                            return null;
                        })->filter()->values();

        return Inertia::render('app/dosen/seminar/step-2-paper', [
            'pageName' => 'Upload Paper',
            'seminar' => $seminar,
            'reviewers' => $reviewers
        ]);
    }

    public function storeStep2(Request $request, $id)
    {
        $request->validate([
            'file_draft' => 'required|file|mimes:pdf|max:15360', // 15MB
            'reviewer_id' => 'required|exists:m_profil_dosen,id', // Validasi ke tabel profil
        ]);

        $seminar = $this->getSeminar($id);

        DB::beginTransaction();
        try {
            if ($request->hasFile('file_draft')) {
                // Hapus file lama jika ada (optional)
                // if($seminar->file_paper_draft) Storage::delete($seminar->file_paper_draft);
                
                $seminar->file_paper_draft = $request->file('file_draft')->store('papers/draft', 'public');
            }
            
            // Simpan Reviewer ke tabel t_seminar_review
            \App\Models\SeminarReviewModel::create([
                'id' => ToolsHelper::generateId(),
                'seminar_id' => $seminar->id,
                'reviewer_id' => $request->reviewer_id,
                'status' => 'menunggu'
            ]);

            $seminar->status_progress = 'menunggu_reviewer';
            $seminar->save();

            DB::commit();
            return redirect()->route('dosen.seminar.step3');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal upload: ' . $e->getMessage());
        }
    }

    // ====================================================
    // 6. HAPUS SEMINAR (DELETE)
    // ====================================================
    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $seminar = $this->getSeminar($id);

            // Hanya izinkan hapus jika statusnya DRAFT
            if ($seminar->status_progress !== 'draft') {
                DB::rollBack();
                // 🔥 Gunakan back()->with() untuk flash message Inertia/Laravel
                return back()->with('error', 'Hanya pengajuan berstatus Draft yang dapat dihapus.');
            }

            // Hapus relasi anak yang terkait (Penulis, dll.)
            \App\Models\SeminarPenulisModel::where('seminar_id', $seminar->id)->delete();
            
            $seminar->delete();

            DB::commit();
            // 🔥 Gunakan back()->with() untuk flash message Inertia/Laravel
            return back()->with('success', 'Pengajuan berhasil dihapus.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal menghapus pengajuan. Silakan coba lagi.');
        }
    }


    // ====================================================
    // HELPER
    // ====================================================
    private function getSeminar($id) {
        $profil = ProfilDosenModel::where('user_id', Auth::id())->firstOrFail();
        return SeminarModel::where('id', $id)->where('dosen_profil_id', $profil->id)->firstOrFail();
    }
}