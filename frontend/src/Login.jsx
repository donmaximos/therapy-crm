import { useState } from 'react';
import axios from 'axios';
import { 
  Container, Card, CardContent, Typography, TextField, Button, 
  Box, Alert, InputAdornment, Paper 
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/token/', {
                username: username,
                password: password
            });
            const token = response.data.access;
            localStorage.setItem('token', token);
            onLoginSuccess(token);
        } catch (err) {
            console.error(err);
            setError('Λάθος όνομα χρήστη ή κωδικός.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ 
            height: '100vh', 
            width: '100vw',
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)', // Επαγγελματικό Μπλε Gradient
        }}>
            <Paper elevation={10} sx={{ 
                padding: 4, 
                borderRadius: 4, 
                maxWidth: 400, 
                width: '100%',
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.95)' // Ελαφρώς διαφανές λευκό
            }}>
                <Box sx={{ 
                    backgroundColor: '#e3f2fd', 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    margin: '0 auto',
                    mb: 2
                }}>
                    <MedicalServicesIcon color="primary" sx={{ fontSize: 35 }} />
                </Box>
                
                <Typography variant="h5" component="h1" fontWeight="bold" color="primary" gutterBottom>
                    Therapy CRM
                </Typography>
                
                <Typography variant="body2" color="text.secondary" mb={3}>
                    Σύστημα Διαχείρισης Ασθενών
                </Typography>

                {error && <Alert severity="error" sx={{ marginBottom: 2, borderRadius: 2 }}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Όνομα Χρήστη"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonOutlineIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="Κωδικός Πρόσβασης"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockOutlinedIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    
                    <Button 
                        type="submit" 
                        variant="contained" 
                        fullWidth 
                        size="large" 
                        disabled={loading}
                        sx={{ 
                            marginTop: 3, 
                            marginBottom: 2, 
                            padding: 1.5,
                            borderRadius: 2,
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            textTransform: 'none'
                        }}
                    >
                        {loading ? 'Σύνδεση...' : 'Είσοδος'}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
}

export default Login;