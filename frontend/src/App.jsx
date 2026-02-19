import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { IdleTimeoutProvider } from './context/IdleTimeoutContext';
import { useIdleTimeout } from './hooks/useIdleTimeout';
import { IdleTimeoutWarning } from './components/IdleTimeoutWarning';
import { Box, CircularProgress } from '@mui/material';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Users from './pages/Users';
import PenanggungJawab from './pages/PenanggungJawab';
import PorsiPerusahaan from './pages/PorsiPerusahaan';
import StatusLaporanMK from './pages/StatusLaporanMK';
import Unauthorized from './pages/Unauthorized';
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <IdleTimeoutProvider>
      <AppContent />
    </IdleTimeoutProvider>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const isAuthenticated = !!user;
  
  useIdleTimeout(isAuthenticated);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (user) {
    return (
      <>
        <IdleTimeoutWarning />
        <Routes>
        <Route path="/login" element={<Navigate to="/dashboard" replace />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute adminOnly><Users /></ProtectedRoute>} />
          <Route path="/data-proyek/penanggung-jawab" element={<ProtectedRoute><PenanggungJawab /></ProtectedRoute>} />
          <Route path="/data-proyek/porsi-perusahaan" element={<ProtectedRoute><PorsiPerusahaan /></ProtectedRoute>} />
          <Route path="/status-laporan-mk" element={<ProtectedRoute><StatusLaporanMK /></ProtectedRoute>} />
        </Route>
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      </>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
