import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CircleArrowUp, Download } from 'lucide-react';
import { route } from 'ziggy-js';

export default function VerifikasiPage() {
    // Data Dummy Pengajuan Masuk (Update: Tambah status "Menunggu konfirmasi LPPM")
    const incomingRequests = [
        { 
            id: 1, 
            dosen: "Pak Budi Santoso", 
            judul: "Implementasi Cloud Computing pada Smart Village", 
            tanggal: "20 Nov 2024",
            status: "Menunggu Verifikasi"
        },
        { 
            id: 2, 
            dosen: "Bu Siti Aminah", 
            judul: "Algoritma Genetika untuk Optimasi Rute", 
            tanggal: "21 Nov 2024",
            status: "Menunggu Verifikasi"
        },
        // Data Baru: Contoh yang sudah disetujui Kprodi
        { 
            id: 3, 
            dosen: "Pak Joko Anwar", 
            judul: "Pengembangan Sistem IoT untuk Monitoring Air Danau Toba", 
            tanggal: "19 Nov 2024",
            status: "Menunggu konfirmasi LPPM"
        },
    ];

    // Helper untuk warna badge status
    const getStatusColor = (status) => {
        if (status === 'Menunggu Verifikasi') {
            return 'bg-orange-50 text-orange-700 border-orange-200';
        }
        if (status === 'Menunggu konfirmasi LPPM') {
            return 'bg-blue-50 text-blue-700 border-blue-200';
        }
        return 'bg-gray-50 text-gray-700 border-gray-200';
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Beranda', href: '/kprodi/dashboard' },
            { title: 'Daftar Pengajuan', href: '/kprodi/verifikasi' }
        ]}>
            <Head title="Verifikasi Akademik" />
            
            <div className="w-full max-w-6xl mx-auto p-6 pt-0 pb-24 space-y-8">
                
                {/* Header Judul */}
                <Card className="shadow-sm border-none bg-transparent shadow-none">
                    <CardContent className="p-0 flex justify-between items-center">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                            Daftar Pengajuan Dana
                        </h1>
                    </CardContent>
                </Card>

                {/* List Pengajuan (Card View) */}
                <div className="space-y-4">
                    {incomingRequests.map((req) => (
                        <Card key={req.id} className="border shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                                
                                {/* Bagian Kiri: Ikon & Info */}
                                <div className="flex items-center gap-4 w-full md:w-1/2">
                                    <div className="shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-black text-white">
                                        <CircleArrowUp className="w-6 h-6" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-base text-gray-900 truncate">
                                            {req.judul}
                                        </h3>
                                        <p className="text-sm text-muted-foreground truncate">
                                            Pengaju: {req.dosen}
                                        </p>
                                    </div>
                                </div>

                                {/* Bagian Kanan: Status, Tanggal & Aksi */}
                                <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className="text-muted-foreground">{req.tanggal}</span>
                                        <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(req.status)}`}>
                                            {req.status}
                                        </span>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        {/* Tombol Download Paper (Baru) */}
                                        <Button variant="outline" className="h-9 text-xs gap-2 border-gray-300">
                                            <Download className="w-3.5 h-3.5" />
                                            Download Paper
                                        </Button>

                                        {/* Tombol Review Artefak (Renamed) */}
                                        <Link href={route('kprodi.verifikasi.detail', req.id)}>
                                            <Button className="h-9 bg-black text-white hover:bg-gray-800 text-xs px-6">
                                                Review Artefak
                                            </Button>
                                        </Link>
                                    </div>
                                </div>

                            </CardContent>
                        </Card>
                    ))}

                    {/* Empty State */}
                    {incomingRequests.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                            Tidak ada pengajuan dana yang perlu diverifikasi saat ini.
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}