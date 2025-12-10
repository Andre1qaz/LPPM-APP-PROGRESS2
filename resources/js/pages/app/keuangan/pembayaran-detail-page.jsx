import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";

export default function PembayaranDetailPage({ paper, dokumen }) {
    return (
        <AppLayout pageName="Detail Paper">
            <Head title="Detail Paper" />

            <div className="w-full max-w-6xl mx-auto px-6 py-10 space-y-10">

                {/* TITLE */}
                <div className="border rounded-lg bg-white shadow-sm p-6">
                    <h1 className="text-xl font-semibold">Detail Paper Umum</h1>
                </div>

                {/* INFORMASI UMUM */}
                <div className="border rounded-lg bg-white shadow-sm p-6">
                    <h2 className="font-semibold mb-4">Informasi Umum Paper</h2>

                    <div className="border-t pt-4 space-y-2">
                        <p>Dosen Pengaju: <span className="text-gray-500">{paper.pengaju}</span></p>
                        <p>Judul Paper: <span className="text-gray-500">{paper.judul}</span></p>
                        <p>Tanggal: <span className="text-gray-500">{paper.tanggal}</span></p>
                    </div>
                </div>

                {/* DOKUMEN */}
                <div className="border rounded-lg bg-white shadow-sm p-6">
                    <h2 className="font-semibold mb-4">Dokumen Wajib</h2>

                    <table className="w-full border text-sm">
                        <thead>
                            <tr className="bg-gray-100 border">
                                <th className="p-2 border">Dokumen</th>
                                <th className="p-2 border">Status</th>
                                <th className="p-2 border">File</th>
                            </tr>
                        </thead>

                        <tbody>
                            {dokumen.map((d, i) => (
                                <tr key={i} className="border">
                                    <td className="p-2 border">{d.nama}</td>
                                    <td className="p-2 border">{d.status}</td>
                                    <td className="p-2 border text-blue-500">{d.file}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* BUTTON KEMBALI */}
                <Link
                    href={route("keuangan.pembayaran")}
                    className="px-6 py-2 border rounded-md bg-gray-100 hover:bg-gray-200 mx-auto block w-32 text-center"
                >
                    Kembali
                </Link>

            </div>
        </AppLayout>
    );
}
