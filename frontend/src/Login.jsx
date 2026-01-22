import { useState } from 'react';
import axios from 'axios';
import { Container, Card, CardContent, Typography, TextField, Button, Box, Alert } from '@mui/material';

// onLoginSuccess: Είναι μια συνάρτηση που θα καλέσουμε όταν πετύχει το login 
// για να ενημερώσουμε το App.jsx
function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Στέλνουμε τα στοιχεία στο Django
            const response = await axios.post('http://127.0.0.1:8000/api/token/', {
                username: username,
                password: password
            });

            // Αν πετύχει, το Django μας δίνει ένα "access" token
            const token = response.data.access;
            
            // Το αποθηκεύουμε στο localStorage (μνήμη του browser)
            localStorage.setItem('token', token);

            // Ειδοποιούμε το App.jsx ότι μπήκαμε
            onLoginSuccess(token);

        } catch (err) {
            console.error(err);
            setError('Λάθος όνομα χρήστη ή κωδικός.');
        }
    };

    return (
        <Container maxWidth="xs" sx={{ marginTop: 10 }}>
            <Card sx={{ padding: 2, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h5" component="div" sx={{ marginBottom: 2, textAlign: 'center' }}>
                        Είσοδος στο Therapy CRM
                    </Typography>

                    {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Username"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        
                        <Box sx={{ marginTop: 2 }}>
                            <Button type="submit" variant="contained" color="primary" fullWidth size="large">
                                Συνδεση
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
}

export default Login;