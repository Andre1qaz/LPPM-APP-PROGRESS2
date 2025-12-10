import React, { useState } from 'react';
import AppLayout from "@/layouts/app-layout";
import Swal from "sweetalert2";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { route } from "ziggy-js";

export default function SeminarReviewPage({ pageName, paperId }) {
    // State untuk menampung list catatan (Default 3 baris kosong)
    const [catatanList, setCatatanList] = useState(["", "", ""]);

    // Fungsi menambah kolom input baru
    const handleAddCatatan = () => {
        setCatatanList([...catatanList, ""]);
    };

    // Fungsi menangani perubahan text pada input
    const handleChangeCatatan = (index, value) => {
        const newCatatan = [...catatanList];
        newCatatan[index] = value;
        setCatatanList(newCatatan);
    };

    const handleSubmit = () => {
        // Filter catatan yang tidak kosong (opsional)
        const validNotes = catatanList.filter(note => note.trim() !== "");

        Swal.fire({
            icon: "success",
            title: "Berhasil Mengirim Catatan Perbaikan!",
            text: "Dosen Pengaju akan Menerima Notifikasi bahwa Jurnalnya Sudah di Review",
            confirmButtonText: "OK",
            buttonsStyling: false,
            customClass: {
                confirmButton: "px-5 py-2 bg-blue-600 text-white rounded-lg",
                popup: "rounded-xl p-6",
                title: "text-black text-lg font-semibold",
                htmlContainer: "text-black text-sm mt-2",
            },
        }).then(() => {
            // Redirect simulasi
            window.location.href = route("reviewer.seminar.masuk");
        });
    };

    return (
        <AppLayout>
            <div className="bg-white rounded-xl p-6 shadow mb-4">
                <h2 className="text-xl font-semibold">{pageName || "Review Seminar"}</h2>
                <p className="text-sm text-gray-500">
                    Silakan isi catatan review untuk seminar ID {paperId}
                </p>
            </div>

            <div className="bg-white p-5 shadow rounded-lg">
                {/* Looping Input Catatan */}
                {catatanList.map((note, index) => (
                    <input
                        key={index}
                        value={note}
                        onChange={(e) => handleChangeCatatan(index, e.target.value)}
                        className="border p-2 rounded w-full mb-2"
                        placeholder={`Catatan ${index + 1}`}
                    />
                ))}

                {/* Tombol Tambah (Text Link Style agar tidak merusak layout) */}
                <button 
                    onClick={handleAddCatatan}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium mt-1 mb-4 flex items-center gap-1"
                >
                    + Tambah Catatan Lain
                </button>

                <div className="flex justify-between mt-5 pt-4 border-t">
                    <Link href={route("reviewer.seminar.masuk")} className="px-4 py-2 border rounded hover:bg-gray-50 transition">
                        Kembali
                    </Link>

                    <Button onClick={handleSubmit}>Submit</Button>
                </div>
            </div>
        </AppLayout>
    );
}