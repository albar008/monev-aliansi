<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StatusLaporanMK extends Model
{
    use HasFactory;

    protected $table = 'status_laporan_mk';

    protected $fillable = [
        'tahun',
        'proyek',
        'konsultan_pelaksana',
        'pendahuluan',
        'mingguan',
        'bulanan',
        'antara',
        'tiga_bulanan',
        'tahunan',
        'executive_summary',
        'khusus',
        'akhir',
    ];

    protected $casts = [
        'pendahuluan' => 'boolean',
        'mingguan' => 'boolean',
        'bulanan' => 'boolean',
        'antara' => 'boolean',
        'tiga_bulanan' => 'boolean',
        'tahunan' => 'boolean',
        'executive_summary' => 'boolean',
        'khusus' => 'boolean',
        'akhir' => 'boolean',
        'tahun' => 'integer',
    ];
}
