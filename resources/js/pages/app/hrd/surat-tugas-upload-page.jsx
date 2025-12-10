import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { UploadCloud, FileText, CheckCircle2, Calendar, MapPin } from 'lucide-react';
import { route } from 'ziggy-js';
import { Separator } from '@/components/ui/separator';

export default function SuratTugasUploadPage({ id }) {
    // Simulasi Data Detail (Konsisten dengan Dashboard)
    const requestDetail = {
        dosen: "Pak Budi Santoso",
        nip: "198501012010121001",
        judul: "Seminar Nasional Teknologi Informasi (SNTI)",
        lokasi: "Jakarta",
        tanggal: "20 Nov 2024",
    };

    // Revisi: Menghapus state 'nomor_surat'
    const { data, setData, post, processing } = useForm({
        file_surat: null,
    });

    const [isDragging, setIsDragging] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('hrd.surat-tugas.store', id));
    };

    // Handle Drag & Drop
    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => setIsDragging(false);
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setData('file_surat', e.dataTransfer.files[0]);
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Beranda', href: '/hrd/dashboard' },
            { title: 'Proses Surat', href: '#' }
        ]}>
            <Head title="Proses Surat Tugas" />

            <div className="w-full max-w-3xl mx-auto p-6 space-y-8">
                
                {/* Header Judul */}
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Penerbitan Surat Tugas
                    </h1>
                </div>

                <Card className="border shadow-sm bg-white">
                    <form onSubmit={submit}>
                        <CardContent className="space-y-6 pt-8">
                            
                            {/* SECTION 1: INFORMASI PERMINTAAN (Ringkasan) */}
                            <div className="bg-gray-50 border border-gray-100 rounded-lg p-5 space-y-3">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-blue-100 text-blue-700 rounded-full">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-sm">Permintaan dari {requestDetail.dosen}</h3>
                                        <p className="text-xs text-muted-foreground">NIP: {requestDetail.nip}</p>
                                    </div>
                                </div>
                                <Separator />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                                    <div>
                                        <Label className="text-xs text-muted-foreground uppercase">Kegiatan</Label>
                                        <p className="text-sm font-medium text-gray-900 mt-1">{requestDetail.judul}</p>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <Label className="text-xs text-muted-foreground uppercase">Waktu & Tempat</Label>
                                        <div className="flex items-center gap-3 mt-1">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-white border px-2 py-1 rounded">
                                                <Calendar className="w-3 h-3" /> {requestDetail.tanggal}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-white border px-2 py-1 rounded">
                                                <MapPin className="w-3 h-3" /> {requestDetail.lokasi}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 2: FORM INPUT */}
                            <div className="space-y-4 pt-2">
                                {/* Input Nomor Surat DIHAPUS sesuai permintaan */}

                                {/* Upload Area */}
                                <div className="space-y-2">
                                    <Label className="text-base font-semibold">
                                        Upload File Surat (PDF) <span className="text-red-500">*</span>
                                    </Label>
                                    
                                    <div 
                                        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer group ${
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
                                                            {(data.file_surat.size / 1024).toFixed(0)} KB • Siap diunggah
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
                                                            Klik untuk upload file surat
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            atau drag & drop file PDF di sini (Max. 2MB)
                                                        </p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </CardContent>

                        <CardFooter className="flex justify-between items-center gap-3 border-t bg-gray-50/50 p-6 rounded-b-lg">
                            <Button variant="ghost" asChild type="button" className="text-muted-foreground hover:text-gray-900">
                                <Link href={route('hrd.home')}>Batal</Link>
                            </Button>
                            
                            <Button 
                                type="submit" 
                                className="bg-black text-white hover:bg-gray-800 min-w-[160px] h-10 shadow-sm" 
                                // Revisi: Menghapus validasi !data.nomor_surat
                                disabled={processing || !data.file_surat}
                            >
                                {processing ? 'Menyimpan...' : 'Terbitkan Surat'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}