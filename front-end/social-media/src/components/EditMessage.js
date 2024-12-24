import React, { useState, useEffect } from "react";
import axios from "axios";

function EditMessage({ messageId, onClose }) {
    const [title, setTitle] = useState("");
    const [messageText, setMessageText] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

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
            setError("Failed to update message.");
        }
    };

    return (
        <div>
            <h2>Edit Message</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
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
                <button type="submit">Save Changes</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
}

export default EditMessage;