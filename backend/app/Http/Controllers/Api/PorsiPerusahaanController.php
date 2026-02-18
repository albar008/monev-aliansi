<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PorsiPerusahaan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PorsiPerusahaanController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $porsiPerusahaan = PorsiPerusahaan::with('project')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json(['porsi_perusahaan' => $porsiPerusahaan]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $porsiPerusahaan = PorsiPerusahaan::with('project')->findOrFail($id);
        return response()->json(['porsi_perusahaan' => $porsiPerusahaan]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'project_id' => 'required|exists:projects,id',
            'nama_pemilik' => 'nullable|string',
            'persentase' => 'nullable|numeric|min:0|max:100',
            'nilai' => 'nullable|numeric',
            'keterangan' => 'nullable|string',
        ]);
        
        $porsiPerusahaan = PorsiPerusahaan::create($request->all());
        
        return response()->json([
            'message' => 'Porsi Perusahaan created successfully',
            'porsi_perusahaan' => $porsiPerusahaan
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $porsiPerusahaan = PorsiPerusahaan::findOrFail($id);
        
        $request->validate([
            'project_id' => 'sometimes|exists:projects,id',
            'nama_pemilik' => 'nullable|string',
            'persentase' => 'nullable|numeric|min:0|max:100',
            'nilai' => 'nullable|numeric',
            'keterangan' => 'nullable|string',
        ]);
        
        $porsiPerusahaan->update($request->all());
        
        return response()->json([
            'message' => 'Porsi Perusahaan updated successfully',
            'porsi_perusahaan' => $porsiPerusahaan
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $porsiPerusahaan = PorsiPerusahaan::findOrFail($id);
        $porsiPerusahaan->delete();
        
        return response()->json([
            'message' => 'Porsi Perusahaan deleted successfully'
        ]);
    }
}
