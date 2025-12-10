import React, { useState } from 'react';
import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import Swal from "sweetalert2";
import { CircleArrowUp, Download, CheckCircle2, XCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { route } from "ziggy-js";

export default function SeminarMasukPage({ papers = [], pageName }) {
    
    // State lokal untuk menangani perubahan status UI (Simulasi)
    // Property 'status_review' bisa bernilai: 'pending' | 'approved' | 'confirmed'
    const [localPapers, setLocalPapers] = useState(papers.map(p => ({
        ...p,
        status_review: 'pending' 
    })));

    // 1. Handler SETUJU (Ubah status ke 'approved')
    const handleApprove = (id) => {
        Swal.fire({
            icon: "success",
            title: "Permintaan Diterima",
            text: "Anda menyetujui untuk mereview paper ini. Silakan lakukan review.",
            confirmButtonText: "Lanjut",
            confirmButtonColor: "#000000",
            customClass: { popup: 'rounded-xl' }
        }).then(() => {
            setLocalPapers(prev => prev.map(item => 
                item.id === id ? { ...item, status_review: 'approved' } : item
            ));
        });
    };

    // 2. Handler TOLAK (Hapus/Non-aktifkan)
    const handleReject = (id) => {
        Swal.fire({
            icon: "error",
            title: "Permintaan Ditolak",
            text: "Anda menolak untuk mereview paper ini.",
            confirmButtonText: "Tutup",
            confirmButtonColor: "#ef4444",
            customClass: { popup: 'rounded-xl' }
        });
    };

    // 3. Handler KONFIRMASI (Ubah status ke 'confirmed')
    const handleConfirm = (id) => {
        Swal.fire({
            icon: "success",
            title: "Review Selesai!",
            text: "Hasil review telah dikirim ke Dosen dan LPPM.",
            confirmButtonText: "Selesai",
            confirmButtonColor: "#16a34a", // Hijau
            customClass: { popup: 'rounded-xl' }
        }).then(() => {
            // REVISI: Ubah status menjadi 'confirmed' agar tombol berubah
            setLocalPapers(prev => prev.map(item => 
                item.id === id ? { ...item, status_review: 'confirmed' } : item
            ));
        });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Beranda', href: '/reviewer/home' },
            { title: 'Seminar Masuk', href: '#' }
        ]}>
            <Head title={pageName} />

            <div className="w-full max-w-6xl mx-auto px-6 py-8 space-y-8">
                
                {/* ==== HEADER ==== */}
                <Card className="shadow-sm border-none bg-transparent shadow-none">
                    <CardContent className="p-0">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                            {pageName}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Daftar paper seminar yang perlu direview.
                        </p>
                    </CardContent>
                </Card>

                {/* ==== FILTER ==== */}
                <div className="flex justify-between items-center gap-4">
                    <div className="relative w-full md:w-1/3">
                        <input
                            type="text"
                            placeholder="Cari paper..."
                            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                        />
                    </div>
                </div>

                {/* ==== LIST ==== */}
                <div className="space-y-4">
                    {localPapers.map((item) => (
                        <Card key={item.id} className="border shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                                
                                {/* LEFT: Icon & Info */}
                                <div className="flex items-center gap-4 w-full md:w-2/3">
                                    {/* Icon berubah warna sesuai status */}
                                    <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white shrink-0 transition-colors duration-300 ${
                                        item.status_review === 'confirmed' ? 'bg-green-600' :
                                        item.status_review === 'approved' ? 'bg-blue-600' : 'bg-black'
                                    }`}>
                                        {item.status_review === 'confirmed' ? <CheckCircle2 className="h-6 w-6" /> : <CircleArrowUp className="h-6 w-6" />}
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="font-bold text-base text-gray-900 truncate">
                                            {item.judul}
                                        </h3>
                                        <p className="text-sm text-gray-500 truncate">
                                            Pengaju: {item.pengaju}
                                        </p>
                                        {/* Label Status Kecil */}
                                        {item.status_review === 'confirmed' && (
                                            <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded mt-1 inline-block">
                                                Selesai Direview
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* RIGHT: Actions & Date */}
                                <div className="flex flex-col items-end gap-2 w-full md:w-auto self-stretch justify-between">
                                    
                                    <div className="flex gap-2 mt-1">
                                        
                                        {/* KONDISI 1: BELUM DISETUJUI (Pending) */}
                                        {item.status_review === 'pending' && (
                                            <>
                                                <Button variant="outline" className="h-8 text-xs gap-2 border-gray-300">
                                                    <Download className="w-3.5 h-3.5" />
                                                    Download Paper
                                                </Button>

                                                <Button 
                                                    onClick={() => handleReject(item.id)}
                                                    variant="outline"
                                                    className="h-8 text-xs border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 gap-2"
                                                >
                                                    <XCircle className="w-3.5 h-3.5" />
                                                    Tolak
                                                </Button>

                                                <Button 
                                                    onClick={() => handleApprove(item.id)}
                                                    className="h-8 text-xs bg-black text-white hover:bg-gray-800 gap-2"
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    Setuju
                                                </Button>
                                            </>
                                        )}

                                        {/* KONDISI 2: DISETUJUI & SEDANG REVIEW (Approved) */}
                                        {item.status_review === 'approved' && (
                                            <>
                                                <Button variant="outline" className="h-8 text-xs gap-2 border-gray-300">
                                                    <Download className="w-3.5 h-3.5" />
                                                    Download Paper
                                                </Button>

                                                <Link href={route("reviewer.seminar.review", item.id)}>
                                                    <Button variant="outline" className="h-8 text-xs border-blue-200 text-blue-700 hover:bg-blue-50 gap-2">
                                                        <FileText className="w-3.5 h-3.5" />
                                                        Review Paper
                                                    </Button>
                                                </Link>

                                                <Button 
                                                    onClick={() => handleConfirm(item.id)}
                                                    className="h-8 text-xs bg-green-600 text-white hover:bg-green-700 gap-2"
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    Konfirmasi
                                                </Button>
                                            </>
                                        )}

                                        {/* KONDISI 3: SELESAI (Confirmed) - HANYA DOWNLOAD */}
                                        {item.status_review === 'confirmed' && (
                                            <Button variant="outline" className="h-8 text-xs gap-2 border-gray-300 text-gray-600">
                                                <Download className="w-3.5 h-3.5" />
                                                Download Paper
                                            </Button>
                                        )}

                                    </div>

                                    {/* Date */}
                                    <span className="text-xs text-muted-foreground font-medium">
                                        {item.tanggal}
                                    </span>
                                </div>

                            </CardContent>
                        </Card>
                    ))}

                    {/* NO DATA */}
                    {localPapers.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground bg-gray-50/50 rounded-lg border border-dashed w-full">
                            Belum ada paper seminar yang masuk.
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}