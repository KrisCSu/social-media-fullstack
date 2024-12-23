import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
    Container,
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    TextField,
    Button,
    CircularProgress,
    Alert,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from "@mui/material";

function MessageDetails() {
    const { messageId } = useParams();
    const [message, setMessage] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [liked, setLiked] = useState(false);
    const [error, setError] = useState(null);
    const [usernameMap, setUsernameMap] = useState({});

    const user = JSON.parse(sessionStorage.getItem("user"));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem("token");

                // Fetch message
                const messageResponse = await axios.get(
                    `http://localhost:8080/messages/${messageId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setMessage(messageResponse.data);

                // Fetch comments
                const commentsResponse = await axios.get(
                    `http://localhost:8080/messages/${messageId}/comments`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setComments(commentsResponse.data);

                // Check if user liked the message
                const likeStatusResponse = await axios.get(
                    `http://localhost:8080/likes/${messageId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const userLiked = likeStatusResponse.data.some(
                    (like) => like.likedBy === user.accountId
                );
                setLiked(userLiked);

                // Fetch usernames
                const userIds = [
                    messageResponse.data.postedBy,
                    ...commentsResponse.data.map((comment) => comment.postedBy),
                ];
                const uniqueUserIds = [...new Set(userIds)];
                const userMap = {};
                const userFetches = uniqueUserIds.map(async (id) => {
                    try {
                        const userResponse = await axios.get(
                            `http://localhost:8080/accounts/${id}`,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        userMap[id] = userResponse.data.username;
                    } catch (err) {
                        console.error(`Failed to fetch username for user ID ${id}:`, err);
                    }
                });
                await Promise.all(userFetches);
                setUsernameMap(userMap);
            } catch (err) {
                console.error("Failed to fetch message details:", err);
                setError("Failed to load message details.");
            }
        };

        fetchData();
    }, [messageId, user.accountId]);

    const handleLike = async () => {
        try {
            const token = sessionStorage.getItem("token");
            if (liked) {
                // Unlike the message
                await axios.delete(
                    `http://localhost:8080/likes?messageId=${messageId}&likedBy=${user.accountId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setLiked(false);
            } else {
                // Like the message
                await axios.post(
                    `http://localhost:8080/likes`,
                    { messageId, likedBy: user.accountId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setLiked(true);
            }
        } catch (err) {
            console.error("Failed to toggle like:", err);
            setError("Failed to update like status.");
        }
    };

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
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setComments([...comments, response.data]);
            setNewComment("");
        } catch (err) {
            console.error("Failed to post comment:", err);
            setError("Failed to post comment.");
        }
    };

    return (
        <Container maxWidth="md" style={{ marginTop: "20px" }}>
            {error && (
                <Alert severity="error" style={{ marginBottom: "20px" }}>
                    {error}
                </Alert>
            )}
            {message ? (
                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            {message.title}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {message.messageText}
                        </Typography>
                        <Box display="flex" alignItems="center" marginBottom={2}>
                            <Avatar>{usernameMap[message.postedBy]?.charAt(0).toUpperCase()}</Avatar>
                            <Typography variant="body2" color="textSecondary" marginLeft={1}>
                                Posted by:{" "}
                                {usernameMap[message.postedBy] || "Unknown User"}
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            color={liked ? "secondary" : "primary"}
                            onClick={handleLike}
                        >
                            {liked ? "Liked" : "Like"}
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Box textAlign="center">
                    <CircularProgress />
                </Box>
            )}

            <Typography variant="h6" style={{ marginTop: "20px" }}>
                Comments
            </Typography>
            <Divider />
            <List>
                {comments.map((comment) => (
                    <ListItem alignItems="flex-start" key={comment.commentId}>
                        <ListItemAvatar>
                            <Avatar>
                                {usernameMap[comment.postedBy]?.charAt(0).toUpperCase()}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={comment.commentText}
                            secondary={
                                <>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                    >
                                        By: {usernameMap[comment.postedBy] || "Unknown User"}{" "}
                                        at{" "}
                                        {new Date(
                                            comment.timePostedEpoch * 1000
                                        ).toLocaleString()}
                                    </Typography>
                                </>
                            }
                        />
                    </ListItem>
                ))}
            </List>

            <form onSubmit={handleCommentSubmit} style={{ marginTop: "20px" }}>
                <TextField
                    label="Add a comment"
                    multiline
                    rows={4}
                    fullWidth
                    variant="outlined"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    style={{ marginBottom: "10px" }}
                />
                <Button type="submit" variant="contained" color="primary">
                    Submit
                </Button>
            </form>
        </Container>
    );
}

export default MessageDetails;