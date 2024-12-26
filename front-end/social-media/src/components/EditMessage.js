import React, { useState, useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";
import axios from "axios";

function EditMessage({ messageId, onClose }) {
    const [title, setTitle] = useState("");
    const [messageText, setMessageText] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchMessage = async () => {
            const token = sessionStorage.getItem("token");
            try {
                const response = await axios.get(`http://localhost:8080/messages/${messageId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTitle(response.data.title);
                setMessageText(response.data.messageText);
            } catch (err) {
                console.error("Failed to fetch message:", err);
                setError("Failed to load message details.");
            }
        };
        fetchMessage();
    }, [messageId]);

    const handleSnackbarClose = () => {
        setError(null);
        setSuccess(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsSubmitting(true);

        if (title.trim() === "" || messageText.trim() === "") {
            setError("Title and message text cannot be empty.");
            setIsSubmitting(false);
            return;
        }

        const token = sessionStorage.getItem("token");
        try {
            const response = await axios.put(
                `http://localhost:8080/messages/${messageId}`,
                { title, messageText },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.status === 200) {
                setSuccess("Message updated successfully!");
                onClose();
            }
        } catch (err) {
            console.error("Failed to update message:", err);
            if (err.response?.status === 401) {
                setError("Unauthorized. Please log in again.");
            } else if (err.response?.status === 400) {
                setError("Invalid input. Please check your data.");
            } else {
                setError("Failed to update message. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h2>Edit Message</h2>
            <Snackbar open={!!error} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert severity="error" onClose={handleSnackbarClose}>
                    {error}
                </Alert>
            </Snackbar>
            <Snackbar open={!!success} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert severity="success" onClose={handleSnackbarClose}>
                    {success}
                </Alert>
            </Snackbar>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        maxLength={255}
                    />
                </div>
                <div>
                    <label>Message Text:</label>
                    <textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        required
                        maxLength={255}
                    />
                </div>
                <button type="submit" disabled={isSubmitting}>Save Changes</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
}

export default EditMessage;