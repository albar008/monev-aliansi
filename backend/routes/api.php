<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PenanggungJawabController;
use App\Http\Controllers\Api\PorsiPerusahaanController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\StatusLaporanMKController;

Route::post('/login', [AuthController::class, 'login']);
Route::get('/captcha', [AuthController::class, 'captcha']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/projects-per-month', [DashboardController::class, 'projectsPerMonth']);
    Route::get('/dashboard/porsi-distribution', [DashboardController::class, 'porsiDistribution']);
    
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/projects/{id}', [ProjectController::class, 'show']);
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::put('/projects/{id}', [ProjectController::class, 'update']);
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);
    
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    
    Route::get('/penanggung-jawab', [PenanggungJawabController::class, 'index']);
    Route::get('/penanggung-jawab/{id}', [PenanggungJawabController::class, 'show']);
    Route::post('/penanggung-jawab', [PenanggungJawabController::class, 'store']);
    Route::put('/penanggung-jawab/{id}', [PenanggungJawabController::class, 'update']);
    Route::delete('/penanggung-jawab/{id}', [PenanggungJawabController::class, 'destroy']);
    
    Route::get('/porsi-perusahaan', [PorsiPerusahaanController::class, 'index']);
    Route::get('/porsi-perusahaan/{id}', [PorsiPerusahaanController::class, 'show']);
    Route::post('/porsi-perusahaan', [PorsiPerusahaanController::class, 'store']);
    Route::put('/porsi-perusahaan/{id}', [PorsiPerusahaanController::class, 'update']);
    Route::delete('/porsi-perusahaan/{id}', [PorsiPerusahaanController::class, 'destroy']);
    
    Route::get('/status-laporan-mk', [StatusLaporanMKController::class, 'index']);
    Route::get('/status-laporan-mk/years', [StatusLaporanMKController::class, 'years']);
    Route::get('/status-laporan-mk/{id}', [StatusLaporanMKController::class, 'show']);
    Route::post('/status-laporan-mk', [StatusLaporanMKController::class, 'store']);
    Route::put('/status-laporan-mk/{id}', [StatusLaporanMKController::class, 'update']);
    Route::delete('/status-laporan-mk/{id}', [StatusLaporanMKController::class, 'destroy']);
});
