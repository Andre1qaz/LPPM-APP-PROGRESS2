import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SeminarStepper from '@/components/seminar-stepper';
import { Button } from '@/components/ui/button';
import { route } from 'ziggy-js';

export default function Step5Pencairan() {
    // State untuk Simulasi Tampilan (Default: 'kprodi')
    // Opsi: 'kprodi', 'lppm', 'keuangan'
    const [status, setStatus] = useState('kprodi'); 

    return (
        <AppLayout breadcrumbs={[
            { title: 'Beranda', href: '/dosen/dashboard' },
            { title: 'Registrasi Seminar', href: '/dosen/seminar' },
            { title: 'Tahap 5', href: '#' }
        ]}>
            <Head title="Pencairan Dana" />

            <div className="w-full max-w-6xl mx-auto px-6 py-6 pb-24">
                
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold">Pengajuan Dana Registrasi Seminar</h1>
                </div>

                {/* Stepper (Step 5 Active) */}
                <SeminarStepper currentStep={5} />

                <div className="mt-20 flex flex-col items-center justify-center space-y-6 text-center">
                    
                    {/* === STATUS 1: MENUNGGU KPRODI === */}
                    {status === 'kprodi' && (
                        <>
                            <h2 className="text-2xl font-bold">
                                Mohon menunggu konfirmasi dari Kepala Prodi
                            </h2>
                            <div className="relative flex items-center justify-center pt-4">
                                {/* Spinner Loading Hitam */}
                                <div className="w-24 h-24 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
                            </div>
                            <p className="text-muted-foreground max-w-md mt-4">
                                Dokumen Anda sedang diverifikasi secara akademik oleh Kepala Program Studi. Notifikasi akan dikirim setelah disetujui.
                            </p>
                        </>
                    )}

                    {/* === STATUS 2: MENUNGGU LPPM === */}
                    {status === 'lppm' && (
                        <>
                            <h2 className="text-2xl font-bold">
                                Mohon menunggu konfirmasi dari LPPM
                            </h2>
                            <div className="relative flex items-center justify-center pt-4">
                                {/* FIX: Spinner Loading jadi Hitam (sebelumnya biru/hijau) */}
                                <div className="w-24 h-24 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
                            </div>
                            <p className="text-muted-foreground max-w-md mt-4">
                                KPRODI telah menyetujui. Saat ini dokumen sedang diverifikasi secara administratif oleh tim LPPM.
                            </p>
                        </>
                    )}

                    {/* === STATUS 3: MENUNGGU KEUANGAN (DISETUJUI) === */}
                    {status === 'keuangan' && (
                        <>
                            {/* FIX: Teks 'Disetujui' jadi Hitam (Standard) */}
                            <h2 className="text-2xl font-bold text-black">
                                Pengajuan dana Anda disetujui!
                            </h2>
                            <p className="text-lg font-medium text-muted-foreground">
                                Silahkan menunggu pencairan dana dilakukan oleh Bagian Keuangan.
                            </p>
                            <div className="relative flex items-center justify-center pt-4">
                                {/* FIX: Spinner Loading jadi Hitam */}
                                <div className="w-24 h-24 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
                            </div>
                        </>
                    )}

                    {/* === TOMBOL SIMULASI (HANYA UNTUK DEV) === */}
                    <div className="fixed bottom-10 right-10 z-50 flex flex-col gap-2 bg-white p-2 rounded-lg shadow-lg border opacity-80 hover:opacity-100">
                        <span className="text-[10px] font-bold text-center text-gray-500">DEV CONTROLS</span>
                        
                        {status === 'kprodi' && (
                            <Button onClick={() => setStatus('lppm')} size="sm" variant="outline">
                                Simulate: KPRODI Approve &gt;
                            </Button>
                        )}

                        {status === 'lppm' && (
                            <Button onClick={() => setStatus('keuangan')} size="sm" variant="outline">
                                Simulate: LPPM Approve &gt;
                            </Button>
                        )}

                        {status === 'keuangan' && (
                            <Link href={route('dosen.seminar.step6')}>
                                <Button size="sm" className="w-full bg-black text-white">
                                    Simulate: Dana Cair (Next Step) &gt;
                                </Button>
                            </Link>
                        )}
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}