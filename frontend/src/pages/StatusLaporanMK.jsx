import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Box, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControlLabel, Checkbox, Chip, Alert, Select, FormControl, InputLabel } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';

const StatusLaporanMK = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [alert, setAlert] = useState({ show: false, severity: 'success', message: '' });

  const [formData, setFormData] = useState({
    tahun: '',
    proyek: '',
    konsultan_pelaksana: '',
    pendahuluan: false,
    mingguan: false,
    bulanan: false,
    antara: false,
    tiga_bulanan: false,
    tahunan: false,
    executive_summary: false,
    khusus: false,
    akhir: false,
  });

  const fetchYears = async () => {
    try {
      const response = await api.get('/status-laporan-mk/years');
      setYears(response.data.data);
    } catch (error) {
      console.error('Failed to fetch years:', error);
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = selectedYear ? { tahun: selectedYear } : {};
      const response = await api.get('/status-laporan-mk', { params });
      setData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      showAlert('Gagal memuat data', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedYear]);

  useEffect(() => {
    fetchYears();
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedYear, fetchData]);

  const showAlert = (message, severity = 'success') => {
    setAlert({ show: true, severity, message });
    setTimeout(() => setAlert({ show: false, severity: 'success', message: '' }), 3000);
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingData(item);
      setFormData({
        tahun: item.tahun,
        proyek: item.proyek,
        konsultan_pelaksana: item.konsultan_pelaksana,
        pendahuluan: item.pendahuluan,
        mingguan: item.mingguan,
        bulanan: item.bulanan,
        antara: item.antara,
        tiga_bulanan: item.tiga_bulanan,
        tahunan: item.tahunan,
        executive_summary: item.executive_summary,
        khusus: item.khusus,
        akhir: item.akhir,
      });
    } else {
      setEditingData(null);
      setFormData({
        tahun: '',
        proyek: '',
        konsultan_pelaksana: '',
        pendahuluan: false,
        mingguan: false,
        bulanan: false,
        antara: false,
        tiga_bulanan: false,
        tahunan: false,
        executive_summary: false,
        khusus: false,
        akhir: false,
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingData(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingData) {
        await api.put(`/status-laporan-mk/${editingData.id}`, formData);
        showAlert('Data berhasil diperbarui');
      } else {
        await api.post('/status-laporan-mk', formData);
        showAlert('Data berhasil ditambahkan');
      }
      fetchData();
      fetchYears();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save data:', error);
      showAlert(error.response?.data?.message || 'Gagal menyimpan data', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/status-laporan-mk/${deleteId}`);
      showAlert('Data berhasil dihapus');
      fetchData();
      fetchYears();
    } catch (error) {
      console.error('Failed to delete data:', error);
      showAlert('Gagal menghapus data', 'error');
    } finally {
      setOpenDelete(false);
      setDeleteId(null);
    }
  };

  const openDeleteDialog = (id) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  const reportFields = [
    { key: 'pendahuluan', label: 'Pendahuluan' },
    { key: 'mingguan', label: 'Mingguan' },
    { key: 'bulanan', label: 'Bulanan' },
    { key: 'antara', label: 'Antara' },
    { key: 'tiga_bulanan', label: '3 Bulanan' },
    { key: 'tahunan', label: 'Tahunan' },
    { key: 'executive_summary', label: 'Executive Summary' },
    { key: 'khusus', label: 'Khusus' },
    { key: 'akhir', label: 'Akhir' },
  ];

  const columns = [
    { field: 'tahun', headerName: 'Tahun', width: 70 },
    { field: 'proyek', headerName: 'Proyek', flex: 1, minWidth: 120 },
    { field: 'konsultan_pelaksana', headerName: 'Konsultan', flex: 1, minWidth: 120 },
    ...reportFields.map(field => ({
      field: field.key,
      headerName: field.label,
      width: 70,
      renderCell: (params) => (
        params.value 
          ? <Chip label="✔" color="success" size="small" />
          : <Chip label="✖" color="error" size="small" />
      )
    })),
    {
      field: 'actions',
      headerName: 'Aksi',
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size="small" color="primary" onClick={() => handleOpenModal(params.row)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => openDeleteDialog(params.row.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box className="fade-in">
      {alert.show && (
        <Alert severity={alert.severity} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      <Box className="page-header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Status Laporan MK
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Kelola status laporan MK
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Tahun</InputLabel>
            <Select
              value={selectedYear}
              label="Tahun"
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <MenuItem value="">Semua</MenuItem>
              {years.map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton onClick={() => fetchData()} color="primary" title="Refresh">
            <RefreshIcon />
          </IconButton>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
            Tambah Data
          </Button>
        </Box>
      </Box>

      <Card sx={{ borderRadius: 2, boxShadow: 1, overflow: 'hidden' }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ width: '100%', overflowX: 'auto' }}>
            <DataGrid
              rows={data}
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
                minWidth: 800,
                '& .MuiDataGrid-columnHeaders': {
                  bgcolor: 'grey.100',
                },
              }}
              localeText={{
                noRowsLabel: 'Tidak ada data',
                loadingOverlay: 'Memuat...',
              }}
            />
          </Box>
        </CardContent>
      </Card>

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>{editingData ? 'Edit Data' : 'Tambah Data'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="Tahun"
                name="tahun"
                type="number"
                value={formData.tahun}
                onChange={handleInputChange}
                required
              />
              <TextField
                fullWidth
                label="Proyek"
                name="proyek"
                value={formData.proyek}
                onChange={handleInputChange}
                required
              />
            </Box>
            <TextField
              fullWidth
              label="Konsultan Pelaksana"
              name="konsultan_pelaksana"
              value={formData.konsultan_pelaksana}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Status Laporan:</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
              {reportFields.map(field => (
                <FormControlLabel
                  key={field.key}
                  control={
                    <Checkbox
                      name={field.key}
                      checked={formData[field.key]}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label={field.label}
                />
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Batal</Button>
            <Button type="submit" variant="contained">Simpan</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Konfirmasi Hapus</DialogTitle>
        <DialogContent>
          <Typography>Apakah Anda yakin ingin menghapus data ini?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Batal</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Hapus</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StatusLaporanMK;
