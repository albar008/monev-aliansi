<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\StatusLaporanMK;

class StatusLaporanMKSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'tahun' => 2026,
                'proyek' => 'Proyek Pembangunan Gedung A',
                'konsultan_pelaksana' => 'PT Konsultan Indonesia',
                'pendahuluan' => true,
                'mingguan' => true,
                'bulanan' => true,
                'antara' => false,
                'tiga_bulanan' => false,
                'tahunan' => false,
                'executive_summary' => false,
                'khusus' => false,
                'akhir' => false,
            ],
            [
                'tahun' => 2026,
                'proyek' => 'Proyek Renovasi Jalan',
                'konsultan_pelaksana' => 'CV Jaya Abadi',
                'pendahuluan' => true,
                'mingguan' => true,
                'bulanan' => true,
                'antara' => true,
                'tiga_bulanan' => false,
                'tahunan' => false,
                'executive_summary' => false,
                'khusus' => false,
                'akhir' => false,
            ],
            [
                'tahun' => 2025,
                'proyek' => 'Proyek Jembatan Barelang',
                'konsultan_pelaksana' => 'PT Wijaya Konstruksi',
                'pendahuluan' => true,
                'mingguan' => true,
                'bulanan' => true,
                'antara' => true,
                'tiga_bulanan' => true,
                'tahunan' => false,
                'executive_summary' => false,
                'khusus' => false,
                'akhir' => false,
            ],
            [
                'tahun' => 2025,
                'proyek' => 'Proyek Drainase Kota',
                'konsultan_pelaksana' => 'PT Mitra Engineering',
                'pendahuluan' => true,
                'mingguan' => false,
                'bulanan' => true,
                'antara' => false,
                'tiga_bulanan' => false,
                'tahunan' => false,
                'executive_summary' => false,
                'khusus' => false,
                'akhir' => false,
            ],
            [
                'tahun' => 2024,
                'proyek' => 'Proyek Gedung Perpustakaan',
                'konsultan_pelaksana' => 'CV Bangun Jaya',
                'pendahuluan' => true,
                'mingguan' => true,
                'bulanan' => true,
                'antara' => true,
                'tiga_bulanan' => true,
                'tahunan' => true,
                'executive_summary' => true,
                'khusus' => false,
                'akhir' => false,
            ],
        ];

        foreach ($data as $item) {
            StatusLaporanMK::create($item);
        }
    }
}
