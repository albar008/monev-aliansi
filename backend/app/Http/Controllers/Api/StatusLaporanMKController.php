<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StatusLaporanMK;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class StatusLaporanMKController extends Controller
{
    public function years(): JsonResponse
    {
        $years = StatusLaporanMK::distinct()->pluck('tahun')->sortDesc()->values();

        return response()->json([
            'success' => true,
            'message' => 'Years retrieved successfully',
            'data' => $years,
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $query = StatusLaporanMK::query();

        if ($request->has('tahun') && $request->tahun) {
            $query->where('tahun', $request->tahun);
        }

        $data = $query->orderBy('tahun', 'desc')->orderBy('proyek', 'asc')->get();

        return response()->json([
            'success' => true,
            'message' => 'Data retrieved successfully',
            'data' => $data,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tahun' => 'required|numeric',
            'proyek' => 'required|string',
            'konsultan_pelaksana' => 'required|string',
            'pendahuluan' => 'boolean',
            'mingguan' => 'boolean',
            'bulanan' => 'boolean',
            'antara' => 'boolean',
            'tiga_bulanan' => 'boolean',
            'tahunan' => 'boolean',
            'executive_summary' => 'boolean',
            'khusus' => 'boolean',
            'akhir' => 'boolean',
        ]);

        $data = StatusLaporanMK::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data created successfully',
            'data' => $data,
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $data = StatusLaporanMK::findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Data retrieved successfully',
            'data' => $data,
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $data = StatusLaporanMK::findOrFail($id);

        $validated = $request->validate([
            'tahun' => 'sometimes|numeric',
            'proyek' => 'sometimes|string',
            'konsultan_pelaksana' => 'sometimes|string',
            'pendahuluan' => 'boolean',
            'mingguan' => 'boolean',
            'bulanan' => 'boolean',
            'antara' => 'boolean',
            'tiga_bulanan' => 'boolean',
            'tahunan' => 'boolean',
            'executive_summary' => 'boolean',
            'khusus' => 'boolean',
            'akhir' => 'boolean',
        ]);

        $data->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data updated successfully',
            'data' => $data,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $data = StatusLaporanMK::findOrFail($id);
        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data deleted successfully',
        ]);
    }
}
