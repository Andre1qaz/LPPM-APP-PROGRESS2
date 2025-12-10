<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    // Memberitahu Laravel bahwa Primary Key BUKAN Auto Increment
    public $incrementing = false; 
    
    // Memberitahu Laravel bahwa Primary Key bertipe String (UUID)
    protected $keyType = 'string';
    // =================================================================

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'id', // <--- WAJIB DITAMBAHKAN AGAR BISA DIISI MANUAL VIA CREATE()
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    
    // Relasi ke Hak Akses (Opsional, untuk mempermudah akses role)
    public function hakAkses()
    {
        return $this->hasOne(HakAksesModel::class, 'user_id', 'id');
    }
}