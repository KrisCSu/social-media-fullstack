import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
    Container,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Alert,
    Box,
} from "@mui/material";

function Profile() {
    const { userId } = useParams();
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [followed, setFollowed] = useState(false);
    const [followedBy, setFollowedBy] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [newBio, setNewBio] = useState("");

    const currentUser = JSON.parse(sessionStorage.getItem("user")) || {};
    const currentUserId = currentUser.accountId;

    const fetchFollowStatus = useCallback(async () => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get(
                `http://localhost:8080/follows/status?followerId=${currentUserId}&followeeId=${userId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setFollowed(response.data.isFollowing);
            setFollowedBy(response.data.isFollowedBy);
        } catch (err) {
            console.error("Failed to fetch follow status:", err);
            setError("Failed to load follow status.");
        }
    }, [currentUserId, userId]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = sessionStorage.getItem("token");
                const profileResponse = await axios.get(
                    `http://localhost:8080/accounts/${userId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setUsername(profileResponse.data.username);
                setBio(profileResponse.data.bio);

                if (currentUserId !== parseInt(userId)) {
                    await fetchFollowStatus();
                }
                setIsLoading(false);
            } catch (err) {
                console.error("Failed to fetch profile:", err);
                setError("Failed to load profile information.");
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [userId, currentUserId, fetchFollowStatus]);

    const handleFollow = async () => {
        try {
            const token = sessionStorage.getItem("token");
            await axios.post(
                `http://localhost:8080/follows`,
                { followerId: currentUserId, followeeId: userId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setFollowed(true);
            await fetchFollowStatus();
        } catch (err) {
            console.error("Failed to follow user:", err);
            setError("Failed to follow user.");
        }
    };

    const handleUnfollow = async () => {
        try {
            const token = sessionStorage.getItem("token");
            await axios.delete(
                `http://localhost:8080/follows/${currentUserId}/${userId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setFollowed(false);
            await fetchFollowStatus();
        } catch (err) {
            console.error("Failed to unfollow user:", err);
            setError("Failed to unfollow user.");
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.patch(
                `http://localhost:8080/accounts/${currentUserId}`,
                { username: newUsername || username, bio: newBio || bio },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUsername(response.data.username);
            setBio(response.data.bio);
            setIsEditing(false);
        } catch (err) {
            console.error("Failed to update profile:", err);
            setError("Failed to update profile information.");
        }
    };

    if (isLoading) {
        return <Typography align="center">Loading profile...</Typography>;
    }

    return (
        <Container maxWidth="sm" style={{ marginTop: "20px" }}>
            <Card>
                <CardContent>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Profile
                    </Typography>
                    {error && (
                        <Alert severity="error" style={{ marginBottom: "20px" }}>
                            {error}
                        </Alert>
                    )}
                    {isEditing ? (
                        <Box>
                            <TextField
                                label="Update Username"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                placeholder={username}
                            />
                            <TextField
                                label="Update Bio"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={newBio}
                                onChange={(e) => setNewBio(e.target.value)}
                                placeholder={bio}
                                multiline
                                rows={4}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleUpdateProfile}
                                style={{ marginRight: "10px" }}
                            >
                                Save
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </Button>
                        </Box>
                    ) : (
                        <Box>
                            <Typography variant="h6">Username: {username}</Typography>
                            <Typography variant="h6">Bio: {bio}</Typography>
                        </Box>
                    )}
                    {currentUserId === parseInt(userId) ? (
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => setIsEditing(true)}
                            style={{ marginTop: "20px" }}
                        >
                            Edit Profile
                        </Button>
                    ) : (
                        <Box marginTop={2}>
                            {followed && followedBy && (
                                <Typography>You are friends!</Typography>
                            )}
                            <Button
                                variant="contained"
                                color={followed ? "secondary" : "primary"}
                                onClick={followed ? handleUnfollow : handleFollow}
                            >
                                {followed ? "Unfollow" : "Follow"}
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
}

export default Profile;