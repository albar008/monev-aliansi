import { createContext, useContext, useRef, useCallback } from 'react';

const IdleTimeoutContext = createContext(null);

export const useIdleTimeoutContext = () => {
  const context = useContext(IdleTimeoutContext);
  if (!context) {
    throw new Error('useIdleTimeoutContext must be used within IdleTimeoutProvider');
  }
  return context;
};

export const IdleTimeoutProvider = ({ children }) => {
  const resetTimersRef = useRef(null);

  const registerResetFunction = useCallback((resetFn) => {
    resetTimersRef.current = resetFn;
  }, []);

  const triggerReset = useCallback(() => {
    if (resetTimersRef.current) {
      resetTimersRef.current();
    }
  }, []);

  return (
    <IdleTimeoutContext.Provider value={{ registerResetFunction, triggerReset }}>
      {children}
    </IdleTimeoutContext.Provider>
  );
};
