import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
    IconButton,
    Tooltip,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

function MessageDetails() {
    const { messageId } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [liked, setLiked] = useState(false);
    const [error, setError] = useState(null);
    const [usernameMap, setUsernameMap] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedText, setEditedText] = useState("");

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
                setEditedTitle(messageResponse.data.title);
                setEditedText(messageResponse.data.messageText);

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
                await axios.delete(
                    `http://localhost:8080/likes?messageId=${messageId}&likedBy=${user.accountId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setLiked(false);
            } else {
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

    const handleEdit = async () => {
        try {
            const token = sessionStorage.getItem("token");
            await axios.patch(
                `http://localhost:8080/messages/${messageId}`,
                {
                    title: editedTitle,
                    messageText: editedText,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage({ ...message, title: editedTitle, messageText: editedText });
            setIsEditing(false);
        } catch (err) {
            console.error("Failed to edit message:", err);
            setError("Failed to edit message.");
        }
    };

    const handleDelete = async () => {
        try {
            const token = sessionStorage.getItem("token");
            await axios.delete(
                `http://localhost:8080/messages/${messageId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate("/home");
        } catch (err) {
            console.error("Failed to delete message:", err);
            setError("Failed to delete message.");
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
                        {isEditing ? (
                            <>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Title"
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                    style={{ marginBottom: "10px" }}
                                />
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Content"
                                    multiline
                                    rows={4}
                                    value={editedText}
                                    onChange={(e) => setEditedText(e.target.value)}
                                    style={{ marginBottom: "10px" }}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleEdit}
                                    style={{ marginRight: "10px" }}
                                >
                                    Save
                                </Button>
                                <Button variant="contained" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <>
                                <Typography variant="h5" gutterBottom>
                                    {message.title}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {message.messageText}
                                </Typography>
                                
                                <Box display="flex" alignItems="center" marginBottom={2}>
                                    <Avatar>
                                        {usernameMap[message.postedBy]?.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        marginLeft={1}
                                    >
                                        Initially Posted by: {usernameMap[message.postedBy] || "Unknown User"} at{" "}
                                        {new Date(message.timePostedEpoch).toLocaleString()}
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" gap="10px">
                                    <IconButton onClick={handleLike}>
                                        <Tooltip title={liked ? "Unlike" : "Like"}>
                                            {liked ? (
                                                <FavoriteIcon style={{ color: "red" }} />
                                            ) : (
                                                <FavoriteBorderIcon style={{ color: "gray" }} />
                                            )}
                                        </Tooltip>
                                    </IconButton>
                                </Box>

                                {user.accountId === message.postedBy && (
                                    <>
                                        <Button
                                            variant="contained"
                                            onClick={() => setIsEditing(true)}
                                            style={{ marginRight: "10px" }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={handleDelete}
                                        >
                                            Delete
                                        </Button>
                                    </>
                                )}
                            </>
                        )}
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