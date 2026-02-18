import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Box, Typography, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import RefreshIcon from '@mui/icons-material/Refresh';
import api from '../services/api';

const PenanggungJawab = () => {
  const [data, setData] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    project_id: '',
    nama: '',
    jabatan: '',
    no_telp: '',
    email: '',
  });

  const fetchData = useCallback(async () => {
    try {
      const response = await api.get('/penanggung-jawab');
      setData(response.data.penanggung_jawab);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchProjects();
  }, [fetchData]);

  const columns = [
    { field: 'id', headerName: 'No', width: 70, renderCell: (params) => params.row.index + 1 },
    { field: 'nama', headerName: 'Nama', flex: 1 },
    { field: 'jabatan', headerName: 'Jabatan', flex: 1 },
    { field: 'no_telp', headerName: 'No. Telp', width: 140 },
    { field: 'email', headerName: 'Email', flex: 1 },
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
    try {
      if (editingItem) {
        await api.put(`/penanggung-jawab/${editingItem.id}`, formData);
      } else {
        await api.post('/penanggung-jawab', formData);
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      project_id: item.project_id,
      nama: item.nama,
      jabatan: item.jabatan || '',
      no_telp: item.no_telp || '',
      email: item.email || '',
    });
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        await api.delete(`/penanggung-jawab/${id}`);
        fetchData();
      } catch (error) {
        console.error('Failed to delete:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingItem(null);
    setFormData({
      project_id: '',
      nama: '',
      jabatan: '',
      no_telp: '',
      email: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const rowsWithIndex = data.map((row, index) => ({ ...row, index }));

  return (
    <Box className="fade-in">
      <Box className="page-header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Penanggung Jawab
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Kelola penanggung jawab proyek
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={() => fetchData()} color="primary" title="Refresh">
            <RefreshIcon />
          </IconButton>
          <Button variant="contained" onClick={() => setOpenModal(true)}>
            Tambah Penanggung Jawab
          </Button>
        </Box>
      </Box>

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
        <DialogTitle>{editingItem ? 'Edit' : 'Tambah'} Penanggung Jawab</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              select
              label="Proyek"
              name="project_id"
              value={formData.project_id}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            >
              <MenuItem value="">Pilih Proyek</MenuItem>
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.nama_proyek}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Nama"
              name="nama"
              value={formData.nama}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Jabatan"
              name="jabatan"
              value={formData.jabatan}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="No. Telp"
                name="no_telp"
                value={formData.no_telp}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Box>
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

export default PenanggungJawab;
