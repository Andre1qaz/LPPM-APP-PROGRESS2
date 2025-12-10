import React, { useState } from 'react';
import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CircleArrowUp, Download } from "lucide-react";
import { route } from "ziggy-js";

export default function KetuaPengajuanDanaPage({ papers = [] }) {
    const [filter, setFilter] = useState('all');

    // Filter Logic (Simple Client-Side)
    const filteredPapers = papers.filter(item => {
        if (filter === 'all') return true;
        if (filter === 'pending') return !item.sudahReview;
        if (filter === 'reviewed') return item.sudahReview;
        return true;
    });

    return (
        <AppLayout breadcrumbs={[
            { title: 'Beranda', href: '/lppm/ketua/home' },
            { title: 'Pengajuan Dana', href: '#' }
        ]}>
            <Head title="Pengajuan Dana" />

            <div className="w-full max-w-6xl mx-auto px-6 py-8 space-y-8">

                {/* ================= HEADER CARD ================= */}
                <Card className="shadow-sm border-none bg-transparent shadow-none">
                    <CardContent className="p-0">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                            Daftar Pengajuan Dana
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Verifikasi dan persetujuan akhir pengajuan dana dosen.
                        </p>
                    </CardContent>
                </Card>

                {/* ================= FILTER BAR ================= */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Search */}
                    <div className="relative w-full md:w-1/3">
                        <input
                            type="text"
                            placeholder="Cari judul atau dosen..."
                            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                        />
                    </div>

                    {/* Filter Select */}
                    <select
                        className="border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-black w-full md:w-auto"
                        onChange={(e) => setFilter(e.target.value)}
                        value={filter}
                    >
                        <option value="all">Semua Status</option>
                        <option value="pending">Belum Dikonfirmasi</option>
                        <option value="reviewed">Sudah Direview</option>
                    </select>
                </div>

                {/* ================= LIST CONTENT ================= */}
                <div className="space-y-4">
                    {filteredPapers.map((item) => (
                        <Card key={item.id} className="border shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                                
                                {/* LEFT: Icon & Info */}
                                <div className="flex items-center gap-4 w-full md:w-2/3">
                                    <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center text-white shrink-0">
                                        <CircleArrowUp className="h-6 w-6" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-base text-gray-900 truncate">
                                            {item.judul}
                                        </h3>
                                        <p className="text-sm text-gray-500 truncate">
                                            Pengaju: {item.pengaju}
                                        </p>
                                    </div>
                                </div>

                                {/* RIGHT: Actions & Status */}
                                <div className="flex flex-col items-end gap-2 w-full md:w-auto self-stretch justify-between">
                                    
                                    {/* Status Badge */}
                                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${
                                        item.sudahReview 
                                            ? 'bg-green-50 text-green-700 border-green-200' 
                                            : 'bg-orange-50 text-orange-700 border-orange-200'
                                    }`}>
                                        {item.sudahReview ? "Sudah Direview" : "Menunggu Konfirmasi"}
                                    </span>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 mt-1">
                                        {!item.sudahReview ? (
                                            <>
                                                {/* Tombol Tolak */}
                                                <Link href={route("lppm.ketua.pengajuan-dana.tolak", item.id)}>
                                                    <Button variant="outline" className="h-8 text-xs border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                                                        Tolak
                                                    </Button>
                                                </Link>

                                                {/* Tombol Konfirmasi */}
                                                <Link href={route("lppm.ketua.pengajuan-dana.konfirmasi", item.id)}>
                                                    <Button className="h-8 text-xs bg-black text-white hover:bg-gray-800">
                                                        Konfirmasi
                                                    </Button>
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                {/* Tombol Download (Dummy) */}
                                                <Button variant="outline" className="h-8 text-xs gap-2 border-gray-300">
                                                    <Download className="w-3.5 h-3.5" />
                                                    Paper
                                                </Button>

                                                {/* Tombol Review */}
                                                <Link href={route("lppm.ketua.pengajuan-dana.review", item.id)}>
                                                    <Button className="h-8 text-xs bg-black text-white hover:bg-gray-800">
                                                        Review Paper
                                                    </Button>
                                                </Link>
                                            </>
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

                    {filteredPapers.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground bg-gray-50/50 rounded-lg border border-dashed w-full">
                            Tidak ada pengajuan dana yang sesuai filter.
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}