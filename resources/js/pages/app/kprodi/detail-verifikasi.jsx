import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft, FileText, ExternalLink } from 'lucide-react';
import { route } from 'ziggy-js';

export default function DetailVerifikasi({ id }) {
    
    // Data Dummy Artefak
    const artifacts = [
        { label: "Bukti review oleh sesama dosen", link: "https://drive.google.com/file/d/1ExampleLink..." },
        { label: "Bukti submit paper ke penyelenggara", link: "https://drive.google.com/file/d/2ExampleLink..." },
        { label: "Bukti makalah diterima (LoA)", link: "https://drive.google.com/file/d/3ExampleLink..." },
        { label: "Catatan Reviewer panitia", link: "https://drive.google.com/file/d/4ExampleLink..." },
        { label: "Bukti registrasi keikutsertaan", link: "https://drive.google.com/file/d/5ExampleLink..." },
        { label: "Softcopy versi final paper", link: "https://drive.google.com/file/d/6ExampleLink..." },
    ];

    return (
        <AppLayout breadcrumbs={[
            { title: 'Beranda', href: '/kprodi/dashboard' },
            { title: 'Daftar Pengajuan', href: '/kprodi/verifikasi' },
            { title: 'Review Artefak', href: '#' }
        ]}>
            <Head title="Review Artefak" />

            <div className="w-full max-w-5xl mx-auto p-8 space-y-10 bg-white min-h-screen">
                
                {/* Header Navigation & Judul Utama */}
                <div className="flex items-center gap-4 mt-4">
                    <Link href={route('kprodi.verifikasi.index')}>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-gray-100">
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                    </Link>
                    
                    <div className="flex-1 text-center pr-14">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            Pengajuan Dana Registrasi Seminar
                        </h1>
                    </div>
                </div>

                {/* Section Review Artefak */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <FileText className="w-6 h-6" /> Review Artefak
                    </h2>

                    {/* Informasi Pengaju */}
                    <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                        <p className="text-sm text-blue-800">
                            <strong>Pengaju:</strong> Pak Budi Santoso (12345678) - Informatika
                        </p>
                    </div>

                    {/* List Artefak */}
                    <div className="space-y-4">
                        {artifacts.map((item, index) => (
                            <div key={index} className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="space-y-3">
                                    <Label className="text-base font-medium text-gray-900">
                                        {item.label}
                                    </Label>
                                    <div className="flex gap-2">
                                        <Input 
                                            readOnly 
                                            value={item.link} 
                                            className="bg-gray-50 border-gray-200 text-gray-500 cursor-pointer h-10 px-3"
                                        />
                                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" size="icon" title="Buka Link" className="h-10 w-10 shrink-0 border-gray-300">
                                                <ExternalLink className="w-4 h-4" />
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="flex justify-end gap-4 pt-4 pb-10 border-t mt-8">
                    
                    {/* Tombol Tolak -> Ke Halaman Tolak */}
                    <Link href={route('kprodi.verifikasi.tolak', id)}>
                        <Button 
                            variant="secondary" 
                            className="bg-red-600 text-white hover:bg-red-700 px-6 py-5 rounded-md text-sm font-medium min-w-[160px]"
                        >
                            Tolak Pendanaan
                        </Button>
                    </Link>

                    {/* PERBAIKAN: Tombol Setujui -> Ke Halaman Index (Daftar Pengajuan) */}
                    <Link href={route('kprodi.verifikasi.index')}>
                        <Button 
                            className="bg-[#1a1a1a] text-white hover:bg-black/90 px-6 py-5 rounded-md text-sm font-medium min-w-[160px]"
                        >
                            Setujui Pendanaan
                        </Button>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}