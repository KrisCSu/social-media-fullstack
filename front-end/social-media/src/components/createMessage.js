import React, { useState } from 'react';
import axios from 'axios';

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
                    timePostedEpoch
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
        <div style={{ padding: '20px' }}>
            <h1>Create a New Post</h1>
            <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Message:</label>
                    <textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        required
                        rows="4"
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    ></textarea>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                <button
                    type="submit"
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007BFF',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

export default CreateMessage;