import React, { useState } from 'react';
import { Head, Link, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft, UploadCloud, CheckCircle2 } from 'lucide-react';
import { route } from "ziggy-js";
import Swal from "sweetalert2";

export default function KetuaUploadSurat({ paperId }) {
    const { data, setData, processing } = useForm({
        file_surat: null,
    });

    const [isDragging, setIsDragging] = useState(false);

    // Handle Drag & Drop Visuals
    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => setIsDragging(false);
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setData('file_surat', e.dataTransfer.files[0]);
        }
    };

    const handleSuccess = (e) => {
        e.preventDefault();
        
        // Simulasi Submit Sukses
        Swal.fire({
            title: "Berhasil!",
            text: "Surat Permohonan Dana berhasil diunggah. Keuangan akan menerima notifikasi.",
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#000000",
            customClass: {
                popup: 'rounded-xl'
            }
        }).then(() => {
            // Redirect ke halaman list
            // Pada implementasi real, gunakan post() dari useForm di sini
            window.location.href = route("lppm.ketua.pengajuan-dana");
        });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Beranda', href: '/lppm/ketua/home' },
            { title: 'Pengajuan Dana', href: '/lppm/ketua/pengajuan-dana' },
            { title: 'Upload Surat', href: '#' }
        ]}>
            <Head title="Upload Surat Permohonan" />

            <div className="w-full max-w-2xl mx-auto px-6 py-10 space-y-6">
                
                {/* Header Navigation */}
                <div className="flex items-center gap-4">
                    <Link href={route('lppm.ketua.pengajuan-dana')}>
                        <Button variant="outline" size="icon" className="h-9 w-9 border-gray-300">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Upload Surat Permohonan
                    </h1>
                </div>

                <Card className="border shadow-sm">
                    <CardHeader>
                        <CardTitle>Surat Permohonan Dana</CardTitle>
                        <CardDescription>
                            Unggah surat permohonan dana yang telah ditandatangani untuk diteruskan ke bagian Keuangan.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Area Upload Drag & Drop */}
                        <div className="space-y-2">
                            <Label className="text-base font-medium">File Surat (PDF) <span className="text-red-500">*</span></Label>
                            
                            <div 
                                className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer group ${
                                    isDragging 
                                        ? 'border-black bg-gray-50' 
                                        : 'border-gray-200 hover:bg-gray-50 hover:border-gray-400'
                                }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <input 
                                    type="file" 
                                    accept=".pdf"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) => setData('file_surat', e.target.files[0])}
                                />
                                
                                <div className="flex flex-col items-center gap-3">
                                    {data.file_surat ? (
                                        // State: File Selected
                                        <>
                                            <div className="h-14 w-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-1">
                                                <CheckCircle2 className="w-7 h-7" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-gray-900 break-all max-w-[300px] mx-auto">
                                                    {data.file_surat.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {(data.file_surat.size / 1024).toFixed(0)} KB • Siap dikirim
                                                </p>
                                            </div>
                                            <Button 
                                                type="button" 
                                                variant="link" 
                                                className="text-xs text-red-600 h-auto p-0 pt-2 hover:no-underline hover:text-red-700"
                                                onClick={(e) => {
                                                    e.stopPropagation(); 
                                                    setData('file_surat', null);
                                                }}
                                            >
                                                Hapus file
                                            </Button>
                                        </>
                                    ) : (
                                        // State: No File
                                        <>
                                            <div className="h-14 w-14 rounded-full bg-gray-100 text-gray-500 group-hover:bg-white group-hover:shadow-sm transition-all flex items-center justify-center mb-1">
                                                <UploadCloud className="w-7 h-7" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    Klik untuk upload surat
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    atau drag & drop file PDF (Max 2MB)
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-between items-center border-t bg-gray-50/50 p-6 rounded-b-lg">
                        <Link href={route('lppm.ketua.pengajuan-dana')}>
                            <Button variant="ghost" className="text-muted-foreground hover:text-gray-900">
                                Batal
                            </Button>
                        </Link>
                        
                        <Button 
                            onClick={handleSuccess}
                            className="bg-black text-white hover:bg-gray-800 min-w-[140px] shadow-sm"
                            disabled={!data.file_surat || processing}
                        >
                            {processing ? 'Mengirim...' : 'Kirim Surat'}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    );
}