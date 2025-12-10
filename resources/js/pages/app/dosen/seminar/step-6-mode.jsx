import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SeminarStepper from '@/components/seminar-stepper';
import { Button } from '@/components/ui/button';
import { route } from 'ziggy-js';

export default function Step6Mode() {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Beranda', href: '/dosen/dashboard' },
            { title: 'Registrasi Seminar', href: '/dosen/seminar' },
            { title: 'Tahap 6', href: '#' }
        ]}>
            <Head title="Surat Izin Kerja" />

            <div className="w-full max-w-6xl mx-auto px-6 py-6 pb-24">
                
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold">Pengajuan Dana Registrasi Seminar</h1>
                </div>

                {/* Stepper (Step 6 Active) */}
                <SeminarStepper currentStep={6} />

                <div className="mt-20 flex flex-col items-center justify-center space-y-12 text-center">
                    
                    {/* Status Dana Cair */}
                    <h2 className="text-3xl font-bold text-black">
                        Dana sudah dicairkan !
                    </h2>

                    {/* Pertanyaan Surat Izin */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-black">
                            Ajukan Surat Ijin ?
                        </h3>

                        <div className="flex gap-6 justify-center">
                            {/* Pilihan 1: Onsite -> Ke Halaman Upload Request */}
                            <Link href={route('dosen.seminar.step6.onsite')}>
                                <Button variant="outline" className="h-12 px-8 text-base border-gray-300 hover:bg-gray-50">
                                    Ajukan(onsite)
                                </Button>
                            </Link>

                            {/* Pilihan 2: Daring -> Ke Halaman Selesai */}
                          <Link href={route('dosen.seminar.finish')}>
                              <Button variant="outline" className="h-12 px-8 text-base border-gray-300 hover:bg-gray-50">
                                  Tidak(Daring)
                              </Button>
                          </Link>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}