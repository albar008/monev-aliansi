<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PenanggungJawab extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'nama',
        'jabatan',
        'no_telp',
        'email',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
