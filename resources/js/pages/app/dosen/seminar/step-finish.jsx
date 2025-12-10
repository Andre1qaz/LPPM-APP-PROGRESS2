import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SeminarStepper from '@/components/seminar-stepper';
import { Button } from '@/components/ui/button';
import { route } from 'ziggy-js';

export default function StepFinish() {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Beranda', href: '/dosen/dashboard' },
            { title: 'Registrasi Seminar', href: '/dosen/seminar' },
            { title: 'Selesai', href: '#' }
        ]}>
            <Head title="Pengajuan Selesai" />

            <div className="w-full max-w-6xl mx-auto px-6 py-6 pb-24">
                
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold">Pengajuan Dana Registrasi Seminar</h1>
                </div>

                {/* Stepper Full (7) */}
                <SeminarStepper currentStep={7} />

                <div className="mt-20 flex flex-col items-center justify-center space-y-8 text-center animate-in fade-in zoom-in duration-500">
                    
                    {/* ICON CENTANG DIHAPUS */}

                    {/* Tambahkan padding-top agar tidak terlalu mepet ke atas setelah icon hilang */}
                    <div className="space-y-2 pt-10">
                        <h2 className="text-3xl font-bold text-black">
                            Pengajuan Dana Registrasi Seminar sudah selesai !
                        </h2>
                        <p className="text-xl text-muted-foreground font-medium">
                            Semangat mengikuti seminarnya :)
                        </p>
                    </div>

                    <div className="pt-8 w-full max-w-md">
                        <Link href={route('dosen.seminar.index')}>
                            <Button className="h-14 w-full bg-black text-white hover:bg-gray-800 text-lg font-medium rounded-lg shadow-md">
                                Kembali ke Daftar Seminar
                            </Button>
                        </Link>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}