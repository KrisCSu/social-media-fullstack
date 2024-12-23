import React, { useState } from 'react';
import axios from 'axios';
import {
    Container,
    TextField,
    Typography,
    Button,
    Alert,
    Box,
    Card,
    CardContent,
} from '@mui/material';

function CreateMessage() {
    const [title, setTitle] = useState('');
    const [messageText, setMessageText] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const token = sessionStorage.getItem('token');
        const user = JSON.parse(sessionStorage.getItem('user'));
        const postedBy = user?.accountId;

        try {
            const timePostedEpoch = Date.now();

            const response = await axios.post(
                'http://localhost:8080/messages',
                {
                    postedBy,
                    title,
                    messageText,
                    timePostedEpoch,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                setSuccess('Message created successfully!');
                setTitle('');
                setMessageText('');
            }
        } catch (err) {
            console.error('Failed to create message:', err);
            setError('Failed to create message. Please try again.');
        }
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '20px' }}>
            <Card>
                <CardContent>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Create a New Post
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Box marginBottom={2}>
                            <TextField
                                label="Title"
                                variant="outlined"
                                fullWidth
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Box>
                        <Box marginBottom={2}>
                            <TextField
                                label="Content"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={4}
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                required
                            />
                        </Box>
                        {error && (
                            <Alert severity="error" style={{ marginBottom: '20px' }}>
                                {error}
                            </Alert>
                        )}
                        {success && (
                            <Alert severity="success" style={{ marginBottom: '20px' }}>
                                {success}
                            </Alert>
                        )}
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Submit
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
}

export default CreateMessage;