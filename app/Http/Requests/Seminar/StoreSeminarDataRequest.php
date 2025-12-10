<?php

namespace App\Http\Requests\Seminar;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreSeminarDataRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check(); 
    }

    public function rules(): array
    {
        return [
            // Data Utama
            'judul_makalah' => 'required|string|max:255',
            'nama_forum' => 'required|string|max:255',
            'institusi_penyelenggara' => 'required|string|max:255',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'tempat_pelaksanaan' => 'required|string|max:255',
            'biaya_registrasi' => 'required|numeric|min:0',
            'website_penyelenggara' => 'nullable|url',
            'mesin_pengindex' => 'nullable|string',
            'kategori_luaran' => 'nullable|string',
            'kewajiban_penelitian' => 'nullable|array', // JSON Checkbox

            // ✅ TAMBAHAN: Validasi Array Penulis
            'penulis' => 'nullable|array',
            'penulis.*.nama' => 'required_with:penulis|string',
        ];
    }
}