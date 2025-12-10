import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SeminarStepper from '@/components/seminar-stepper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { route } from 'ziggy-js';

export default function Step4Artefak() {
    // Daftar Artefak sesuai gambar Figma/SRS
    const artifacts = [
        "Bukti review oleh sesama dosen",
        "Bukti submit paper ke penyelenggara",
        "Bukti makalah diterima",
        "Catatan Reviewer panitia",
        "Bukti registrasi keikutsertaan mengikuti seminar",
        "Softcopy versi final paper"
    ];

    return (
        <AppLayout breadcrumbs={[
            { title: 'Beranda', href: '/dosen/dashboard' },
            { title: 'Registrasi Seminar', href: '/dosen/seminar' },
            { title: 'Tahap 4', href: '#' }
        ]}>
            <Head title="Submit Artefak" />

            <div className="w-full max-w-6xl mx-auto px-6 py-6 pb-24">
                
                {/* Header Judul */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold">Pengajuan Dana Registrasi Seminar</h1>
                </div>

                {/* Stepper Component (Step 4 Active) */}
                <SeminarStepper currentStep={4} />

                {/* Konten Form Artefak */}
                <div className="mt-10 space-y-8">
                    
                    <h2 className="text-2xl font-bold">Submit Artefak</h2>

                    <div className="space-y-6">
                        {artifacts.map((label, index) => (
                            <div key={index} className="border rounded-lg p-4 bg-white shadow-sm space-y-3">
                                <Label className="text-sm font-semibold text-gray-800">
                                    {label}
                                </Label>
                                <Input 
                                    placeholder="Link gdrive" 
                                    className="bg-gray-50 border-gray-200 text-sm"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Tombol Submit (Lanjut ke Pencairan/Menunggu) */}
                    <div className="flex justify-end pt-4">
                        <Link href={route('dosen.seminar.step5')}>
                            <Button className="bg-black text-white hover:bg-gray-800 px-6 min-w-[150px]">
                                Submit Artefak
                            </Button>
                        </Link>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}