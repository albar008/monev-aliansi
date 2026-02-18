<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PorsiPerusahaan extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'nama_pemilik',
        'persentase',
        'nilai',
        'keterangan',
    ];

    protected $casts = [
        'persentase' => 'decimal:2',
        'nilai' => 'decimal:2',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
