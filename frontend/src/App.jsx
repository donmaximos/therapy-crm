import { useState, useEffect } from 'react'
import axios from 'axios'

// Εισαγωγή εξαρτημάτων Material UI
import { 
  AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, 
  CardActions, Button, Chip, Dialog, DialogTitle, DialogContent, 
  TextField, DialogActions, Snackbar, Alert, Paper, List, ListItem, 
  ListItemText, Divider, Box 
} from '@mui/material'

import PersonIcon from '@mui/icons-material/Person'
import PhoneIcon from '@mui/icons-material/Phone'
import EventIcon from '@mui/icons-material/Event'

function App() {
  const [patients, setPatients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [duePatients, setDuePatients] = useState([]) 
  
  const [open, setOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    notes: ''
  })

  const [notification, setNotification] = useState({ open: false, message: '' })

  // --- Helpers ---
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('el-GR', options);
  }

  // --- API ---
  const fetchPatients = () => {
    axios.get('http://127.0.0.1:8000/api/patients/')
      .then(response => setPatients(response.data))
      .catch(error => console.error(error))
  }

  const fetchAppointments = () => {
    axios.get('http://127.0.0.1:8000/api/appointments/')
      .then(response => setAppointments(response.data))
      .catch(error => console.error(error))
  }

  const checkDueInvoices = () => {
    axios.get('http://127.0.0.1:8000/api/patients/pending_invoices/')
      .then(response => setDuePatients(response.data))
      .catch(error => console.error(error))
  }

  useEffect(() => {
    fetchPatients()
    fetchAppointments()
    checkDueInvoices()
  }, [])

  // --- Handlers ---
  const handleOpenDialog = (patient) => {
    setSelectedPatient(patient)
    setOpen(true)
  }

  const handleCloseDialog = () => {
    setOpen(false)
    setFormData({ date: '', time: '', notes: '' }) 
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
        setNotification({ open: true, message: 'Το ραντεβού έκλεισε επιτυχώς!' })
        fetchAppointments() 
      })
      .catch(error => {
        console.error("Σφάλμα:", error)
        alert("Κάτι πήγε στραβά.")
      })
  }

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Therapy CRM
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ marginTop: 4, paddingBottom: 4, flexGrow: 1 }}>
        
        {/* Ειδοποίηση */}
        {duePatients.length > 0 && (
          <Alert severity="warning" sx={{ marginBottom: 3, boxShadow: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              🔔 Εκκρεμείς Τιμολογήσεις (Σήμερα/Αύριο):
            </Typography>
            <ul style={{ margin: '5px 0', paddingLeft: 20 }}>
              {duePatients.map(p => (
                <li key={p.id}>
                  {p.last_name} {p.first_name} (Γονέας: {p.parent_phone})
                </li>
              ))}
            </ul>
          </Alert>
        )}

        {/* --- ΚΥΡΙΩΣ LAYOUT (FLEXBOX) --- */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, // Κάθετα σε κινητά, Οριζόντια σε PC
          gap: 4,
          alignItems: 'flex-start' 
        }}>
          
          {/* ΑΡΙΣΤΕΡΑ: Λίστα Ασθενών (Πιάνει το 65% του πλάτους) */}
          <Box sx={{ flex: { md: 2 }, width: '100%' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
              Οι Ασθενείς μου
            </Typography>
            
            <Grid container spacing={3}>
              {patients.map(patient => (
                // Χρησιμοποιούμε την παλιά σύνταξη (item) που δούλευε σίγουρα στη διάταξη
                <Grid item xs={12} sm={6} lg={4} key={patient.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                        <PersonIcon color="primary" sx={{ marginRight: 1 }} />
                        <Typography variant="h6">
                          {patient.last_name} {patient.first_name}
                        </Typography>
                      </div>
                      
                      <Typography color="text.secondary" sx={{ mb: 1 }}>
                        <strong>Γονέας:</strong> {patient.parent_name}
                      </Typography>
                      
                      <div style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                        <PhoneIcon fontSize="small" sx={{ marginRight: 0.5 }} />
                        <Typography variant="body2">{patient.parent_phone}</Typography>
                      </div>
                      
                      {patient.next_invoice_date && (
                        <Chip 
                          label={`Τιμολόγηση: ${formatDate(patient.next_invoice_date)}`} 
                          color="warning" 
                          size="small" 
                          sx={{ marginTop: 2, width: '100%' }}
                        />
                      )}
                    </CardContent>
                    
                    <CardActions sx={{ padding: 2, paddingTop: 0 }}>
                      <Button fullWidth variant="contained" onClick={() => handleOpenDialog(patient)}>
                        Νεο Ραντεβου
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* ΔΕΞΙΑ: Πρόγραμμα (Πιάνει το 35% του πλάτους) */}
          <Box sx={{ flex: { md: 1 }, width: '100%', minWidth: '300px' }}>
            <Paper elevation={4} sx={{ backgroundColor: '#fff', borderRadius: 2, overflow: 'hidden', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
              
              <div style={{ padding: '20px', backgroundColor: '#f9fafb', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center' }}>
                <EventIcon color="secondary" sx={{ marginRight: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#444' }}>
                  Πρόγραμμα
                </Typography>
              </div>

              <List sx={{ overflow: 'auto', flexGrow: 1, padding: 0 }}>
                {appointments.length === 0 ? (
                  <div style={{ padding: 20, textAlign: 'center', color: '#888' }}>
                    Δεν υπάρχουν ραντεβού.
                  </div>
                ) : (
                  appointments.map((app) => (
                    <div key={app.id}>
                      <ListItem alignItems="flex-start" sx={{ padding: 2 }}>
                        
                        {/* Κουτάκι Ώρας */}
                        <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            marginRight: 15,
                            backgroundColor: '#e3f2fd',
                            padding: '8px',
                            borderRadius: '8px',
                            minWidth: '65px',
                            border: '1px solid #90caf9'
                          }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1565c0' }}>
                            {app.time.slice(0, 5)}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#555', fontWeight: '500' }}>
                            {formatDate(app.date).slice(0, 5)}
                          </Typography>
                        </div>

                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {app.patient.last_name} {app.patient.first_name}
                            </Typography>
                          }
                          secondary={
                            <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                              {app.notes ? `📝 ${app.notes}` : "— Χωρίς σημειώσεις"}
                            </Typography>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                    </div>
                  ))
                )}
              </List>
            </Paper>
          </Box>

        </Box>

        {/* Modal */}
        <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle sx={{ backgroundColor: '#1976d2', color: 'white' }}>
            Νέο Ραντεβού: {selectedPatient?.last_name}
          </DialogTitle>
          <DialogContent sx={{ paddingTop: '20px !important' }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField label="Ημερομηνία" type="date" fullWidth InputLabelProps={{ shrink: true }}
                  value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Ώρα" type="time" fullWidth InputLabelProps={{ shrink: true }}
                  value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Σημειώσεις" fullWidth multiline rows={3}
                  value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ padding: 2 }}>
            <Button onClick={handleCloseDialog}>Ακυρωση</Button>
            <Button onClick={handleSubmit} variant="contained">Αποθηκευση</Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={notification.open} autoHideDuration={4000} onClose={() => setNotification({ ...notification, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert severity="success" variant="filled" sx={{ width: '100%' }}>{notification.message}</Alert>
        </Snackbar>

      </Container>
    </div>
  )
}

export default App