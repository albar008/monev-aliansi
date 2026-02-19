import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { IDLE_TIMEOUT, IDLE_WARNING, IDLE_CHECK_INTERVAL } from '../config/idleConfig';

export const useIdleTimeout = (isAuthenticated) => {
  const navigate = useNavigate();
  const lastActivityRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const logoutTimeoutRef = useRef(null);
  const showWarningRef = useRef(false);

  const resetTimers = useCallback(() => {
    lastActivityRef.current = Date.now();
    
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    if (logoutTimeoutRef.current) {
      clearTimeout(logoutTimeoutRef.current);
    }

    warningTimeoutRef.current = setTimeout(() => {
      showWarningRef.current = true;
      const event = new CustomEvent('idle-timeout-warning');
      window.dispatchEvent(event);
    }, IDLE_TIMEOUT - IDLE_WARNING);

    logoutTimeoutRef.current = setTimeout(() => {
      const event = new CustomEvent('idle-timeout-logout');
      window.dispatchEvent(event);
    }, IDLE_TIMEOUT);
  }, []);

  const handleActivity = useCallback(() => {
    if (isAuthenticated) {
      resetTimers();
    }
  }, [isAuthenticated, resetTimers]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    lastActivityRef.current = Date.now();

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];

    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    resetTimers();

    const checkInterval = setInterval(() => {
      const idleTime = Date.now() - lastActivityRef.current;
      if (idleTime >= IDLE_TIMEOUT) {
        const event = new CustomEvent('idle-timeout-logout');
        window.dispatchEvent(event);
      }
    }, IDLE_CHECK_INTERVAL);

    const handleIdleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login?reason=idle');
    };

    window.addEventListener('idle-timeout-logout', handleIdleLogout);

    const handleIdleReset = () => {
      resetTimers();
    };
    window.addEventListener('idle-timeout-reset', handleIdleReset);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      if (logoutTimeoutRef.current) {
        clearTimeout(logoutTimeoutRef.current);
      }
      clearInterval(checkInterval);
      window.removeEventListener('idle-timeout-logout', handleIdleLogout);
      window.removeEventListener('idle-timeout-reset', handleIdleReset);
    };
  }, [isAuthenticated, handleActivity, resetTimers, navigate]);

  return { resetTimers };
};
