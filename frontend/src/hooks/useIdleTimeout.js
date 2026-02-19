import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { IDLE_TIMEOUT, IDLE_WARNING, IDLE_CHECK_INTERVAL } from '../config/idleConfig';
import { useIdleTimeoutContext } from '../context/IdleTimeoutContext';

export const useIdleTimeout = (isAuthenticated) => {
  const navigate = useNavigate();
  const { registerResetFunction } = useIdleTimeoutContext();
  const lastActivityRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const logoutTimeoutRef = useRef(null);
  const showWarningRef = useRef(false);

  const resetTimers = useCallback(() => {
    lastActivityRef.current = Date.now();
    showWarningRef.current = false;
    
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }
    if (logoutTimeoutRef.current) {
      clearTimeout(logoutTimeoutRef.current);
      logoutTimeoutRef.current = null;
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

  useEffect(() => {
    registerResetFunction(resetTimers);
  }, [registerResetFunction, resetTimers]);

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
      if (!lastActivityRef.current) return;
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

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
        warningTimeoutRef.current = null;
      }
      if (logoutTimeoutRef.current) {
        clearTimeout(logoutTimeoutRef.current);
        logoutTimeoutRef.current = null;
      }
      clearInterval(checkInterval);
      window.removeEventListener('idle-timeout-logout', handleIdleLogout);
    };
  }, [isAuthenticated, handleActivity, resetTimers, navigate]);

  return { resetTimers };
};
