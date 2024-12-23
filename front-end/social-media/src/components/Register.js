import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    TextField,
    Button,
    Typography,
    Container,
    Box,
    Card,
    CardContent,
    CardActions,
    Alert,
    Grid,
} from "@mui/material";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [bio, setBio] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/register", {
                username,
                password,
                bio,
            });

            if (response.status === 200) {
                setSuccess("Registration successful! Redirecting to login...");
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }
        } catch (err) {
            console.error("Registration failed:", err);
            setError("Registration failed. Username might already be taken.");
        }
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: "50px" }}>
            <Card>
                <CardContent>
                    <Box textAlign="center" marginBottom={2}>
                        <Typography variant="h5">Register</Typography>
                    </Box>
                    <form onSubmit={handleRegister}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Username"
                                    variant="outlined"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    variant="outlined"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    helperText="Password must be at least 8 characters long"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Bio"
                                    variant="outlined"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Tell us about yourself"
                                />
                            </Grid>
                            {error && (
                                <Grid item xs={12}>
                                    <Alert severity="error">{error}</Alert>
                                </Grid>
                            )}
                            {success && (
                                <Grid item xs={12}>
                                    <Alert severity="success">{success}</Alert>
                                </Grid>
                            )}
                        </Grid>
                    </form>
                </CardContent>
                <CardActions>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleRegister}
                    >
                        Register
                    </Button>
                </CardActions>
            </Card>
        </Container>
    );
}

export default Register;