import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Alert,
} from '@mui/material';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post('http://localhost:8080/login', {
                username,
                password,
            });
            console.log('Login Response:', response);

            if (response.status === 200) {
                const { token, accountId } = response.data;
                login(token, { accountId });
                navigate('/home');
            }
        } catch (err) {
            console.error('Login failed:', err);
            setError('Login failed. Invalid username or password.');
        }
    };

    return (
        <Container maxWidth="xs" style={{ marginTop: '100px' }}>
            <Box
                component="form"
                onSubmit={handleLogin}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    padding: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Login
                </Typography>
                <TextField
                    fullWidth
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <Alert severity="error">{error}</Alert>}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                >
                    Login
                </Button>
                <Typography variant="body2" color="text.secondary">
                    Don't have an account? <a href="/register">Register</a>
                </Typography>
            </Box>
        </Container>
    );
}

export default Login;