import React from 'react';
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { CircleArrowUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SeminarDisetujuiPage({ papers = [], pageName }) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Beranda', href: '/reviewer/home' },
            { title: 'Seminar Disetujui', href: '#' }
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
                            Daftar paper seminar yang telah selesai direview dan disetujui.
                        </p>
                    </CardContent>
                </Card>

                {/* ==== LIST ==== */}
                <div className="space-y-4">
                    {papers.map((item) => (
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
                                            {item.pengaju}
                                        </p>
                                    </div>
                                </div>

                                {/* RIGHT: Action & Date */}
                                <div className="flex flex-col items-end gap-2 w-full md:w-auto self-stretch justify-between">
                                    
                                    {/* Action Button */}
                                    <div className="mt-1">
                                        <Button variant="outline" className="h-8 text-xs gap-2 border-gray-300">
                                            <Download className="w-3.5 h-3.5" />
                                            Download Paper
                                        </Button>
                                    </div>

                                    {/* Date */}
                                    <span className="text-xs text-muted-foreground font-medium">
                                        {item.tanggal}
                                    </span>
                                </div>

                            </CardContent>
                        </Card>
                    ))}

                    {/* NO DATA STATE */}
                    {papers.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground bg-gray-50/50 rounded-lg border border-dashed w-full">
                            Belum ada paper seminar yang disetujui.
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}   