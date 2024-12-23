import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

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
    const messages = results.filter(result => result.title);
    const users = results.filter(result => result.username);

    return (
        <div style={{ padding: "20px" }}>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <h2>Search Results for: "{query}"</h2>
            
            {/* Display posts */}
            {messages.length > 0 && (
                <div>
                    <h3>Posts</h3>
                    {messages.map((result, index) => (
                        <Link 
                            key={index} 
                            to={`/messages/${result.messageId}`} 
                            style={{ display: "block", margin: "10px 0" }}
                        >
                            <h4>{result.title}</h4>
                        </Link>
                    ))}
                </div>
            )}

            {/* Display users */}
            {users.length > 0 && (
                <div>
                    <h3>Users</h3>
                    {users.map((result, index) => (
                        <Link 
                            key={index} 
                            to={`/profile/${result.accountId}`} 
                            style={{ display: "block", margin: "10px 0" }}
                        >
                            <h4>{result.username}</h4>
                        </Link>
                    ))}
                </div>
            )}

            {/* If no results found */}
            {messages.length === 0 && users.length === 0 && (
                <p>No results found</p>
            )}
        </div>
    );
}

export default SearchResults;