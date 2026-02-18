<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_proyek',
        'klien',
        'nilai_kontrak',
        'tanggal_mulai',
        'tanggal_selesai',
        'status',
        'deskripsi',
    ];

    protected $casts = [
        'nilai_kontrak' => 'decimal:2',
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
    ];

    public function penanggungJawab(): HasMany
    {
        return $this->hasMany(PenanggungJawab::class);
    }

    public function porsiPerusahaan(): HasMany
    {
        return $this->hasMany(PorsiPerusahaan::class);
    }
}
