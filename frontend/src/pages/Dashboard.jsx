import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  IconButton,
  Icon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
} from "@mui/material";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import InboxIcon from "@mui/icons-material/Inbox";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ImageIcon from "@mui/icons-material/Image";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import AddIcon from "@mui/icons-material/Add";
import FolderIcon from "@mui/icons-material/Folder";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StorageIcon from "@mui/icons-material/Storage";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AssignmentIcon from "@mui/icons-material/Assignment";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
);

const StatCard = ({ title, value, subtitle, progress, progressColor, icon, iconColor }) => (
  <Card sx={{ height: "100%", borderRadius: 2, boxShadow: 2 }}>
    <CardContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Avatar sx={{ bgcolor: iconColor, width: 48, height: 48 }}>
          {icon && <Icon component={icon} sx={{ color: 'white' }} />}
        </Avatar>
      </Box>
      {progress !== undefined && (
        <Box sx={{ mt: 2 }}>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
          >
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
            <Typography variant="caption" fontWeight="bold">
              {progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: "grey.200",
              "& .MuiLinearProgress-bar": { bgcolor: progressColor },
            }}
          />
        </Box>
      )}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({
    total_projects: 0,
    active_projects: 0,
    completed_projects: 0,
    total_nilai: 0,
  });
  const [_projectsPerMonth, setProjectsPerMonth] = useState({
    labels: [],
    data: [],
  });
  const [_porsiDistribution, setPorsiDistribution] = useState({
    labels: [],
    data: [],
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      const [statsRes, projectsRes, porsiRes] = await Promise.all([
        api.get("/dashboard/stats"),
        api.get("/dashboard/projects-per-month"),
        api.get("/dashboard/porsi-distribution"),
      ]);
      setStats(statsRes.data.stats);
      setProjectsPerMonth(projectsRes.data);
      setPorsiDistribution(porsiRes.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value || 0);

  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Penjualan",
        data: [12, 19, 3, 5, 2, 3, 10],
        backgroundColor: "rgba(13, 110, 253, 0.8)",
      },
    ],
  };

  const salesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  };

  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Pendapatan",
        data: [65, 59, 80, 81, 56, 55],
        borderColor: "rgba(25, 135, 84, 1)",
        backgroundColor: "rgba(25, 135, 84, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const revenueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  };

  const topSellers = [
    {
      name: "John Doe",
      role: "Web Developer",
      sales: 2450000,
      avatar: "JD",
      color: "#e53935",
    },
    {
      name: "Ruben Tillman",
      role: "UI Designer",
      sales: 1850000,
      avatar: "RT",
      color: "#1e88e5",
    },
    {
      name: "Elliot Huber",
      role: "Developer",
      sales: 1200000,
      avatar: "EH",
      color: "#43a047",
    },
  ];

  const recentSales = [
    {
      id: "#345",
      name: "John Doe",
      city: "Madrid",
      status: "Pending",
      amount: "Rp 2.400.000",
      avatar: "JD",
    },
    {
      id: "#347",
      name: "Ruben Tillman",
      city: "Berlin",
      status: "Completed",
      amount: "Rp 1.800.000",
      avatar: "RT",
    },
    {
      id: "#321",
      name: "Elliot Huber",
      city: "London",
      status: "In Progress",
      amount: "Rp 3.200.000",
      avatar: "EH",
    },
    {
      id: "#355",
      name: "Vinnie Wagstaff",
      city: "Amsterdam",
      status: "On Hold",
      amount: "Rp 950.000",
      avatar: "VW",
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      Pending: "warning",
      Completed: "success",
      "In Progress": "info",
      "On Hold": "default",
    };
    return colors[status] || "default";
  };

  return (
    <Box className="fade-in" sx={{ pb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          p: 2,
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Selamat datang, <strong>{user?.name}</strong>
          </Typography>
        </Box>
        <Box>
          <IconButton sx={{ mr: 1 }}>
            <InboxIcon />
          </IconButton>
          <IconButton sx={{ mr: 1 }}>
            <MenuBookIcon />
          </IconButton>
          <IconButton sx={{ mr: 1 }}>
            <ImageIcon />
          </IconButton>
          <IconButton>
            <InsertDriveFileIcon />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <StatCard
            title="Total Proyek"
            value={stats.total_projects}
            subtitle="Target: 50"
            progress={65}
            progressColor="primary"
            icon={FolderIcon}
            iconColor="primary.main"
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <StatCard
            title="Proyek Selesai"
            value={stats.completed_projects}
            subtitle="Target: 30"
            progress={83}
            progressColor="success"
            icon={DoneAllIcon}
            iconColor="success.main"
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <StatCard
            title="Total Nilai"
            value={formatCurrency(stats.total_nilai)}
            subtitle="Target: 100%"
            progress={45}
            progressColor="warning"
            icon={AttachMoneyIcon}
            iconColor="warning.main"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ borderRadius: 2, boxShadow: 2, height: "100%" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Sales Report
                </Typography>
                <Box>
                  <Button
                    size="small"
                    variant={tabValue === 0 ? "contained" : "outlined"}
                    onClick={() => setTabValue(0)}
                    sx={{ mr: 1 }}
                  >
                    Day
                  </Button>
                  <Button
                    size="small"
                    variant={tabValue === 1 ? "contained" : "outlined"}
                    onClick={() => setTabValue(1)}
                    sx={{ mr: 1 }}
                  >
                    Week
                  </Button>
                  <Button
                    size="small"
                    variant={tabValue === 2 ? "contained" : "outlined"}
                    onClick={() => setTabValue(2)}
                  >
                    Month
                  </Button>
                </Box>
              </Box>
              <Box sx={{ height: 300 }}>
                <Bar data={salesData} options={salesOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ borderRadius: 2, boxShadow: 2, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Revenue
              </Typography>
              <Box sx={{ height: 300 }}>
                <Line data={revenueData} options={revenueOptions} />
              </Box>
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: "grey.100",
                  borderRadius: 2,
                  textAlign: "center",
                }}
              >
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  + 175%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Increase from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Recent Sales
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "grey.100" }}>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="bold">
                          #
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Name
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="bold">
                          City
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Status
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Amount
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Actions
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentSales.map((sale) => (
                      <TableRow key={sale.id} hover>
                        <TableCell>{sale.id}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                fontSize: 12,
                                bgcolor: "primary.main",
                              }}
                            >
                              {sale.avatar}
                            </Avatar>
                            <Typography variant="body2">{sale.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{sale.city}</TableCell>
                        <TableCell>
                          <Chip
                            label={sale.status}
                            color={getStatusColor(sale.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {sale.amount}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Button size="small" variant="outlined">
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Top Sellers
              </Typography>
              {topSellers.map((seller, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 2,
                    p: 2,
                    bgcolor: "grey.50",
                    borderRadius: 2,
                  }}
                >
                  <Avatar sx={{ bgcolor: seller.color, width: 48, height: 48 }}>
                    {seller.avatar}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {seller.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {seller.role}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color="success.main"
                    >
                      {formatCurrency(seller.sales)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Sales
                    </Typography>
                  </Box>
                </Box>
              ))}
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ mt: 2 }}
              >
                View All
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <Avatar sx={{ bgcolor: "info.main", width: 40, height: 40 }}>
                  <NotificationsIcon />
                </Avatar>
                <Typography variant="subtitle1" fontWeight="bold">
                  Notifications
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                You have 21 unread messages
              </Typography>
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: "primary.main",
                  borderRadius: 2,
                  color: "white",
                  textAlign: "center",
                }}
              >
                <Typography variant="h5" fontWeight="bold">
                  All Hands Meeting
                </Typography>
                <Typography variant="caption">Today at 3:00 PM</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <Avatar sx={{ bgcolor: "warning.main", width: 40, height: 40 }}>
                  <StorageIcon />
                </Avatar>
                <Typography variant="subtitle1" fontWeight="bold">
                  Server Status
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Server Load 1
              </Typography>
              <LinearProgress
                variant="determinate"
                value={43}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  mb: 1,
                  bgcolor: "grey.200",
                  "& .MuiLinearProgress-bar": { bgcolor: "success.main" },
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Server Load 2
              </Typography>
              <LinearProgress
                variant="determinate"
                value={65}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  mb: 1,
                  bgcolor: "grey.200",
                  "& .MuiLinearProgress-bar": { bgcolor: "warning.main" },
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Server Load 3
              </Typography>
              <LinearProgress
                variant="determinate"
                value={18}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: "grey.200",
                  "& .MuiLinearProgress-bar": { bgcolor: "error.main" },
                }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <Avatar sx={{ bgcolor: "success.main", width: 40, height: 40 }}>
                  <CloudUploadIcon />
                </Avatar>
                <Typography variant="subtitle1" fontWeight="bold">
                  File Transfers
                </Typography>
              </Box>
              {[
                "TPSReport.docx",
                "Latest_photos.zip",
                "Annual Revenue.pdf",
                "Analytics_GrowthReport.xls",
              ].map((file, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    py: 0.5,
                  }}
                >
                  <InsertDriveFileIcon fontSize="small" color="primary" />
                  <Typography variant="body2">{file}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <Avatar sx={{ bgcolor: "error.main", width: 40, height: 40 }}>
                  <AssignmentIcon />
                </Avatar>
                <Typography variant="subtitle1" fontWeight="bold">
                  Tasks in Progress
                </Typography>
              </Box>
              {[
                "Wash the car",
                "Development Task",
                "Go grocery shopping",
                "Build the production",
              ].map((task, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    py: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor:
                        i === 0
                          ? "error.main"
                          : i === 1
                            ? "warning.main"
                            : "success.main",
                    }}
                  />
                  <Typography variant="body2" noWrap>
                    {task}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
