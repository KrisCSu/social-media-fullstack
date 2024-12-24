import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
    Container,
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    Avatar,
    Alert,
    CircularProgress,
} from "@mui/material";

function Home() {
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMessages = async () => {
            const token = sessionStorage.getItem("token");
            try {
                const response = await axios.get("http://localhost:8080/messages", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const messagesWithUsernames = await Promise.all(
                    response.data.map(async (message) => {
                        const userResponse = await axios.get(
                            `http://localhost:8080/accounts/${message.postedBy}`,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        return { ...message, username: userResponse.data.username };
                    })
                );

                setMessages(messagesWithUsernames);
                setLoading(false);
            } catch (err) {
                setError("Failed to load messages. Please try again later.");
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    return (
        <Container maxWidth="md" style={{ marginTop: "20px" }}>
            <Typography variant="h4" gutterBottom textAlign="center">
                All Posts
            </Typography>
            {error && (
                <Alert severity="error" style={{ marginBottom: "20px" }}>
                    {error}
                </Alert>
            )}
            {loading ? (
                <Box textAlign="center" mt={4}>
                    <CircularProgress />
                </Box>
            ) : messages.length > 0 ? (
                <Grid container spacing={3}>
                    {messages.map((message) => (
                        <Grid item xs={12} key={message.messageId}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        <Link
                                            to={`/messages/${message.messageId}`}
                                            style={{ textDecoration: "none", color: "inherit" }}
                                        >
                                            {message.title}
                                        </Link>
                                    </Typography>
                                    <Box display="flex" alignItems="center">
                                        <Avatar alt={message.username} sx={{ marginRight: 2 }}>
                                            {message.username.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Typography variant="body2" color="textSecondary">
                                            Posted by{" "}
                                            <Link
                                                to={`/profile/${message.postedBy}`}
                                                style={{ textDecoration: "none", color: "blue" }}
                                            >
                                                {message.username}
                                            </Link>
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="body1" textAlign="center" color="textSecondary">
                    No messages found.
                </Typography>
            )}
        </Container>
    );
}

export default Home;