import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Box, Typography, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import RefreshIcon from '@mui/icons-material/Refresh';
import api from '../services/api';

const PorsiPerusahaan = () => {
  const [data, setData] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    project_id: '',
    nama_pemilik: '',
    persentase: '',
    nilai: '',
    keterangan: '',
  });

  const fetchData = useCallback(async () => {
    try {
      const response = await api.get('/porsi-perusahaan');
      setData(response.data.porsi_perusahaan);
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
    { field: 'nama_pemilik', headerName: 'Nama Pemilik', flex: 1 },
    { 
      field: 'persentase', 
      headerName: 'Persentase', 
      width: 120,
      valueFormatter: (value) => value ? `${value}%` : '-'
    },
    { 
      field: 'nilai', 
      headerName: 'Nilai', 
      width: 180,
      valueFormatter: (value) => value ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value) : '-'
    },
    { field: 'keterangan', headerName: 'Keterangan', flex: 1 },
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
        await api.put(`/porsi-perusahaan/${editingItem.id}`, formData);
      } else {
        await api.post('/porsi-perusahaan', formData);
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
      nama_pemilik: item.nama_pemilik || '',
      persentase: item.persentase || '',
      nilai: item.nilai || '',
      keterangan: item.keterangan || '',
    });
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        await api.delete(`/porsi-perusahaan/${id}`);
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
      nama_pemilik: '',
      persentase: '',
      nilai: '',
      keterangan: '',
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
            Porsi Perusahaan
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Kelola porsi perusahaan pada proyek
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={() => fetchData()} color="primary" title="Refresh">
            <RefreshIcon />
          </IconButton>
          <Button variant="contained" onClick={() => setOpenModal(true)}>
            Tambah Porsi
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
        <DialogTitle>{editingItem ? 'Edit' : 'Tambah'} Porsi Perusahaan</DialogTitle>
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
              label="Nama Pemilik"
              name="nama_pemilik"
              value={formData.nama_pemilik}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="Persentase (%)"
                name="persentase"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.persentase}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                label="Nilai"
                name="nilai"
                type="number"
                value={formData.nilai}
                onChange={handleInputChange}
              />
            </Box>
            <TextField
              fullWidth
              label="Keterangan"
              name="keterangan"
              multiline
              rows={2}
              value={formData.keterangan}
              onChange={handleInputChange}
            />
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

export default PorsiPerusahaan;
