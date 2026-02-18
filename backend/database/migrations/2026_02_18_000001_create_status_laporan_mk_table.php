<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('status_laporan_mk', function (Blueprint $table) {
            $table->id();
            $table->integer('tahun');
            $table->string('proyek');
            $table->string('konsultan_pelaksana');
            $table->boolean('pendahuluan')->default(false);
            $table->boolean('mingguan')->default(false);
            $table->boolean('bulanan')->default(false);
            $table->boolean('antara')->default(false);
            $table->boolean('tiga_bulanan')->default(false);
            $table->boolean('tahunan')->default(false);
            $table->boolean('executive_summary')->default(false);
            $table->boolean('khusus')->default(false);
            $table->boolean('akhir')->default(false);
            $table->timestamps();

            $table->index('tahun');
            $table->index('proyek');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('status_laporan_mk');
    }
};
