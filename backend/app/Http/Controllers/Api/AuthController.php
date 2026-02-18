<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;

class AuthController extends Controller
{
    public function captcha(): JsonResponse
    {
        $captchaId = Str::uuid()->toString();
        $captchaCode = str_pad(random_int(0, 9999), 4, '0', STR_PAD_LEFT);
        
        Cache::put('captcha_' . $captchaId, $captchaCode, now()->addMinutes(10));
        
        $image = imagecreatetruecolor(120, 40);
        $bgColor = imagecolorallocate($image, 248, 249, 250);
        $textColor = imagecolorallocate($image, 52, 73, 94);
        $lineColor = imagecolorallocate($image, 200, 200, 200);
        
        imagefill($image, 0, 0, $bgColor);
        
        for ($i = 0; $i < 5; $i++) {
            imageline($image, rand(0, 120), rand(0, 40), rand(0, 120), rand(0, 40), $lineColor);
        }
        
        imagestring($image, 5, 25, 12, $captchaCode, $textColor);
        
        ob_start();
        imagepng($image);
        $imageData = ob_get_contents();
        ob_end_clean();
        
        imagedestroy($image);
        
        $base64Image = 'data:image/png;base64,' . base64_encode($imageData);
        
        return response()->json([
            'captcha_id' => $captchaId,
            'captcha_image' => $base64Image
        ]);
    }

    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
            'captcha' => 'required|string',
            'captcha_id' => 'required|string',
        ]);
        
        $storedCaptcha = Cache::get('captcha_' . $request->captcha_id);
        
        if (!$storedCaptcha || $request->captcha !== $storedCaptcha) {
            return response()->json([
                'message' => 'Login error. Invalid username, password, or captcha.'
            ], 401);
        }
        
        $user = User::where('username', $request->username)->first();
        
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Login error. Invalid username, password, or captcha.'
            ], 401);
        }
        
        Cache::forget('captcha_' . $request->captcha_id);
        
        $token = $user->createToken('auth-token')->plainTextToken;
        
        return response()->json([
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'name' => $user->name,
                'role' => $user->role,
            ],
            'token' => $token
        ]);
    }

    public function user(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();
        
        if ($request->has('new_password')) {
            $request->validate([
                'current_password' => 'required|string',
                'new_password' => 'required|string|min:8',
            ]);
            
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'message' => 'Password saat ini salah'
                ], 422);
            }
            
            $user->update([
                'password' => Hash::make($request->new_password)
            ]);
            
            return response()->json([
                'message' => 'Password berhasil diubah',
                'user' => $user
            ]);
        }
        
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
        ]);
        
        $user->update($request->only(['name', 'email']));
        
        return response()->json([
            'user' => $user
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        
        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}
