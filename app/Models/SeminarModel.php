<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeminarModel extends Model
{
    use HasFactory;
    
    protected $table = 't_seminar';
    
    // Konfigurasi Primary Key UUID
    protected $primaryKey = 'id';
    public $incrementing = false; // WAJIB FALSE agar Laravel tidak menganggap ini Auto-Increment
    protected $keyType = 'string'; // WAJIB STRING

    // Ubah dari ['id'] menjadi [] (kosong) agar kolom ID bisa kita isi manual dengan UUID
    protected $guarded = []; 

    public $timestamps = true;

    // Casting tipe data otomatis
    protected $casts = [
        'kewajiban_penelitian' => 'array',
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
    ];

    // Relasi ke Profil Dosen
    public function profil()
    {
        return $this->belongsTo(ProfilDosenModel::class, 'dosen_profil_id');
    }

    public function penulis()
    {
        // Relasi One-to-Many ke tabel t_seminar_penulis
        return $this->hasMany(SeminarPenulisModel::class, 'seminar_id', 'id');
    }
}