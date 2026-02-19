import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Box, Typography, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import RefreshIcon from '@mui/icons-material/Refresh';
import api from '../services/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    nama_proyek: '',
    klien: '',
    nilai_kontrak: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    status: 'aktif',
    deskripsi: '',
  });

  const fetchProjects = useCallback(async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const columns = [
    { field: 'id', headerName: 'No', width: 70, renderCell: (params) => params.row.index + 1 },
    { field: 'nama_proyek', headerName: 'Nama Proyek', flex: 1 },
    { field: 'klien', headerName: 'Klien', flex: 1 },
    { 
      field: 'nilai_kontrak', 
      headerName: 'Nilai Kontrak', 
      width: 180,
      valueFormatter: (value) => value ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value) : '-'
    },
    { 
      field: 'tanggal_mulai', 
      headerName: 'Tanggal Mulai', 
      width: 130,
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
      field: 'tanggal_selesai', 
      headerName: 'Tanggal Selesai', 
      width: 130,
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
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => {
        const colors = {
          aktif: 'success',
          selesai: 'info',
          ditunda: 'warning',
        };
        return (
          <Box
            component="span"
            sx={{
              px: 1,
              py: 0.5,
              borderRadius: 1,
              bgcolor: `${colors[params.value]}.main`,
              color: 'white',
              fontSize: '0.75rem',
            }}
          >
            {params.value}
          </Box>
        );
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
    try {
      if (editingProject) {
        await api.put(`/projects/${editingProject.id}`, formData);
      } else {
        await api.post('/projects', formData);
      }
      fetchProjects();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      nama_proyek: project.nama_proyek,
      klien: project.klien || '',
      nilai_kontrak: project.nilai_kontrak || '',
      tanggal_mulai: formatDateForInput(project.tanggal_mulai),
      tanggal_selesai: formatDateForInput(project.tanggal_selesai),
      status: project.status,
      deskripsi: project.deskripsi || '',
    });
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus proyek ini?')) {
      try {
        await api.delete(`/projects/${id}`);
        fetchProjects();
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingProject(null);
    setFormData({
      nama_proyek: '',
      klien: '',
      nilai_kontrak: '',
      tanggal_mulai: '',
      tanggal_selesai: '',
      status: 'aktif',
      deskripsi: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'nilai_kontrak') {
      const numericValue = value.replace(/[^\d]/g, '');
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const formatRupiah = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('id-ID').format(value);
  };

  const rowsWithIndex = projects.map((row, index) => ({ ...row, index }));

  return (
    <Box className="fade-in">
      <Box className="page-header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Daftar Proyek
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Kelola proyek perusahaan
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={() => fetchProjects()} color="primary" title="Refresh">
            <RefreshIcon />
          </IconButton>
          <Button variant="contained" onClick={() => setOpenModal(true)}>
            Tambah Proyek
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

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>{editingProject ? 'Edit Proyek' : 'Tambah Proyek'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="Nama Proyek"
                name="nama_proyek"
                value={formData.nama_proyek}
                onChange={handleInputChange}
                required
              />
              <TextField
                fullWidth
                label="Klien"
                name="klien"
                value={formData.klien}
                onChange={handleInputChange}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="Nilai Kontrak"
                name="nilai_kontrak"
                type="text"
                value={formatRupiah(formData.nilai_kontrak)}
                onChange={handleInputChange}
                placeholder="0"
              />
              <TextField
                fullWidth
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <MenuItem value="aktif">Aktif</MenuItem>
                <MenuItem value="selesai">Selesai</MenuItem>
                <MenuItem value="ditunda">Ditunda</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="Tanggal Mulai"
                name="tanggal_mulai"
                type="date"
                value={formData.tanggal_mulai}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Tanggal Selesai"
                name="tanggal_selesai"
                type="date"
                value={formData.tanggal_selesai}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <TextField
              fullWidth
              label="Deskripsi"
              name="deskripsi"
              multiline
              rows={3}
              value={formData.deskripsi}
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

export default Projects;
