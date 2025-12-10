import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SeminarStepper from '@/components/seminar-stepper';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CircleArrowUp } from 'lucide-react'; // CheckCircle dihapus agar konsisten
import { route } from 'ziggy-js';

export default function Step3HasilReview() {
    const reviews = [
        {
            id: 1,
            judul: "Judul Paper 1 (Belum Diperbaiki)",
            reviewer: "Reviewer 1",
            status: "Menunggu Perbaikan/Revisi",
            tanggal: "20 Nov 2024",
            review_ke: 1,
            is_actionable: true,
            is_approved: false,
        },
        {
            id: 2,
            judul: "Judul Paper 2 (Sudah Submit)",
            reviewer: "Reviewer 2",
            status: "Menunggu Konfirmasi Reviewer",
            tanggal: "21 Nov 2024",
            review_ke: 2,
            is_actionable: false,
            is_approved: false,
        },
        {
            id: 3,
            judul: "Judul Paper 3 (Final)",
            reviewer: "Reviewer 1",
            status: "Disetujui",
            tanggal: "22 Nov 2024",
            review_ke: 2,
            is_actionable: false,
            is_approved: true, 
        }
    ];

    const canProceed = reviews.some(r => r.is_approved);

    return (
        <AppLayout breadcrumbs={[
            { title: 'Beranda', href: '/dosen/dashboard' },
            { title: 'Registrasi Seminar', href: '/dosen/seminar' },
            { title: 'Tahap 3', href: '#' }
        ]}>
            <Head title="Hasil Review" />

            <div className="relative w-full max-w-6xl mx-auto px-6 py-6 pb-32">
                
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold">Pengajuan Dana Registrasi Seminar</h1>
                </div>

                <SeminarStepper currentStep={3} />

                <div className="mt-10 space-y-6">
                    <h2 className="text-2xl font-bold">Hasil Review</h2>

                    <div className="space-y-4">
                        {reviews.map((item) => (
                            <Card key={item.id} className="border shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                                    
                                    {/* Info Kiri */}
                                    <div className="flex items-center gap-4 md:w-1/3">
                                        {/* FIX: Ikon Konsisten (Selalu Hitam & CircleArrowUp) */}
                                        <div className="shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-black text-white">
                                            <CircleArrowUp className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-base">{item.judul}</h3>
                                            <p className="text-sm text-gray-500">{item.reviewer}</p>
                                        </div>
                                    </div>

                                    {/* Status & Actions Kanan */}
                                    <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                                        
                                        {/* Status Badge */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">Status :</span>
                                            <span className={`text-xs font-medium px-2 py-1 rounded ${item.is_approved ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                {item.status}
                                            </span>
                                        </div>
                                        
                                        <div className="flex gap-3">
                                            {/* LOGIKA TOMBOL AKSI */}
                                            {item.is_approved ? (
                                                <Button variant="outline" className="h-9 text-xs font-medium border-gray-300">
                                                    Download Formulir Perbaikan
                                                </Button>
                                            ) : item.is_actionable ? (
                                                <Link href={route('dosen.seminar.step3.perbaikan')}>
                                                    <Button className="h-9 text-xs font-medium bg-black text-white hover:bg-gray-800">
                                                        Lakukan Perbaikan
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Button disabled variant="ghost" className="h-9 text-xs font-medium text-gray-400 cursor-not-allowed">
                                                    Sedang Ditinjau
                                                </Button>
                                            )}

                                            {/* TOMBOL DOWNLOAD (Selalu Muncul jika belum disetujui) */}
                                            {!item.is_approved && (
                                                <Button variant="outline" className="h-9 text-xs font-medium border-gray-300">
                                                    Download Hasil Review
                                                </Button>
                                            )}
                                        </div>

                                        <div className="text-[10px] text-gray-400 mt-1 w-full text-right flex justify-between md:justify-end gap-4">
                                            <span>Revisi ke-{item.review_ke}</span>
                                            <span>{item.tanggal}</span>
                                        </div>
                                    </div>

                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Tombol Tahap Selanjutnya */}
                    {canProceed && (
                        <div className="flex justify-end pt-8">
                            <Link href={route('dosen.seminar.step4')}>
                                <Button className="bg-black text-white hover:bg-gray-800 px-8 h-10 rounded-md">
                                    Tahap Selanjutnya
                                </Button>
                            </Link>
                        </div>
                    )}

                </div>
            </div>
        </AppLayout>
    );
}