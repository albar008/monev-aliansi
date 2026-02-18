import { Outlet } from 'react-router-dom';
import { Box, Drawer, Typography } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useState } from 'react';

const MainLayout = () => {
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleMobile = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <Navbar 
        onToggleSidebar={() => setSidebarMinimized(!sidebarMinimized)} 
        sidebarMinimized={sidebarMinimized}
        onToggleMobile={handleToggleMobile}
      />
      <Box sx={{ display: 'flex', mt: '80px', p: { xs: 2, md: 3 }, minHeight: 'calc(100vh - 80px)' }}>
        <Box sx={{ width: { xs: 0, md: sidebarMinimized ? 72 : 240 }, flexShrink: 0, display: { xs: 'none', md: 'block' }, transition: 'width 0.2s' }}>
          <Box sx={{ position: 'sticky', top: 96, maxHeight: 'calc(100vh - 112px)', overflowY: 'auto' }}>
            <Sidebar minimized={sidebarMinimized} />
          </Box>
        </Box>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleToggleMobile}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: 280, boxSizing: 'border-box', bgcolor: 'white' },
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid #eee', mb: 1 }}>
            <Typography variant="h6" fontWeight="bold" color="primary">
              CEC Sekolah
            </Typography>
          </Box>
          <Sidebar />
        </Drawer>
        <Box sx={{ flexGrow: 1, ml: { md: 3 }, width: { xs: '100%', md: 'auto' } }}>
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

export default MainLayout;
