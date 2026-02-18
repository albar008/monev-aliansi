import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Box, Typography, Alert, InputAdornment, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RefreshIcon from '@mui/icons-material/Refresh';
import api from '../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    role: 'user',
  });

  const fetchUsers = useCallback(async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError(error.response?.data?.message || 'Gagal memuat data pengguna');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const columns = [
    { field: 'id', headerName: 'No', width: 70, renderCell: (params) => params.row.index + 1 },
    { field: 'username', headerName: 'Username', flex: 1 },
    { field: 'name', headerName: 'Nama', flex: 1 },
    { 
      field: 'role', 
      headerName: 'Role', 
      width: 120,
      renderCell: (params) => (
        <Box
          component="span"
          sx={{
            px: 1,
            py: 0.5,
            borderRadius: 1,
            bgcolor: params.value === 'admin' ? 'error.main' : 'primary.main',
            color: 'white',
            fontSize: '0.75rem',
          }}
        >
          {params.value}
        </Box>
      )
    },
    { 
      field: 'created_at', 
      headerName: 'Tanggal Dibuat', 
      width: 150,
      valueFormatter: (value) => {
        if (!value) return '-';
        try {
          const date = new Date(value);
          return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('id-ID');
        } catch {
          return '-';
        }
      }
    },
    {
      field: 'actions',
      headerName: 'Aksi',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Button
            size="small"
            variant="contained"
            color="primary"
            sx={{ mr: 1 }}
            onClick={() => handleEdit(params.row)}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            Hapus
          </Button>
        </Box>
      ),
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    console.log('Submitting formData:', formData);
    try {
      if (editingUser) {
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
        }
        await api.put(`/users/${editingUser.id}`, updateData);
      } else {
        console.log('Creating user with data:', formData);
        await api.post('/users', formData);
      }
      fetchUsers();
      handleCloseModal();
    } catch (err) {
      console.error('Failed to save user:', err);
      setFormError(err.response?.data?.message || 'Gagal menyimpan pengguna');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: '',
      name: user.name,
      email: user.email || '',
      role: user.role,
    });
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Failed to delete user:', error);
        alert(error.response?.data?.message || 'Gagal menghapus user');
      }
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingUser(null);
    setFormError(null);
    setShowPassword(false);
    setFormData({
      username: '',
      password: '',
      name: '',
      email: '',
      role: 'user',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const rowsWithIndex = users.map((row, index) => ({ ...row, index }));

  return (
    <Box className="fade-in">
      <Box className="page-header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Pengguna
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Kelola user sistem
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={() => fetchUsers()} color="primary" title="Refresh">
            <RefreshIcon />
          </IconButton>
          <Button variant="contained" onClick={() => setOpenModal(true)}>
            Tambah Pengguna
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent sx={{ p: 3 }}>
          <DataGrid
            rows={rowsWithIndex}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 25, 50]}
            loading={loading}
            disableRowSelectionOnClick
            autoHeight
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: 'grey.100',
              },
            }}
            localeText={{
              noRowsLabel: 'Tidak ada data',
              loadingOverlay: 'Memuat...',
            }}
          />
        </CardContent>
      </Card>

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{editingUser ? 'Edit Pengguna' : 'Tambah Pengguna'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {formError && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setFormError(null)}>
                {formError}
              </Alert>
            )}
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              disabled={editingUser}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              placeholder={editingUser ? 'Kosongkan jika tidak ingin mengubah' : ''}
              required={!editingUser}
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
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Nama"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              select
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Batal</Button>
            <Button type="submit" variant="contained">Simpan</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Users;
