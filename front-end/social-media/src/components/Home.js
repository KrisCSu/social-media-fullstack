import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            const token = sessionStorage.getItem("token");
            try {
                const response = await axios.get("http://localhost:8080/messages", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("Fetched messages:", response.data); // Debugging
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
            } catch (err) {
                console.error("Failed to fetch messages:", err);
                setError("Failed to load messages. Please try again later.");
            }
        };

        fetchMessages();
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h1>All Posts</h1>
            {error && (
                <div style={{ backgroundColor: "red", color: "white", padding: "10px", borderRadius: "5px" }}>
                    {error}
                </div>
            )}
            {messages.length > 0 ? (
                <ul style={{ listStyleType: "none", padding: 0 }}>
                    {messages.map((message) => (
                        <li key={message.messageId} style={{ marginBottom: "20px", borderBottom: "1px solid #ccc" }}>
                            <h2>
                                <Link to={`/messages/${message.messageId}`}>{message.title}</Link>
                            </h2>
                            <p>
                                <strong>Posted by:</strong>{" "}
                                <Link to={`/profile/${message.postedBy}`}>{message.username}</Link>
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No messages found.</p>
            )}
        </div>
    );
}

export default Home;