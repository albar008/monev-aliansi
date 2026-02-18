import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Tabs, Tab, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useState } from 'react';

const Navbar = ({ onToggleSidebar, sidebarMinimized, onToggleMobile }) => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState({
    current_password: false,
    new_password: false,
    confirm_password: false,
  });
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const handleLogoutClick = () => {
    handleMenuClose();
    setOpenLogoutDialog(true);
  };

  const handleConfirmLogout = async () => {
    setOpenLogoutDialog(false);
    await logout();
    navigate('/login');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenProfile = () => {
    setFormData({
      name: user?.name || '',
      username: user?.username || '',
      email: user?.email || '',
    });
    setPasswordData({
      current_password: '',
      new_password: '',
      confirm_password: '',
    });
    setTabValue(0);
    setOpenProfile(true);
    handleMenuClose();
  };

  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleTogglePassword = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const resetPasswordFields = () => {
    setPasswordData({
      current_password: '',
      new_password: '',
      confirm_password: '',
    });
    setShowPassword({
      current_password: false,
      new_password: false,
      confirm_password: false,
    });
  };

  const handleTabChange = (e, v) => {
    if (v === 0) {
      resetPasswordFields();
    }
    setTabValue(v);
  };

  const handleCloseProfile = () => {
    resetPasswordFields();
    setOpenProfile(false);
  };

  const handleProfileSubmit = async () => {
    try {
      await updateProfile(formData);
      setOpenProfile(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handlePasswordSubmit = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      alert('Password baru dan konfirmasi password tidak cocok');
      return;
    }
    try {
      await updateProfile({ ...passwordData, _method: 'put' });
      setOpenProfile(false);
      alert('Password berhasil diubah, Silakan login kembali dengan password baru');
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to update password:', error);
      alert('Gagal mengubah password');
    }
  };

  return (
    <AppBar position="fixed" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: 1 }}>
      <Toolbar>
        <IconButton onClick={onToggleMobile} color="primary" sx={{ mr: 2, display: { xs: 'inline-flex', md: 'none' } }}>
          <MenuIcon />
        </IconButton>
        <IconButton onClick={() => onToggleSidebar()} color="primary" sx={{ mr: 2, display: { xs: 'none', md: 'inline-flex' } }}>
          {sidebarMinimized ? <MenuIcon /> : <ChevronLeftIcon />}
        </IconButton>
        <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1, color: 'primary.main', fontSize: { xs: '1rem', md: '1.25rem' } }}>
          Admin Panel
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Welcome, <strong>{user?.name}</strong>
          </Typography>
          <IconButton onClick={handleMenuOpen} color="primary">
            <SettingsIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleOpenProfile}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit Profil</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleLogoutClick}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>

      <Dialog open={openProfile} onClose={handleCloseProfile} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profil</DialogTitle>
        <DialogContent>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="Profil" />
            <Tab label="Reset Password" />
          </Tabs>
          
          {tabValue === 0 && (
            <>
              <TextField
                fullWidth
                label="Nama"
                name="name"
                value={formData.name}
                onChange={handleProfileChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                disabled
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleProfileChange}
                margin="normal"
              />
            </>
          )}

          {tabValue === 1 && (
            <>
              <TextField
                fullWidth
                label="Password Saat Ini"
                name="current_password"
                type={showPassword.current_password ? 'text' : 'password'}
                value={passwordData.current_password}
                onChange={handlePasswordChange}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => handleTogglePassword('current_password')} edge="end">
                        {showPassword.current_password ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Password Baru"
                name="new_password"
                type={showPassword.new_password ? 'text' : 'password'}
                value={passwordData.new_password}
                onChange={handlePasswordChange}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => handleTogglePassword('new_password')} edge="end">
                        {showPassword.new_password ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Konfirmasi Password Baru"
                name="confirm_password"
                type={showPassword.confirm_password ? 'text' : 'password'}
                value={passwordData.confirm_password}
                onChange={handlePasswordChange}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => handleTogglePassword('confirm_password')} edge="end">
                        {showPassword.confirm_password ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </>
          )}
        </DialogContent>
        <form onSubmit={tabValue === 0 ? handleProfileSubmit : handlePasswordSubmit}>
          <DialogActions>
            <Button onClick={handleCloseProfile}>Batal</Button>
            {tabValue === 0 ? (
              <Button type="submit" variant="contained">Simpan</Button>
            ) : (
              <Button type="submit" variant="contained">Ubah Password</Button>
            )}
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)}>
        <DialogTitle>Konfirmasi Logout</DialogTitle>
        <DialogContent>
          <Typography>
            Apakah Anda yakin ingin logout?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogoutDialog(false)}>Batal</Button>
          <Button onClick={handleConfirmLogout} color="error" variant="contained">Logout</Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default Navbar;
