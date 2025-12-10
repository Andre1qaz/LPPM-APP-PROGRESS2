import React from 'react';
import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { CircleArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button"; // Menggunakan komponen Button konsisten
import { route } from "ziggy-js";

export default function PembayaranPage({ papers = [] }) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Beranda', href: '/keuangan/home' },
            { title: 'Pembayaran', href: '#' }
        ]}>
            <Head title="Pembayaran" />

            <div className="w-full max-w-6xl mx-auto px-6 py-8 space-y-8">
                
                {/* ================= TITLE BOX ================= */}
                <div className="border rounded-lg bg-white shadow-sm p-6">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Daftar Jurnal yang Harus Dicairkan
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Kelola pencairan dana untuk paper yang telah disetujui LPPM.
                    </p>
                </div>

                {/* ================= SEARCH + FILTER ================= */}
                <div className="flex justify-between items-center gap-4">
                    <input
                        placeholder="Cari judul paper..."
                        className="border rounded-md px-3 py-2 w-full md:w-1/3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                    />
                    <Button variant="outline" className="h-10 px-4">
                        Filter ▼
                    </Button>
                </div>

                {/* ================= LIST CARD ================= */}
                <div className="space-y-4">
                    {papers.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col md:flex-row items-center justify-between bg-white 
                                       border shadow-sm rounded-xl p-5 gap-4 hover:shadow-md transition-shadow"
                        >
                            {/* BAGIAN KIRI: Icon & Info Utama */}
                            <div className="flex items-center gap-4 w-full md:w-2/3">
                                <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center text-white shrink-0">
                                    <CircleArrowUp className="h-6 w-6" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-base text-gray-900 truncate">
                                        {item.judul}
                                    </h3>
                                    <p className="text-sm text-gray-500 truncate">
                                        {/* Menggunakan item.penulis (sesuai route) atau item.pengaju (sesuai view lama) sebagai fallback */}
                                        Pengaju: {item.penulis || item.pengaju || "Nama Pengaju"}
                                    </p>
                                </div>
                            </div>

                            {/* BAGIAN KANAN: Status, Tombol, Tanggal */}
                            <div className="flex flex-col items-end gap-2 w-full md:w-auto self-stretch justify-between">
                                
                                {/* 1. STATUS (Baru Ditambahkan) */}
                                <span className="px-2 py-1 rounded-md text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">
                                    {item.status || "Menunggu Pembayaran"}
                                </span>

                                {/* 2. TOMBOL AKSI */}
                                <div className="flex gap-2 mt-1">
                                    <Link href={route("keuangan.pembayaran.detail", item.id)}>
                                        <Button variant="outline" className="h-8 text-xs border-gray-300">
                                            Lihat Detail
                                        </Button>
                                    </Link>

                                    <Link href={route("keuangan.pembayaran.upload", item.id)}>
                                        <Button className="h-8 text-xs bg-black text-white hover:bg-gray-800">
                                            Lakukan Pembayaran
                                        </Button>
                                    </Link>
                                </div>

                                {/* 3. TANGGAL (Pindah ke Bawah Kanan) */}
                                <span className="text-xs text-muted-foreground font-medium">
                                    {item.tanggal}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* EMPTY STATE */}
                    {papers.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground bg-gray-50/50 rounded-lg border border-dashed w-full">
                            Belum ada data pembayaran yang perlu diproses.
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}