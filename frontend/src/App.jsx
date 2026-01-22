import { useState, useEffect } from 'react'
import axios from 'axios'
import Login from './Login';

import { 
  Typography, Grid, Card, CardContent, Button, Chip, 
  Dialog, DialogTitle, DialogContent, TextField, DialogActions, 
  Snackbar, Alert, Paper, List, ListItem, ListItemText, Divider, 
  Box, IconButton, Avatar, InputBase, Badge, ListItemButton, ListItemIcon, Tooltip
} from '@mui/material'

// Icons
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event'; 
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'; 
import LogoutIcon from '@mui/icons-material/Logout';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

// Axios Interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [patients, setPatients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [duePatients, setDuePatients] = useState([]) 
  const [open, setOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  
  const [formData, setFormData] = useState({ date: '', time: '', notes: '' })
  const [notification, setNotification] = useState({ open: false, message: '' })
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [searchTerm, setSearchTerm] = useState('');

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('el-GR', options);
  }

  const fetchData = () => {
    axios.get('http://127.0.0.1:8000/api/patients/').then(res => setPatients(res.data)).catch(console.error);
    axios.get('http://127.0.0.1:8000/api/appointments/').then(res => setAppointments(res.data)).catch(console.error);
    axios.get('http://127.0.0.1:8000/api/patients/pending_invoices/').then(res => setDuePatients(res.data)).catch(console.error);
  }

  useEffect(() => {
    if (token) fetchData();
  }, [token])

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setPatients([]); setAppointments([]);
  };

  const handleOpenDialog = (patient) => {
    setSelectedPatient(patient)
    setOpen(true)
  }

  const handleCloseDialog = () => {
    setOpen(false)
    setFormData({ date: '', time: '', notes: '' }) 
  }

  const handleInvoicingClick = () => {
    setActiveTab('invoicing');
    window.open('https://smart.epsilonnet.gr/', '_blank'); 
  }

  const handleDeleteAppointment = (id) => {
    if(window.confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το ραντεβού;")) {
        axios.delete(`http://127.0.0.1:8000/api/appointments/${id}/`)
        .then(() => {
            setNotification({ open: true, message: 'Το ραντεβού διαγράφηκε.' });
            fetchData();
        })
        .catch(err => alert("Σφάλμα κατά τη διαγραφή"));
    }
  }

  const handleDeletePatient = (id) => {
    if(window.confirm("ΠΡΟΣΟΧΗ: Θα διαγραφεί ο ασθενής και όλα τα ραντεβού του. Συνέχεια;")) {
        axios.delete(`http://127.0.0.1:8000/api/patients/${id}/`)
        .then(() => {
            setNotification({ open: true, message: 'Ο ασθενής διαγράφηκε.' });
            fetchData();
        })
        .catch(err => alert("Σφάλμα κατά τη διαγραφή"));
    }
  }

  const handleSubmit = () => {
    if (!formData.date || !formData.time) {
      alert("Παρακαλώ συμπληρώστε ημερομηνία και ώρα!")
      return
    }
    const appointmentData = {
      patient: selectedPatient.id, 
      date: formData.date,
      time: formData.time,
      notes: formData.notes,
      status: 'SCHEDULED' 
    }
    axios.post('http://127.0.0.1:8000/api/appointments/', appointmentData)
      .then(response => {
        handleCloseDialog()
        setNotification({ open: true, message: 'Το ραντεβού αποθηκεύτηκε!' })
        fetchData();
      })
      .catch(error => {
        console.error("Σφάλμα:", error)
        alert("Κάτι πήγε στραβά.")
      })
  }

  const filteredPatients = patients.filter(patient => 
    patient.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.first_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!token) return <Login onLoginSuccess={setToken} />;

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#f4f7fe', fontFamily: 'Inter, sans-serif' }}>
      
      {/* SIDEBAR */}
      <Box sx={{ width: 280, backgroundColor: '#fff', display: 'flex', flexDirection: 'column', p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 6, mt: 1, pl: 1 }}>
             <Typography variant="h5" fontWeight="800" sx={{ color: '#1b2559', letterSpacing: '-0.5px' }}>
                therapy<span style={{color: '#4318ff'}}>.crm</span>
             </Typography>
          </Box>
          <List sx={{ px: 0 }}>
            <ListItemButton onClick={() => setActiveTab('dashboard')} sx={{ borderRadius: '12px', mb: 1, py: 1.5, bgcolor: activeTab === 'dashboard' ? '#4318ff' : 'transparent', color: activeTab === 'dashboard' ? '#fff' : '#a3aed0', '&:hover': { bgcolor: activeTab === 'dashboard' ? '#4318ff' : '#f4f7fe' } }}>
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><DashboardIcon /></ListItemIcon>
                <ListItemText primary="Dashboard" primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>
            <ListItemButton onClick={() => setActiveTab('patients')} sx={{ borderRadius: '12px', mb: 1, py: 1.5, color: '#a3aed0', '&:hover': { bgcolor: '#f4f7fe', color: '#1b2559' } }}>
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><PeopleIcon /></ListItemIcon>
                <ListItemText primary="Ασθενείς" primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>
            <ListItemButton onClick={handleInvoicingClick} sx={{ borderRadius: '12px', mb: 1, py: 1.5, color: '#a3aed0', '&:hover': { bgcolor: '#f4f7fe', color: '#1b2559' } }}>
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><ReceiptLongIcon /></ListItemIcon>
                <ListItemText primary="Epsilon Smart" primaryTypographyProps={{ fontWeight: 600 }} />
                <OpenInNewIcon sx={{ fontSize: 16, ml: 1, opacity: 0.5 }} />
            </ListItemButton>
          </List>
          <Box sx={{ flexGrow: 1 }} /> 
          <List>
             <ListItemButton onClick={handleLogout} sx={{ borderRadius: '12px', color: '#e02424', '&:hover': { bgcolor: '#fff5f5' } }}>
                <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Έξοδος" primaryTypographyProps={{ fontWeight: 600 }} />
             </ListItemButton>
          </List>
      </Box>

      {/* MAIN CONTENT */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 4 }}>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
            <Box>
                <Typography variant="body2" color="#707eae" fontWeight="500">Pages / Dashboard</Typography>
                <Typography variant="h4" fontWeight="700" color="#1b2559">Main Dashboard</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#fff', p: 1, borderRadius: '30px', boxShadow: '0px 10px 20px rgba(112, 144, 176, 0.07)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f4f7fe', borderRadius: '20px', px: 2, py: 1 }}>
                    <SearchIcon sx={{ color: '#8f9bba' }} />
                    <InputBase 
                        placeholder="Αναζήτηση..." 
                        sx={{ ml: 1, color: '#1b2559' }} 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Box>
                <IconButton>
                    <Badge badgeContent={duePatients.length} color="error" variant="dot">
                        <NotificationsNoneIcon sx={{ color: '#a3aed0' }} />
                    </Badge>
                </IconButton>
                <Avatar sx={{ width: 40, height: 40, bgcolor: '#11047a', fontSize: 16 }}>Dr</Avatar>
            </Box>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ borderRadius: '20px', p: 1, height: '100%', background: 'linear-gradient(135deg, #4318ff 0%, #11047a 100%)', color: 'white', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)' }}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <Box>
                                <Typography variant="subtitle2" sx={{ opacity: 0.8, fontSize: 14 }}>Συνολικοί Ασθενείς</Typography>
                                <Typography variant="h3" fontWeight="700" sx={{ my: 0.5 }}>{patients.length}</Typography>
                            </Box>
                            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}><PeopleIcon /></Avatar>
                        </Box>
                        <Chip label="Ενεργοί Πελάτες" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', alignSelf: 'start', mt: 2 }} />
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ borderRadius: '20px', p: 1, height: '100%', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)' }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <Avatar sx={{ bgcolor: '#f4f7fe', color: '#4318ff', width: 64, height: 64, mr: 2 }}><EventIcon sx={{ fontSize: 30 }} /></Avatar>
                        <Box>
                            <Typography variant="subtitle2" color="#a3aed0">Ραντεβού Σήμερα</Typography>
                            <Typography variant="h4" fontWeight="700" color="#1b2559">{appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length}</Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ borderRadius: '20px', p: 1, height: '100%', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)' }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <Avatar sx={{ bgcolor: duePatients.length > 0 ? '#fee2e2' : '#f4f7fe', color: duePatients.length > 0 ? '#e02424' : '#05cd99', width: 64, height: 64, mr: 2 }}><ReceiptLongIcon sx={{ fontSize: 30 }} /></Avatar>
                        <Box>
                            <Typography variant="subtitle2" color="#a3aed0">Προς Τιμολόγηση</Typography>
                            <Typography variant="h4" fontWeight="700" color="#1b2559">{duePatients.length}</Typography>
                            {duePatients.length > 0 && <Typography variant="caption" color="#e02424" fontWeight="bold">Άνοιξε το Smart!</Typography>}
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>

        <Grid container spacing={4}>
            <Grid size={{ xs: 12, lg: 8 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" fontWeight="700" color="#1b2559">Οι Ασθενείς μου</Typography>
                    <Button endIcon={<ArrowForwardIcon />} sx={{ borderRadius: '20px', textTransform: 'none', bgcolor: '#eef2ff', color: '#4318ff', fontWeight: '600' }}>Προβολή όλων</Button>
                </Box>
                <Grid container spacing={2}>
                    {filteredPatients.slice(0, 6).map(patient => (
                        <Grid size={{ xs: 12, sm: 6 }} key={patient.id}>
                            <Card sx={{ borderRadius: '20px', boxShadow: '0px 10px 20px rgba(112, 144, 176, 0.07)', border: '1px solid transparent', transition: '0.2s', '&:hover': { transform: 'translateY(-2px)', borderColor: '#4318ff' } }}>
                                <CardContent sx={{ display: 'flex', alignItems: 'center', p: '16px !important' }}>
                                    <Avatar sx={{ width: 50, height: 50, bgcolor: '#f4f7fe', color: '#4318ff', mr: 2, fontWeight: '700' }}>{patient.first_name[0]}</Avatar>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" fontWeight="700" fontSize="16px" color="#1b2559">{patient.last_name} {patient.first_name}</Typography>
                                        <Typography variant="caption" color="#a3aed0">Τηλ: {patient.parent_phone}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        <Tooltip title="Νέο Ραντεβού">
                                            <IconButton sx={{ color: '#4318ff', bgcolor: '#f4f7fe' }} onClick={() => handleOpenDialog(patient)}><AddCircleIcon /></IconButton>
                                        </Tooltip>
                                        <Tooltip title="Διαγραφή">
                                            <IconButton size="small" sx={{ color: '#e02424', bgcolor: '#fff5f5' }} onClick={() => handleDeletePatient(patient.id)}><DeleteOutlineIcon fontSize="small" /></IconButton>
                                        </Tooltip>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                    {filteredPatients.length === 0 && <Typography sx={{ ml: 2, color: '#888' }}>Κανένας ασθενής.</Typography>}
                </Grid>
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
                <Typography variant="h5" fontWeight="700" color="#1b2559" sx={{ mb: 3 }}>Πρόγραμμα</Typography>
                <Paper sx={{ borderRadius: '20px', p: 0, overflow: 'hidden', boxShadow: '0px 10px 20px rgba(112, 144, 176, 0.07)' }}>
                    <List sx={{ p: 0 }}>
                        {appointments.length === 0 ? <Box sx={{ p: 4, textAlign: 'center', color: '#a3aed0' }}>Κανένα ραντεβού.</Box> : appointments.map((app, index) => (
                            <Box key={app.id}>
                                <ListItem alignItems="flex-start" sx={{ p: 2, '&:hover': { bgcolor: '#f4f7fe' } }} secondaryAction={
                                    <IconButton edge="end" onClick={() => handleDeleteAppointment(app.id)}><DeleteOutlineIcon sx={{ color: '#e02424', opacity: 0.5, '&:hover': { opacity: 1 } }} /></IconButton>
                                }>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2, minWidth: 60, bgcolor: index === 0 ? '#4318ff' : '#fff', color: index === 0 ? '#fff' : '#1b2559', borderRadius: '12px', p: 1, boxShadow: '0px 4px 10px rgba(0,0,0,0.05)' }}>
                                        <Typography variant="subtitle2" fontWeight="700">{app.time.slice(0, 5)}</Typography>
                                        <Typography variant="caption" sx={{ opacity: 0.8 }}>{formatDate(app.date).slice(0, 5)}</Typography>
                                    </Box>
                                    <ListItemText primary={<Typography variant="subtitle2" fontWeight="700" color="#1b2559">{app.patient.last_name} {app.patient.first_name}</Typography>} secondary={<Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}><AccessTimeIcon sx={{ fontSize: 14, mr: 0.5, color: '#a3aed0' }} /><Typography variant="caption" color="#a3aed0">{app.notes || 'Συνεδρία'}</Typography></Box>} />
                                </ListItem>
                                {index < appointments.length - 1 && <Divider variant="inset" component="li" sx={{ ml: 10, mr: 2 }} />}
                            </Box>
                        ))}
                    </List>
                </Paper>
            </Grid>
        </Grid>
      </Box>

      {/* MODAL */}
      <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: '700', color: '#1b2559' }}>📅 Νέο Ραντεβού</DialogTitle>
        <DialogContent>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid size={{ xs: 6 }}><TextField label="Ημερομηνία" type="date" fullWidth InputLabelProps={{ shrink: true }} value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} /></Grid>
                <Grid size={{ xs: 6 }}><TextField label="Ώρα" type="time" fullWidth InputLabelProps={{ shrink: true }} value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} /></Grid>
                <Grid size={{ xs: 12 }}><TextField label="Σημειώσεις" fullWidth multiline rows={3} value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} /></Grid>
            </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ color: '#a3aed0', fontWeight: 600 }}>Ακύρωση</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: '#4318ff', borderRadius: '10px', px: 3, fontWeight: 600 }}>Αποθήκευση</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={notification.open} autoHideDuration={4000} onClose={() => setNotification({ ...notification, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity="success" variant="filled" sx={{ width: '100%', borderRadius: '10px' }}>{notification.message}</Alert>
      </Snackbar>
    </Box>
  )
}

export default App