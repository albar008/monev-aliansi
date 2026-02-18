<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\PorsiPerusahaan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats(Request $request): JsonResponse
    {
        $totalProjects = Project::count();
        $activeProjects = Project::where('status', 'aktif')->count();
        $completedProjects = Project::where('status', 'selesai')->count();
        $totalNilai = Project::sum('nilai_kontrak');
        
        return response()->json([
            'stats' => [
                'total_projects' => $totalProjects,
                'active_projects' => $activeProjects,
                'completed_projects' => $completedProjects,
                'total_nilai' => $totalNilai,
            ]
        ]);
    }

    public function projectsPerMonth(Request $request): JsonResponse
    {
        $projects = Project::select(
            DB::raw('MONTH(tanggal_mulai) as month'),
            DB::raw('COUNT(*) as count')
        )
        ->whereNotNull('tanggal_mulai')
        ->groupBy('month')
        ->orderBy('month')
        ->get();
        
        $months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        
        $data = array_fill(0, 12, 0);
        
        foreach ($projects as $project) {
            if ($project->month >= 1 && $project->month <= 12) {
                $data[$project->month - 1] = $project->count;
            }
        }
        
        return response()->json([
            'labels' => $months,
            'data' => $data
        ]);
    }

    public function porsiDistribution(Request $request): JsonResponse
    {
        $porsi = PorsiPerusahaan::select('nama_pemilik', DB::raw('SUM(persentase) as total_persentase'))
            ->groupBy('nama_pemilik')
            ->having('nama_pemilik', '!=', null)
            ->get();
        
        $labels = $porsi->pluck('nama_pemilik')->toArray();
        $data = $porsi->pluck('total_persentase')->toArray();
        
        if (empty($labels)) {
            $labels = ['PT Maju Jaya', 'PT Bersama Sejahtera', 'CV Sumber Rejeki'];
            $data = [35, 25, 40];
        }
        
        return response()->json([
            'labels' => $labels,
            'data' => $data
        ]);
    }
}
