import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, Typography } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const Sidebar = ({ minimized = false }) => {
  const location = useLocation();
  const { isAdmin } = useAuth();
  const [dataProyekOpen, setDataProyekOpen] = useState(
    location.pathname.startsWith('/data-proyek')
  );

  const isActive = (path) => location.pathname === path;

  return (
    <Box sx={{ bgcolor: 'white', borderRadius: 2, p: minimized ? 1 : 2, minHeight: minimized ? 'auto' : 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <List component="nav" sx={{ flexGrow: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            component={NavLink}
            to="/dashboard"
            selected={isActive('/dashboard')}
            sx={{ borderRadius: 1, mb: 1, justifyContent: minimized ? 'center' : 'flex-start', px: minimized ? 1 : 2 }}
          >
            <ListItemIcon sx={{ minWidth: minimized ? 'auto' : 40, justifyContent: 'center' }}>
              <DashboardIcon fontSize="small" />
            </ListItemIcon>
            {!minimized && <ListItemText primary="Dashboard" />}
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            component={NavLink}
            to="/projects"
            selected={isActive('/projects')}
            sx={{ borderRadius: 1, mb: 1, justifyContent: minimized ? 'center' : 'flex-start', px: minimized ? 1 : 2 }}
          >
            <ListItemIcon sx={{ minWidth: minimized ? 'auto' : 40, justifyContent: 'center' }}>
              <FolderIcon fontSize="small" />
            </ListItemIcon>
            {!minimized && <ListItemText primary="Daftar Proyek" />}
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            component={NavLink}
            to="/status-laporan-mk"
            selected={isActive('/status-laporan-mk')}
            sx={{ borderRadius: 1, mb: 1, justifyContent: minimized ? 'center' : 'flex-start', px: minimized ? 1 : 2 }}
          >
            <ListItemIcon sx={{ minWidth: minimized ? 'auto' : 40, justifyContent: 'center' }}>
              <DescriptionIcon fontSize="small" />
            </ListItemIcon>
            {!minimized && <ListItemText primary="Status Laporan MK" />}
          </ListItemButton>
        </ListItem>

        {isAdmin() && (
          <ListItem disablePadding>
            <ListItemButton
              component={NavLink}
              to="/users"
              selected={isActive('/users')}
              sx={{ borderRadius: 1, mb: 1, justifyContent: minimized ? 'center' : 'flex-start', px: minimized ? 1 : 2 }}
            >
              <ListItemIcon sx={{ minWidth: minimized ? 'auto' : 40, justifyContent: 'center' }}>
                <PeopleIcon fontSize="small" />
              </ListItemIcon>
              {!minimized && <ListItemText primary="Pengguna" />}
            </ListItemButton>
          </ListItem>
        )}

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => setDataProyekOpen(!dataProyekOpen)}
            sx={{ borderRadius: 1, mb: 1, justifyContent: minimized ? 'center' : 'flex-start', px: minimized ? 1 : 2 }}
          >
            <ListItemIcon sx={{ minWidth: minimized ? 'auto' : 40, justifyContent: 'center' }}>
              <FolderIcon fontSize="small" />
            </ListItemIcon>
            {!minimized && <ListItemText primary="Data Proyek" />}
            {!minimized && (dataProyekOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </ListItem>

        <Collapse in={dataProyekOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              component={NavLink}
              to="/data-proyek/penanggung-jawab"
              selected={isActive('/data-proyek/penanggung-jawab')}
              sx={{ pl: minimized ? 1 : 4, borderRadius: 1, mb: 1, justifyContent: minimized ? 'center' : 'flex-start' }}
            >
              {!minimized && <ListItemText primary="Penanggung Jawab" />}
            </ListItemButton>
            <ListItemButton
              component={NavLink}
              to="/data-proyek/porsi-perusahaan"
              selected={isActive('/data-proyek/porsi-perusahaan')}
              sx={{ pl: minimized ? 1 : 4, borderRadius: 1, justifyContent: minimized ? 'center' : 'flex-start' }}
            >
              {!minimized && <ListItemText primary="Porsi Perusahaan" />}
            </ListItemButton>
          </List>
        </Collapse>
      </List>

      {!minimized && (
        <Box sx={{ position: 'absolute', bottom: 8, left: 0, right: 0, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            &copy; 2026 CEC Sekolah
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Sidebar;
