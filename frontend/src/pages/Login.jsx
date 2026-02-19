import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCaptcha } from '../services/api';
import { Box, Paper, TextField, Button, InputAdornment, IconButton, Typography, Alert, CircularProgress } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RefreshIcon from '@mui/icons-material/Refresh';
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
    loadCaptcha();
  }, []);

  useEffect(() => {
    if (idleAlertOpen) {
      const url = new URL(window.location.href);
      if (url.searchParams.has('reason')) {
        url.searchParams.delete('reason');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, [idleAlertOpen]);

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
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
            Admin Panel
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Silakan masuk untuk melanjutkan
          </Typography>
        </Box>

        {idleAlertOpen && (
          <Alert 
            severity="warning" 
            icon={<LogoutIcon />}
            onClose={() => setIdleAlertOpen(false)}
            sx={{ mb: 2 }}
          >
            <Typography variant="body2" fontWeight="medium">
              Sesi Anda telah berakhir karena tidak ada aktivitas
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Untuk keamanan akun, Anda akan otomatis logout setelah 30 menit tidak melakukan aktivitas. 
              Silakan masuk kembali untuk melanjutkan.
            </Typography>
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
            InputProps={{
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
            <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
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
              <IconButton onClick={loadCaptcha} color="primary">
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
            sx={{ py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Masuk'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
