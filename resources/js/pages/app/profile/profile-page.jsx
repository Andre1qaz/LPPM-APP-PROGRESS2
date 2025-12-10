import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pencil, User } from 'lucide-react';
import Swal from "sweetalert2";

export default function ProfilePage({ auth }) {
    const { data, setData, post, processing } = useForm({
        name: auth.user.name,
        email: auth.user.email,
        nidn: auth.user.nidn || '',      
        prodi: auth.user.prodi || '',     
        sinta_id: auth.user.sinta_id || '', 
        scopus_id: auth.user.scopus_id || '', 
        photo: null,
    });

    const submit = (e) => {
        e.preventDefault();
        Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Data profil berhasil disimpan.',
            confirmButtonColor: '#000000',
            customClass: { popup: 'rounded-xl' }
        });
    };

    // Komponen Baris Input Custom (Diperbarui: Lebih Ramping)
    const InputRow = ({ label, value, onChange, readOnly = false, icon = false, placeholder = "" }) => (
        <div className="flex items-center justify-between border rounded-2xl px-5 py-2.5 bg-white shadow-sm hover:shadow-md transition-shadow">
            <span className="text-gray-600 font-medium text-sm w-1/3">{label}</span>
            <div className="flex-1 flex items-center justify-end relative gap-2">
                <Input 
                    value={value} 
                    onChange={onChange}
                    readOnly={readOnly}
                    placeholder={placeholder}
                    className="border-none shadow-none text-right bg-transparent focus-visible:ring-0 px-0 h-auto placeholder:text-gray-300 text-sm font-medium" 
                />
                {/* Ikon Pensil: Lebih kecil dan warnanya lebih halus */}
                {icon && <Pencil className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
            </div>
        </div>
    );

    return (
        <AppLayout breadcrumbs={[]}> 
            <Head title="Pengaturan Akun" />

            <div className="w-full max-w-5xl mx-auto py-10 px-6">
                
                {/* 1. HEADER JUDUL */}
                <div className="flex items-center gap-3 mb-10">
                    <User className="w-5 h-5 text-gray-600" />
                    <h1 className="text-lg font-medium text-gray-900">
                        Pengaturan Akun
                    </h1>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    
                    {/* 2. BAGIAN FOTO PROFIL */}
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <p className="text-sm text-gray-500">Add profile picture</p>
                        
                        <div className="relative">
                            <Avatar className="h-24 w-24 border-2 border-white shadow-lg">
                                <AvatarImage src={auth.user.photo} className="object-cover" />
                                <AvatarFallback className="text-2xl bg-red-600 text-white">
                                    {auth.user.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            
                            {/* Ikon Edit di pojok kanan bawah avatar */}
                            <label className="absolute bottom-0 right-0 p-1.5 bg-white shadow rounded-full cursor-pointer hover:bg-gray-50 border border-gray-100">
                                <Pencil className="w-3.5 h-3.5 text-gray-600" />
                                <input type="file" className="hidden" onChange={e => setData('photo', e.target.files[0])} />
                            </label>
                        </div>
                        
                        <p className="text-xs text-gray-500">Edit user profile</p>
                    </div>

                    {/* 3. BAGIAN FORM INPUT (Stacked Rows - GAP DIKURANGI) */}
                    <div className="space-y-2 max-w-4xl mx-auto">
                        
                        <InputRow 
                            label="Nama" 
                            value={data.name} 
                            readOnly 
                        />

                        <InputRow 
                            label="Akun Email" 
                            value={data.email} 
                            readOnly 
                        />

                        <InputRow 
                            label="NIDN" 
                            value={data.nidn} 
                            onChange={e => setData('nidn', e.target.value)}
                        />

                        <InputRow 
                            label="Program Studi" 
                            value={data.prodi} 
                            onChange={e => setData('prodi', e.target.value)}
                        />

                        <InputRow 
                            label="Sinta ID" 
                            value={data.sinta_id} 
                            onChange={e => setData('sinta_id', e.target.value)}
                            icon={true}
                        />

                        <InputRow 
                            label="Scopus ID" 
                            value={data.scopus_id} 
                            onChange={e => setData('scopus_id', e.target.value)}
                            icon={true}
                        />

                    </div>

                    {/* 4. TOMBOL AKSI */}
                    <div className="flex justify-between items-center max-w-4xl mx-auto pt-6">
                        <Link href="/">
                            <Button variant="outline" type="button" className="px-8 border-gray-300 text-gray-600 h-10 hover:bg-gray-50 rounded-xl">
                                Kembali
                            </Button>
                        </Link>
                        
                        <Button type="submit" className="bg-[#1a1a1a] text-white hover:bg-black px-8 h-10 rounded-xl shadow-md" disabled={processing}>
                            Simpan Perubahan
                        </Button>
                    </div>

                </form>
            </div>
        </AppLayout>
    );
}