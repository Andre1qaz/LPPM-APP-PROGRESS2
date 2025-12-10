import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CircleArrowUp, Plus, FileText, ChevronRight, Trash2, Filter } from 'lucide-react';
import { route } from 'ziggy-js';
import { Input } from '@/components/ui/input';

export default function SeminarPage({ seminars, filters }) {
    
    const { auth } = usePage().props;
    const userName = auth?.user?.name || "Dosen";

    // 1. STATE UNTUK PENCARIAN & FILTER
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // 2. DEBOUNCE EFFECT untuk Pencarian (agar tidak request setiap ketikan)
    useEffect(() => {
        // Debounce logic: tunggu 300ms setelah user berhenti mengetik
        const delayDebounceFn = setTimeout(() => {
            // Panggil fungsi filter utama
            applyFilter();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search]); // Panggil effect ini setiap kali 'search' berubah

    // 3. FUNGSI UTAMA UNTUK MENGAPLIKASIKAN FILTER
    const applyFilter = () => {
        router.get(route('dosen.seminar.index'), 
            {
                search: search,
                status: statusFilter,
            },
            {
                preserveState: true, // Pertahankan status lokal
                preserveScroll: true, // Pertahankan posisi scroll
                replace: true, // Ganti history state (URL) tanpa menambah entry baru
            }
        );
    };

    // 4. LOGIKA HAPUS CARD
    const handleDelete = (seminarId, title) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus pengajuan seminar: "${title}"? Data tidak dapat dikembalikan.`)) {
            return;
        }

        router.delete(route('dosen.seminar.destroy', seminarId), {
            preserveScroll: true, 
        });
    };

    // Helper Progress Bar (tetap sama)
    const getProgress = (status) => {
        switch(status) {
            case 'draft': return 10;
            // ... (lanjutan logika progress bar)
            case 'menunggu_reviewer': return 30;
            case 'revisi': return 50;
            case 'menunggu_reviewer_kembali': return 60;
            case 'lolos_review': return 70;
            case 'menunggu_kprodi': return 80;
            case 'menunggu_surat_tugas': return 90;
            case 'selesai': return 100;
            default: return 0;
        }
    };

    // Helper Format Tanggal (tetap sama)
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    // Helper menentukan rute detail (tetap sama)
    const getDetailRoute = (item) => {
        return item.status_progress === 'draft' 
            ? route('dosen.seminar.step1', item.id) 
            : route('dosen.seminar.step3', item.id);
    };

    // DAFTAR STATUS UNTUK FILTER DROPDOWN
    const possibleStatuses = [
        { key: '', label: 'Semua Status' },
        { key: 'draft', label: 'Draft' },
        { key: 'menunggu_reviewer', label: 'Menunggu Review' },
        { key: 'revisi', label: 'Perlu Revisi' },
        { key: 'lolos_review', label: 'Lolos Review' },
        { key: 'selesai', label: 'Selesai' },
        // Tambahkan status lain sesuai kebutuhan
    ];

    return (
        <AppLayout pageName="Seminar">
            <Head title="Daftar Seminar" />

            <div className="w-full max-w-6xl mx-auto px-6 py-10 space-y-8 relative min-h-screen">
                
                {/* ... TITLE BOX (tetap sama) ... */}
                <Card className="shadow-sm border-l-4 border-l-black">
                    <CardContent className="p-6">
                        <h1 className="text-2xl font-bold tracking-tight">
                            Daftar Seminar Saya
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Halo {userName}, kelola pengajuan seminar Anda di sini.
                        </p>
                    </CardContent>
                </Card>

                {/* ================= SEARCH + FILTER INPUTS ================= */}
                <div className="flex flex-col md:flex-row gap-3">
                    {/* SEARCH BAR */}
                    <Input
                        placeholder="Cari judul seminar..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="md:w-1/3 bg-white"
                    />
                    
                    {/* FILTER BUTTON/DROPDOWN */}
                    <div className="relative">
                        <Button 
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            variant="outline"
                            className="w-full md:w-auto gap-2 border-gray-300"
                        >
                            <Filter className="w-4 h-4" /> 
                            {possibleStatuses.find(s => s.key === statusFilter)?.label || 'Filter Status'}
                        </Button>
                        
                        {/* FILTER DROPDOWN CONTENT */}
                        {isFilterOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10 p-1">
                                {possibleStatuses.map((status) => (
                                    <div 
                                        key={status.key}
                                        className={`px-3 py-2 text-sm rounded cursor-pointer hover:bg-gray-100 ${statusFilter === status.key ? 'bg-gray-100 font-medium' : ''}`}
                                        onClick={() => {
                                            setStatusFilter(status.key);
                                            setIsFilterOpen(false);
                                            // Panggil filter saat status dipilih
                                            router.get(route('dosen.seminar.index'), 
                                                { search: search, status: status.key }, 
                                                { preserveState: true, replace: true }
                                            );
                                        }}
                                    >
                                        {status.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ================= LIST SEMINAR (DATA ASLI) ================= */}
                <div className="space-y-4 pb-24">
                    {/* ... (Loop dan Card tetap sama) ... */}
                    {seminars && seminars.length > 0 ? (
                        seminars.map((item) => {
                            const progress = getProgress(item.status_progress);
                            
                            return (
                                <Card key={item.id} className="shadow-sm hover:shadow-md transition-all border-gray-200">
                                    <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        
                                        {/* LEFT: Icon + Info */}
                                        <div className="flex items-start gap-4 md:w-5/12">
                                            <div className="shrink-0 h-12 w-12 rounded-full bg-black flex items-center justify-center text-white transition-transform">
                                                <CircleArrowUp className="h-6 w-6" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-base leading-tight truncate">
                                                    {item.judul_makalah}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1 truncate">
                                                    {item.nama_forum || "Forum belum diisi"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* CENTER: Progress Bar */}
                                        <div className="flex-1 w-full md:px-4">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex justify-between text-xs font-medium text-gray-500">
                                                    <span>Progress</span>
                                                    <span>{progress}%</span>
                                                </div>
                                                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full transition-all duration-500 ${
                                                            progress === 100 ? 'bg-green-500' : 'bg-black'
                                                        }`}
                                                        style={{ width: `${progress}%` }} 
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* RIGHT: Status, Date & ACTION */}
                                        <div className="md:w-3/12 flex flex-row md:flex-col justify-between items-center md:items-end gap-2 md:gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs font-medium px-2.5 py-1 rounded border ${
                                                    item.status_progress === 'draft' ? 'bg-gray-100 text-gray-600 border-gray-200' :
                                                    'bg-blue-50 text-blue-700 border-blue-200'
                                                }`}>
                                                    {item.status_progress ? item.status_progress.replace(/_/g, ' ').toUpperCase() : 'UNKNOWN'}
                                                </span>
                                                <span className="text-xs text-gray-400 hidden md:inline">
                                                    {formatDate(item.created_at)}
                                                </span>
                                            </div>
                                            
                                            {/* ACTION BUTTONS (DELETE & DETAIL) */}
                                            <div className="flex items-center gap-1">
                                                
                                                {/* TOMBOL SAMPAH (HANYA JIKA DRAFT) */}
                                                {item.status_progress === 'draft' && (
                                                    <Button 
                                                        onClick={(e) => {
                                                            e.preventDefault(); 
                                                            e.stopPropagation();
                                                            handleDelete(item.id, item.judul_makalah);
                                                        }}
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        title="Hapus Draft"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}

                                                {/* TOMBOL DETAIL/LANJUTKAN */}
                                                <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-black/50 hover:text-black" title="Lanjutkan Pengajuan">
                                                    <Link href={getDetailRoute(item)}>
                                                        <ChevronRight className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </div>

                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    ) : (
                        // Empty State
                        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-4">
                            <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                                <FileText className="h-8 w-8 text-gray-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Tidak ada hasil ditemukan</h3>
                                <p className="text-sm text-gray-500">Coba ubah kata kunci pencarian atau filter status.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* ... FAB (Floating Action Button) ... */}
                <div className="fixed bottom-10 right-10 z-50">
                    <Button 
                        asChild
                        size="icon" 
                        className="h-14 w-14 rounded-full shadow-xl bg-black text-white hover:bg-gray-800 hover:scale-105 transition-transform flex items-center justify-center"
                    >
                        <Link href={route('dosen.seminar.create')}>
                            <Plus className="h-7 w-7" strokeWidth={2.5} />
                        </Link>
                    </Button>
                </div>

            </div>
        </AppLayout>
    );
}