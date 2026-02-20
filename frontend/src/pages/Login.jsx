import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCaptcha } from '../services/api';
import { Box, TextField, Button, InputAdornment, IconButton, Typography, CircularProgress, Alert } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaImage, setCaptchaImage] = useState('');
  const [captchaId, setCaptchaId] = useState('');
  const [error, setError] = useState('');
  const [idleAlertOpen, setIdleAlertOpen] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('reason') === 'idle';
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, user: authUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (authUser) {
      navigate(from, { replace: true });
    }
  }, [authUser, navigate, from]);

  useEffect(() => {
    if (idleAlertOpen) {
      const url = new URL(window.location.href);
      if (url.searchParams.has('reason')) {
        url.searchParams.delete('reason');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, [idleAlertOpen]);

  useEffect(() => {
    loadCaptcha();
  }, []);

  const loadCaptcha = async () => {
    try {
      const data = await getCaptcha();
      setCaptchaImage(data.captcha_image);
      setCaptchaId(data.captcha_id);
    } catch (err) {
      console.error('Failed to load captcha:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password, captcha, captchaId);
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      setCaptcha('');
      loadCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        background: 'linear-gradient(135deg, #0458b8 0%, #032a5e 100%)',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          flex: { md: 1 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 4 },
          bgcolor: '#fff',
          minHeight: { xs: '100vh', md: 'auto' },
          overflowY: 'auto',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 450 }}>
          <Box sx={{ borderRadius: 2, p: { xs: 2, sm: 4 } }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#333', mb: 1 }}>
                Login to Your Account
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                Enter your details to sign in
              </Typography>
            </Box>

            {idleAlertOpen && (
              <Alert
                severity="warning"
                icon={<LogoutIcon />}
                onClose={() => setIdleAlertOpen(false)}
                sx={{ mb: 2 }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Sesi Anda telah berakhir karena tidak ada aktivitas
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Untuk keamanan akun, Anda akan otomatis logout setelah 30 menit tidak melakukan aktivitas.
                  Silakan masuk kembali untuk melanjutkan.
                </Typography>
              </Alert>
            )}

            {error && (
              <Box
                sx={{
                  bgcolor: '#fee2e2',
                  color: '#dc2626',
                  p: 1.5,
                  borderRadius: 1,
                  mb: 3,
                  fontSize: '0.875rem',
                }}
              >
                {error}
              </Box>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: '#6b7280' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#6b7280' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, color: '#374151', fontWeight: 500 }}>
                  Kode Captcha
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {captchaImage && (
                    <Box
                      component="img"
                      src={captchaImage}
                      alt="Captcha"
                      sx={{ height: 40, borderRadius: 1 }}
                    />
                  )}
                  <TextField
                    value={captcha}
                    onChange={(e) => setCaptcha(e.target.value)}
                    required
                    maxLength={4}
                    placeholder="4 digit"
                    sx={{ width: 120 }}
                  />
                  <IconButton onClick={loadCaptcha} sx={{ color: '#0458b8' }}>
                    <RefreshIcon />
                  </IconButton>
                </Box>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  bgcolor: '#0458b8',
                  '&:hover': { bgcolor: '#034a8e' },
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 4px 12px rgba(4, 88, 184, 0.4)',
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Masuk'}
              </Button>
            </form>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 2,
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          bgcolor: 'rgba(3, 42, 94, 0.7)',
          p: 6,
          backgroundImage: 'url(/assets/school.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(to bottom, #dc2626 50%, #ffffff 50%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Sekolah Rakyat
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: 'rgba(255,255,255,0.9)', textAlign: 'center', maxWidth: 500 }}
          >
            Sistem Monitoring and Evaluation Pembangunan Sekolah Rakyat.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
