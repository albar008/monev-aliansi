<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $projects = Project::orderBy('created_at', 'desc')->get();
        return response()->json(['projects' => $projects]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $project = Project::with(['penanggungJawab', 'porsiPerusahaan'])->findOrFail($id);
        return response()->json(['project' => $project]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'nama_proyek' => 'required|string',
            'klien' => 'nullable|string',
            'nilai_kontrak' => 'nullable|numeric',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date',
            'status' => 'nullable|in:aktif,selesai,ditunda',
            'deskripsi' => 'nullable|string',
        ]);
        
        $project = Project::create($request->all());
        
        return response()->json([
            'message' => 'Project created successfully',
            'project' => $project
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $project = Project::findOrFail($id);
        
        $request->validate([
            'nama_proyek' => 'sometimes|string',
            'klien' => 'nullable|string',
            'nilai_kontrak' => 'nullable|numeric',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date',
            'status' => 'nullable|in:aktif,selesai,ditunda',
            'deskripsi' => 'nullable|string',
        ]);
        
        $project->update($request->all());
        
        return response()->json([
            'message' => 'Project updated successfully',
            'project' => $project
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $project = Project::findOrFail($id);
        $project->delete();
        
        return response()->json([
            'message' => 'Project deleted successfully'
        ]);
    }
}
