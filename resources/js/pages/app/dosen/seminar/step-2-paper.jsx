import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SeminarStepper from '@/components/seminar-stepper';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { route } from 'ziggy-js';

export default function Step2Paper() {
    // State untuk menangani reviewer dinamis
    const [reviewers, setReviewers] = useState([
        { id: 1, label: 'Reviewer 1', value: '' }
    ]);

    // Fungsi tambah reviewer
    const addReviewer = () => {
        const newId = reviewers.length + 1;
        setReviewers([...reviewers, { id: newId, label: `Reviewer ${newId}`, value: '' }]);
    };

    // Fungsi hapus reviewer (opsional, untuk UX yang lebih baik)
    const removeReviewer = (id) => {
        if (reviewers.length > 1) {
            setReviewers(reviewers.filter(r => r.id !== id));
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Beranda', href: '/dosen/dashboard' },
            { title: 'Registrasi Seminar', href: '/dosen/seminar' },
            { title: 'Tahap 2', href: '#' }
        ]}>
            <Head title="Submit Paper" />

            <div className="w-full max-w-6xl mx-auto px-6 py-6 pb-24">
                
                {/* Header Judul */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold">Pengajuan Dana Registrasi Seminar</h1>
                </div>

                {/* Stepper Component (Step 2 Active) */}
                <SeminarStepper currentStep={2} />

                {/* Form Container */}
                <div className="mt-10 space-y-8">
                    <h2 className="text-2xl font-bold">Submit Paper</h2>

                    <div className="space-y-6">
                        
                        {/* Upload Paper */}
                        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                            <Label className="md:text-left font-medium text-gray-700">Submit Paper</Label>
                            <div className="md:col-span-3 flex gap-2">
                                <Input defaultValue="Value" className="bg-white flex-1" readOnly />
                                <div className="relative">
                                    <input 
                                        type="file" 
                                        id="paper-upload" 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                    />
                                    <Button variant="outline" className="bg-white border-gray-300 hover:bg-gray-50 text-gray-700 font-normal">
                                        Choose File
                                    </Button>
                                </div>
                                <span className="text-sm text-gray-500 self-center">No file chosen</span>
                            </div>
                        </div>

                        {/* Dynamic Reviewer List */}
                        {reviewers.map((reviewer, index) => (
                            <div key={reviewer.id} className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                                <Label className="md:text-left font-medium text-gray-700">{reviewer.label}</Label>
                                <div className="md:col-span-3 flex gap-2">
                                    <div className="relative flex-1">
                                        <Input 
                                            placeholder="Type to search..." 
                                            className="bg-white pr-10" 
                                        />
                                    </div>
                                    <Button variant="outline" className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium px-6 border-gray-200">
                                        Search
                                    </Button>
                                    
                                    {/* Tombol Hapus (Hanya muncul jika lebih dari 1) */}
                                    {reviewers.length > 1 && (
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => removeReviewer(reviewer.id)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Tombol Add Reviewer */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-1"></div>
                            <div className="md:col-span-3 flex justify-end">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={addReviewer}
                                    className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                    <Plus className="w-4 h-4" /> Add Reviewer
                                </Button>
                            </div>
                        </div>

                    </div>

                    {/* === BAGIAN TOMBOL === */}
                    <div className="flex justify-between pt-8">
                        {/* Tombol Kembali ke Step 1 */}
                        <Link href={route('dosen.seminar.step1')}>
                            <Button variant="outline" className="px-8 border-gray-300 text-gray-700 hover:bg-gray-50">
                                Kembali
                            </Button>
                        </Link>

                        {/* FIX: Tombol Submit ke Step 3 (Finalisasi) */}
                        <Link href={route('dosen.seminar.step3')}>
                            <Button className="bg-black text-white hover:bg-gray-800 px-8 min-w-[100px]">
                                Submit
                            </Button>
                        </Link>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}