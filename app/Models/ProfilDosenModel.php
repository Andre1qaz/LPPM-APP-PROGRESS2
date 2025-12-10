<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfilDosenModel extends Model
{
    use HasFactory;
    
    protected $table = 'm_profil_dosen'; 
    
    protected $primaryKey = 'id';
    protected $keyType = 'string'; 
    public $incrementing = false;
    protected $guarded = [];
    public $timestamps = true;

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}