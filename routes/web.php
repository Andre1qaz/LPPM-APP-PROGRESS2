<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

// Controllers
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\App\Home\HomeController;
use App\Http\Controllers\App\HakAkses\HakAksesController;
use App\Http\Controllers\App\Todo\TodoController;
use App\Http\Controllers\App\Profile\ProfileController;
use App\Http\Controllers\App\Notifikasi\NotificationController;
use App\Http\Controllers\App\RegisSemi\RegisSemiController; // Pastikan controller ini ada/dibuat
use App\Http\Controllers\App\Penghargaan\PenghargaanBukuController; // Pastikan controller ini ada/dibuat
use App\Http\Controllers\App\HRD\HRDController; // Pastikan controller ini ada/dibuat
use App\Http\Controllers\Api\DosenController; // Pastikan controller ini ada/dibuat

// Controller Fitur Utama (Andre)
use App\Http\Controllers\App\Dosen\Seminar\SeminarController; 

Route::middleware(['throttle:req-limit', 'handle.inertia'])->group(function () {

    // ----------------------------------------------------------------------
    // 1. SSO & AUTH ROUTES (Public)
    // ----------------------------------------------------------------------
    Route::prefix('sso')->group(function () {
        Route::get('/callback', [AuthController::class, 'ssoCallback'])->name('sso.callback');
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/hakakses/dosen', [DosenController::class, 'getDosenFromHakAkses']);
    });

    Route::prefix('auth')->group(function () {
        Route::get('/login', [AuthController::class, 'login'])->name('auth.login');
        Route::post('/login-check', [AuthController::class, 'postLoginCheck'])->name('auth.login-check');
        Route::post('/login-post', [AuthController::class, 'postLogin'])->name('auth.login-post');
        Route::get('/logout', [AuthController::class, 'logout'])->name('auth.logout');
        Route::get('/totp', [AuthController::class, 'totp'])->name('auth.totp');
        Route::post('/totp-post', [AuthController::class, 'postTotp'])->name('auth.totp-post');
    });

    // ----------------------------------------------------------------------
    // 2. PROTECTED ROUTES (Harus Login)
    // ----------------------------------------------------------------------
    Route::middleware('check.auth')->group(function () {

        // --- GENERAL (Semua Role bisa akses) ---
        Route::get('/', [HomeController::class, 'index'])->name('home');
        
        // Profile
        Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');
        Route::post('/profile/update', [ProfileController::class, 'update'])->name('app.profile.update');

        // Notifikasi
        Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
        Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
        Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
        Route::post('/notifications/cleanup', [NotificationController::class, 'cleanupNotifications']);

        // Todo List (Fitur Umum)
        Route::prefix('todo')->group(function () {
            Route::get('/', [TodoController::class, 'index'])->name('todo');
            Route::post('/change', [TodoController::class, 'postChange'])->name('todo.change-post');
            Route::post('/delete', [TodoController::class, 'postDelete'])->name('todo.delete-post');
        });

        // ------------------------------------------------------------------
        // ROLE: ADMIN (Mengurus Hak Akses)
        // ------------------------------------------------------------------
        Route::middleware('role:Admin')->prefix('hak-akses')->group(function () {
        Route::get('/', [HakAksesController::class, 'index'])->name('hak-akses');
        Route::post('/change', [HakAksesController::class, 'postChange'])->name('hak-akses.change-post');
        Route::post('/delete', [HakAksesController::class, 'postDelete'])->name('hak-akses.delete-post');
        Route::post('/delete-selected', [HakAksesController::class, 'postDeleteSelected'])->name('hak-akses.delete-selected-post');
    });

        // ------------------------------------------------------------------
        // ROLE: DOSEN (Pengajuan Seminar)
        // ------------------------------------------------------------------
        Route::middleware('role:Dosen')->prefix('dosen')->name('dosen.')->group(function () {
            
            // Dashboard Dosen
            Route::get('/home', function () {
                return Inertia::render('app/dosen/dosen-home-page', ['pageName' => 'Dashboard Dosen']);
            })->name('home');

            // List Seminar
            Route::get('/seminar', function () {
                return Inertia::render('app/dosen/seminar/seminar-page');
            })->name('seminar.index');

            // Form Registrasi Awal
            Route::get('/seminar/create', function () {
                return Inertia::render('app/dosen/seminar/registrasi-awal');
            })->name('seminar.create');

            // --- WORKFLOW PENGAJUAN (Step 1 sampai selesai) ---
            Route::prefix('seminar')->name('seminar.')->group(function () {
                // 1. DAFTAR SEMINAR (Pintu Masuk)
                Route::get('/', [SeminarController::class, 'index'])->name('index');

                // 2. REGISTRASI AWAL (Klik Tombol Tambah)
                Route::get('/create', [SeminarController::class, 'create'])->name('create');
                Route::post('/store', [SeminarController::class, 'store'])->name('store'); // Simpan awal

                // TAMBAHKAN RULE DELETE INI
                Route::delete('/{id}', [SeminarController::class, 'destroy'])->name('destroy');
                
                // 3. STEP 1: DATA DETAIL (Edit Data yang sudah dibuat)
                Route::get('/{id}/step-1', [SeminarController::class, 'editStep1'])->name('step1');
                Route::post('/{id}/step-1', [SeminarController::class, 'updateStep1'])->name('step1.update');

                // 4. STEP 2: UPLOAD PAPER
                Route::get('/{id}/step-2', [SeminarController::class, 'createStep2'])->name('step2');
                Route::post('/{id}/step-2', [SeminarController::class, 'storeStep2'])->name('step2.store');

                // Step 3: Finalisasi & Revisi (Dummy Views for now)
                Route::get('/step-3', function () { return Inertia::render('app/dosen/seminar/step-3-finalisasi'); })->name('step3');
                Route::get('/step-3-hasil', function () { return Inertia::render('app/dosen/seminar/step-3-hasil-review'); })->name('step3.hasil');
                Route::get('/step-3-perbaikan', function () { return Inertia::render('app/dosen/seminar/step-3-perbaikan'); })->name('step3.perbaikan');

                // Step 4: Submit Artefak
                Route::get('/step-4', function () { return Inertia::render('app/dosen/seminar/step-4-artefak'); })->name('step4');

                // Step 5: Pencairan Dana
                Route::get('/step-5', function () { return Inertia::render('app/dosen/seminar/step-5-pencairan'); })->name('step5');

                // Step 6: Surat Izin Kerja
                Route::get('/step-6', function () { return Inertia::render('app/dosen/seminar/step-6-mode'); })->name('step6');
                Route::get('/step-6/onsite', function () { return Inertia::render('app/dosen/seminar/step-6-onsite'); })->name('step6.onsite');
                
                // Finish
                Route::get('/finish', function () { return Inertia::render('app/dosen/seminar/step-finish'); })->name('finish');
            });
        });

        // ✅ TAMBAHAN: DUMMY ROUTES UNTUK MENU DOSEN YANG LAIN
        // Agar tidak error saat dipanggil di sidebar
        Route::get('/registrasi/jurnal', function() { return "Halaman Registrasi Jurnal (Dummy)"; })->name('registrasi.jurnal');
        
        Route::prefix('penghargaan')->name('app.penghargaan.buku.')->group(function () {
             Route::get('/buku', [PenghargaanBukuController::class, 'index'])->name('index');
             Route::get('/buku/ajukan', [PenghargaanBukuController::class, 'create'])->name('create');
             Route::post('/buku', [PenghargaanBukuController::class, 'store'])->name('store');
             Route::get('/buku/upload/{id}', [PenghargaanBukuController::class, 'uploadDocs'])->name('upload');
             Route::post('/buku/upload/{id}', [PenghargaanBukuController::class, 'storeUpload'])->name('store-upload');
             Route::get('/buku/{id}', [PenghargaanBukuController::class, 'show'])->name('detail');
             Route::post('/buku/submit/{id}', [PenghargaanBukuController::class, 'submit'])->name('submit');
             Route::get('/buku/{id}/preview-pdf', [PenghargaanBukuController::class, 'previewPdf'])->name('preview-pdf');
             Route::get('/buku/{id}/download-pdf', [PenghargaanBukuController::class, 'downloadPdf'])->name('download-pdf');
        });


        // ------------------------------------------------------------------
        // ROLE: KPRODI (Verifikasi Akademik)
        // ------------------------------------------------------------------
        Route::middleware('role:Kprodi')->prefix('kprodi')->name('kprodi.')->group(function () {
            Route::get('/dashboard', function () {
                return Inertia::render('app/kprodi/kprodi-home-page');
            })->name('home');

            Route::get('/verifikasi', function () {
                return Inertia::render('app/kprodi/verifikasi-page');
            })->name('verifikasi.index');

            Route::get('/verifikasi/{id}', function ($id) {
                return Inertia::render('app/kprodi/detail-verifikasi', ['id' => $id]);
            })->name('verifikasi.detail');

            Route::get('/verifikasi/{id}/tolak', function ($id) {
                return Inertia::render('app/kprodi/tolak-verifikasi', ['id' => $id]);
            })->name('verifikasi.tolak');

            Route::post('/verifikasi/{id}/tolak', function () {
                return redirect()->route('kprodi.verifikasi.index');
            })->name('verifikasi.store-tolak');
        });


        // ------------------------------------------------------------------
        // ROLE: REVIEWER (Review Paper)
        // ------------------------------------------------------------------
        Route::middleware('role:Reviewer')->prefix('reviewer')->name('reviewer.')->group(function () {
            Route::get('/home', function () {
                return Inertia::render('app/reviewer/reviewer-home-page', [
                    'pageName' => 'Dashboard Reviewer'
                ]);
            })->name('home');

            // Seminar Routes
            Route::prefix('seminar')->name('seminar.')->group(function () {
                Route::get('/masuk', function () {
                    return Inertia::render('app/reviewer/seminar/seminar-masuk-page');
                })->name('masuk');

                Route::get('/review/{id}', function ($id) {
                    return Inertia::render('app/reviewer/seminar/seminar-review-page', ['paperId' => $id]);
                })->name('review');

                Route::get('/disetujui', function () {
                    return Inertia::render('app/reviewer/seminar/seminar-disetujui-page');
                })->name('disetujui');
            });

            // ✅ TAMBAHAN: JURNAL ROUTES (Untuk mengatasi error Ziggy)
            Route::prefix('jurnal')->name('jurnal.')->group(function () {
                Route::get('/masuk', function () { 
                    // Gunakan dummy view atau view yang sama jika file belum ada
                    return Inertia::render('app/reviewer/seminar/seminar-masuk-page'); 
                })->name('masuk');

                Route::get('/disetujui', function () {
                    return Inertia::render('app/reviewer/seminar/seminar-disetujui-page');
                })->name('disetujui');
            });
        });


        // ------------------------------------------------------------------
        // ROLE: LPPM KETUA (Approval Akhir)
        // ------------------------------------------------------------------
        Route::middleware('role:LppmKetua')->prefix('lppm/ketua')->name('lppm.ketua.')->group(function () {
            Route::get('/home', function () {
                return Inertia::render('app/lppm/ketua/ketua-home-page');
            })->name('home');

            Route::get('/pengajuan-dana', function () {
                return Inertia::render('app/lppm/ketua/pengajuan-dana-page');
            })->name('pengajuan-dana');

            Route::get('/pengajuan-dana/{id}/konfirmasi', function ($id) {
                return Inertia::render('app/lppm/ketua/detail-konfirmasi-page', ['id' => $id]);
            })->name('pengajuan-dana.konfirmasi');

            Route::get('/pengajuan-dana/{id}/upload', function ($id) {
                return Inertia::render('app/lppm/ketua/pengajuan-dana-upload-page', ['paperId' => $id]);
            })->name('pengajuan-dana.upload');

            Route::get('/pengajuan-dana/{id}/tolak', function ($id) {
                return Inertia::render('app/lppm/ketua/pengajuan-dana-tolak-page', ['paperId' => $id]);
            })->name('pengajuan-dana.tolak');
        });


        // ------------------------------------------------------------------
        // ROLE: LPPM ANGGOTA (Verifikasi Dokumen)
        // ------------------------------------------------------------------
        Route::middleware('role:LppmAnggota')->prefix('lppm/anggota')->name('lppm.anggota.')->group(function () {
            Route::get('/home', function () {
                return Inertia::render('app/lppm/anggota/anggota-home-page');
            })->name('home');

            Route::get('/pengajuan-dana', function () {
                return Inertia::render('app/lppm/anggota/pengajuan-dana-page');
            })->name('pengajuan-dana');

            Route::get('/pengajuan-dana/{id}', function ($id) {
                return Inertia::render('app/lppm/anggota/pengajuan-dana-detail-page', ['id' => $id]);
            })->name('pengajuan-dana.detail');
        });


        // ------------------------------------------------------------------
        // ROLE: KEUANGAN (Pencairan Dana)
        // ------------------------------------------------------------------
        Route::middleware('role:Keuangan')->prefix('keuangan')->name('keuangan.')->group(function () {
            Route::get('/home', function () {
                return Inertia::render('app/keuangan/keuangan-home-page');
            })->name('home');

            Route::get('/pembayaran', function () {
                return Inertia::render('app/keuangan/pembayaran-page');
            })->name('pembayaran');

            Route::get('/pembayaran/{id}', function ($id) {
                return Inertia::render('app/keuangan/pembayaran-detail-page', ['id' => $id]);
            })->name('pembayaran.detail');

            Route::get('/pembayaran/{id}/upload', function ($id) {
                return Inertia::render('app/keuangan/pembayaran-upload-page', ['paperId' => $id]);
            })->name('pembayaran.upload');
        });


        // ------------------------------------------------------------------
        // ROLE: HRD (Surat Tugas Onsite)
        // ------------------------------------------------------------------
        Route::middleware('role:Hrd')->prefix('hrd')->name('hrd.')->group(function () {
            Route::get('/dashboard', function () {
                return Inertia::render('app/hrd/hrd-home-page');
            })->name('home');

            Route::get('/surat-tugas', function () {
                return Inertia::render('app/hrd/surat-tugas-page');
            })->name('surat-tugas.index');

            Route::get('/surat-tugas/{id}/upload', function ($id) {
                return Inertia::render('app/hrd/surat-tugas-upload-page', ['id' => $id]);
            })->name('surat-tugas.upload');

            Route::post('/surat-tugas/{id}/upload', function () {
                return redirect()->route('hrd.surat-tugas.index');
            })->name('surat-tugas.store');
        });

    }); // End Middleware Check Auth
});