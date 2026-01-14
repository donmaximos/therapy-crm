import { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, 
  CardActions, Button, Chip, Dialog, DialogTitle, DialogContent, 
  TextField, DialogActions, Snackbar, Alert 
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import PhoneIcon from '@mui/icons-material/Phone'

function App() {
  const [patients, setPatients] = useState([])
  
  // --- ΝΕΑ STATE ΓΙΑ ΤΟ MODAL ---
  const [open, setOpen] = useState(false) // Ανοιχτό ή Κλειστό;
  const [selectedPatient, setSelectedPatient] = useState(null) // Ποιον ασθενή επιλέξαμε;
  
  // Τα δεδομένα της φόρμας
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    notes: ''
  })

  // Μήνυμα επιτυχίας
  const [notification, setNotification] = useState({ open: false, message: '' })

  // Φόρτωση Ασθενών
  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = () => {
    axios.get('http://127.0.0.1:8000/api/patients/')
      .then(response => setPatients(response.data))
      .catch(error => console.error(error))
  }

  // Άνοιγμα του παραθύρου
  const handleOpenDialog = (patient) => {
    setSelectedPatient(patient)
    setOpen(true)
  }

  // Κλείσιμο του παραθύρου
  const handleCloseDialog = () => {
    setOpen(false)
    setFormData({ date: '', time: '', notes: '' }) // Καθαρισμός φόρμας
  }

  // Αποστολή στο Django
  const handleSubmit = () => {
    if (!formData.date || !formData.time) {
      alert("Παρακαλώ συμπληρώστε ημερομηνία και ώρα!")
      return
    }

    const appointmentData = {
      patient: selectedPatient.id, // Το ID του ασθενή
      date: formData.date,
      time: formData.time,
      notes: formData.notes,
      status: 'SCHEDULED' // Προεπιλογή
    }

    axios.post('http://127.0.0.1:8000/api/appointments/', appointmentData)
      .then(response => {
        console.log("Επιτυχία:", response.data)
        handleCloseDialog()
        setNotification({ open: true, message: 'Το ραντεβού έκλεισε επιτυχώς!' })
      })
      .catch(error => {
        console.error("Σφάλμα:", error)
        alert("Κάτι πήγε στραβά. Δες την κονσόλα (F12).")
      })
  }

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Therapy CRM
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>Οι Ασθενείς μου</Typography>

        <Grid container spacing={3}>
          {patients.map(patient => (
            <Grid item xs={12} sm={6} md={4} key={patient.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                    <PersonIcon color="primary" sx={{ marginRight: 1 }} />
                    <Typography variant="h5">{patient.last_name} {patient.first_name}</Typography>
                  </div>
                  <Typography color="text.secondary">Γονέας: {patient.parent_name}</Typography>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#666', marginTop: 5 }}>
                    <PhoneIcon fontSize="small" sx={{ marginRight: 0.5 }} />
                    <Typography variant="body2">{patient.parent_phone}</Typography>
                  </div>
                  {patient.next_invoice_date && (
                    <Chip label={`Τιμολόγηση: ${patient.next_invoice_date}`} color="warning" size="small" sx={{ marginTop: 2 }} />
                  )}
                </CardContent>
                <CardActions>
                  {/* ΚΟΥΜΠΙ ΠΟΥ ΑΝΟΙΓΕΙ ΤΟ MODAL */}
                  <Button 
                    size="small" 
                    variant="contained" 
                    onClick={() => handleOpenDialog(patient)}
                  >
                    Νεο Ραντεβου
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* --- ΤΟ MODAL (DIALOG) --- */}
        <Dialog open={open} onClose={handleCloseDialog}>
          <DialogTitle>Νέο Ραντεβού για: {selectedPatient?.last_name}</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Ημερομηνία"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
            <TextField
              margin="dense"
              label="Ώρα"
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
            />
            <TextField
              margin="dense"
              label="Σημειώσεις"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Ακυρωση</Button>
            <Button onClick={handleSubmit} variant="contained">Αποθηκευση</Button>
          </DialogActions>
        </Dialog>

        {/* Ειδοποίηση επιτυχίας (Snackbar) */}
        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={() => setNotification({ ...notification, open: false })}
        >
          <Alert severity="success" sx={{ width: '100%' }}>
            {notification.message}
          </Alert>
        </Snackbar>

      </Container>
    </div>
  )
}

export default App