<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PenanggungJawab;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PenanggungJawabController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $penanggungJawab = PenanggungJawab::with('project')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json(['penanggung_jawab' => $penanggungJawab]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $penanggungJawab = PenanggungJawab::with('project')->findOrFail($id);
        return response()->json(['penanggung_jawab' => $penanggungJawab]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'project_id' => 'required|exists:projects,id',
            'nama' => 'required|string',
            'jabatan' => 'nullable|string',
            'no_telp' => 'nullable|string',
            'email' => 'nullable|email',
        ]);
        
        $penanggungJawab = PenanggungJawab::create($request->all());
        
        return response()->json([
            'message' => 'Penanggung Jawab created successfully',
            'penanggung_jawab' => $penanggungJawab
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $penanggungJawab = PenanggungJawab::findOrFail($id);
        
        $request->validate([
            'project_id' => 'sometimes|exists:projects,id',
            'nama' => 'sometimes|string',
            'jabatan' => 'nullable|string',
            'no_telp' => 'nullable|string',
            'email' => 'nullable|email',
        ]);
        
        $penanggungJawab->update($request->all());
        
        return response()->json([
            'message' => 'Penanggung Jawab updated successfully',
            'penanggung_jawab' => $penanggungJawab
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $penanggungJawab = PenanggungJawab::findOrFail($id);
        $penanggungJawab->delete();
        
        return response()->json([
            'message' => 'Penanggung Jawab deleted successfully'
        ]);
    }
}
