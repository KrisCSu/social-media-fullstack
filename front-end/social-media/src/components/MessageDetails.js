import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function MessageDetails() {
    const { messageId } = useParams();
    const [message, setMessage] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [error, setError] = useState(null);

    const user = JSON.parse(sessionStorage.getItem("user"));

    useEffect(() => {
        const fetchMessage = async () => {
            try {
                const token = sessionStorage.getItem("token");

                // Fetch message
                const messageResponse = await axios.get(
                    `http://localhost:8080/messages/${messageId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setMessage(messageResponse.data);

                // Fetch comments
                const commentsResponse = await axios.get(
                    `http://localhost:8080/messages/${messageId}/comments`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setComments(commentsResponse.data);

            } catch (err) {
                console.error("Failed to fetch message or comments:", err);
                setError("Failed to load message details.");
            }
        };

        fetchMessage();
    }, [messageId]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.post(
                `http://localhost:8080/comments`,
                {
                    messageId,
                    commentText: newComment,
                    postedBy: user.accountId,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setComments([...comments, response.data]);
            setNewComment("");
        } catch (err) {
            console.error("Failed to post comment:", err);
            setError("Failed to post comment.");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {message ? (
                <>
                    <h1>{message.title}</h1>
                    <p>{message.messageText}</p>
                    <p>
                        <strong>Posted by:</strong> {message.postedBy}
                    </p>

                    <h2>Comments</h2>
                    <ul>
                        {comments.map((comment) => (
                            <li key={comment.commentId}>
                                <p>{comment.commentText}</p>
                                <p>
                                    <strong>By:</strong> {comment.postedBy}
                                    <br />
                                    <strong>Commented at:</strong>{" "}
                                    {new Date(comment.timePostedEpoch * 1000).toLocaleString()}
                                </p>
                            </li>
                        ))}
                    </ul>

                    <form onSubmit={handleCommentSubmit}>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            rows="4"
                            style={{ width: "100%", marginBottom: "10px" }}
                        ></textarea>
                        <button type="submit">Submit</button>
                    </form>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default MessageDetails;