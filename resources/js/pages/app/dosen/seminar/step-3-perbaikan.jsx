import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SeminarStepper from '@/components/seminar-stepper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { route } from 'ziggy-js';

export default function Step3Perbaikan() {
    // Data Dummy Catatan Reviewer
    const reviewNotes = [
        { 
            id: 1, 
            catatan: "Abstraknya mohon diperbaiki lagi, bahasa yang digunakan tidak baku", 
            respon: "Sudah saya perbaiki menjadi baku dan sesuai kaidah di halaman abstrak" 
        },
        { 
            id: 2, 
            catatan: "Tambahkan referensi terbaru minimal 5 tahun terakhir", 
            respon: "Sudah ditambahkan 5 jurnal internasional terbaru di daftar pustaka" 
        },
        { 
            id: 3, 
            catatan: "Format penulisan tabel tidak sesuai template", 
            respon: "Tabel 1 dan 2 sudah disesuaikan dengan template seminar" 
        },
    ];

    return (
        <AppLayout breadcrumbs={[
            { title: 'Beranda', href: '/dosen/dashboard' },
            { title: 'Registrasi Seminar', href: '/dosen/seminar' },
            { title: 'Perbaikan Paper', href: '#' }
        ]}>
            <Head title="Perbaikan Paper" />

            <div className="w-full max-w-6xl mx-auto px-6 py-6 pb-24">
                
                {/* Header Judul */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold">Pengajuan Dana Registrasi Seminar</h1>
                </div>

                {/* Stepper Component (Step 3 Active) */}
                <SeminarStepper currentStep={3} />

                {/* Konten Utama */}
                <div className="mt-10 space-y-8">
                    
                    <h2 className="text-2xl font-bold">Perbaikan Paper Reviewer 1</h2>

                    {/* 1. Upload Paper Revisi */}
                    <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4">
                        <Label className="md:col-span-2 font-medium text-gray-700">Submit Paper</Label>
                        <div className="md:col-span-10 flex gap-4">
                            <Input defaultValue="Value" className="bg-white flex-1" readOnly />
                            <div className="relative">
                                <input 
                                    type="file" 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                />
                                <Button variant="outline" className="bg-white border-gray-300 text-gray-700 font-normal min-w-[150px]">
                                    Choose File
                                </Button>
                            </div>
                            <span className="text-sm text-gray-500 self-center whitespace-nowrap">No file chosen</span>
                        </div>
                    </div>

                    {/* 2. Tabel Catatan & Respon */}
                    <div className="border rounded-md bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="w-1/2 font-bold text-gray-900 p-4">Catatan Reviewer</TableHead>
                                    <TableHead className="w-1/2 font-bold text-gray-900 p-4 border-l">Status Perbaikan</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reviewNotes.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="p-4 align-top">
                                            <p className="text-sm text-gray-700 leading-relaxed">
                                                {item.catatan}
                                            </p>
                                        </TableCell>
                                        <TableCell className="p-4 border-l align-top">
                                            <Textarea 
                                                defaultValue={item.respon}
                                                className="min-h-[80px] bg-white border-gray-200 resize-none focus:ring-1 focus:ring-black"
                                                placeholder="Jelaskan perbaikan yang Anda lakukan..."
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Tombol Submit Perbaikan */}
                    <div className="flex justify-end pt-4">
                        {/* Mengarahkan kembali ke halaman Hasil Review*/}
                        <Link href={route('dosen.seminar.step3.hasil')}>
                            <Button className="bg-black text-white hover:bg-gray-800 px-6">
                                Submit Perbaikan
                            </Button>
                        </Link>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}