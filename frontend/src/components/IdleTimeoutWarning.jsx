import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import { IDLE_WARNING } from '../config/idleConfig';
import { useAuth } from '../context/AuthContext';
import { useIdleTimeoutContext } from '../context/IdleTimeoutContext';

export const IdleTimeoutWarning = () => {
  const navigate = useNavigate();
  const { clearUser } = useAuth();
  const { triggerReset } = useIdleTimeoutContext();
  const [open, setOpen] = useState(false);
  const [remainingTime, setRemainingTime] = useState(IDLE_WARNING / 1000);

  const handleLogout = useCallback(() => {
    clearUser();
    setOpen(false);
    navigate('/login?reason=idle');
  }, [clearUser, navigate]);

  useEffect(() => {
    const handleWarning = () => {
      setOpen(true);
      setRemainingTime(IDLE_WARNING / 1000);
    };

    window.addEventListener('idle-timeout-warning', handleWarning);

    return () => {
      window.removeEventListener('idle-timeout-warning', handleWarning);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const interval = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open, handleLogout]);

  const handleStayLoggedIn = () => {
    triggerReset();
    setOpen(false);
    setRemainingTime(IDLE_WARNING / 1000);
  };

  if (!open) return null;

  return (
    <Dialog open={open} maxWidth="xs" fullWidth disableEscapeKeyDown>
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Box sx={{ fontSize: 48 }}>⏰</Box>
        <Typography variant="h6" fontWeight="bold">
          Sesi Akan Berakhir
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center', pt: 1 }}>
        <Typography variant="body1" color="text.secondary">
          Anda akan otomatis logout dalam
        </Typography>
        <Typography variant="h4" color="error" fontWeight="bold" sx={{ my: 2 }}>
          {remainingTime} detik
        </Typography>
        <Typography variant="body2" color="text.secondary">
          karena tidak ada aktivitas.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleStayLoggedIn}
          size="large"
        >
          Tetap Login
        </Button>
      </DialogActions>
    </Dialog>
  );
};
