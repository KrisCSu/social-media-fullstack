import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import {
    Container,
    Typography,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Divider,
    Alert,
} from "@mui/material";

function SearchResults() {
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);

    const location = useLocation();
    const query = new URLSearchParams(location.search).get("query");

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const token = sessionStorage.getItem("token");
                const response = await axios.get(
                    `http://localhost:8080/search?query=${query}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setResults(response.data);
            } catch (err) {
                console.error("Failed to fetch search results:", err);
                setError("Failed to load search results.");
            }
        };

        fetchSearchResults();
    }, [query]);

    // Group messages and users separately
    const messages = results.filter((result) => result.title);
    const users = results.filter((result) => result.username);

    return (
        <Container maxWidth="md" style={{ marginTop: "20px" }}>
            {error && <Alert severity="error">{error}</Alert>}
            <Typography variant="h4" gutterBottom>
                Search Results for: "{query}"
            </Typography>

            {/* Display posts */}
            {messages.length > 0 && (
                <Card style={{ marginBottom: "20px" }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Posts
                        </Typography>
                        <List>
                            {messages.map((result, index) => (
                                <div key={index}>
                                    <ListItem
                                        component={Link}
                                        to={`/messages/${result.messageId}`}
                                        style={{ textDecoration: "none", color: "inherit" }}
                                    >
                                        <ListItemText
                                            primary={result.title}
                                        />
                                    </ListItem>
                                    {index < messages.length - 1 && <Divider />}
                                </div>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            )}

            {/* Display users */}
            {users.length > 0 && (
                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Users
                        </Typography>
                        <List>
                            {users.map((result, index) => (
                                <div key={index}>
                                    <ListItem
                                        component={Link}
                                        to={`/profile/${result.accountId}`}
                                        style={{ textDecoration: "none", color: "inherit" }}
                                    >
                                        <ListItemText
                                            primary={result.username}
                                        />
                                    </ListItem>
                                    {index < users.length - 1 && <Divider />}
                                </div>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            )}

            {/* If no results found */}
            {messages.length === 0 && users.length === 0 && (
                <Typography variant="body1" color="textSecondary">
                    No results found.
                </Typography>
            )}
        </Container>
    );
}

export default SearchResults;