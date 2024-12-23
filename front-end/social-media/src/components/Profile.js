import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Profile() {
    const { userId } = useParams(); // 从 URL 获取用户 ID
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [followed, setFollowed] = useState(false);
    const [followTime, setFollowTime] = useState(null); // 当前用户关注目标用户的时间
    const [followedBy, setFollowedBy] = useState(false);
    const [followedByTime, setFollowedByTime] = useState(null); // 目标用户关注当前用户的时间
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [isEditing, setIsEditing] = useState(false); // 编辑模式状态
    const [newUsername, setNewUsername] = useState("");
    const [newBio, setNewBio] = useState("");

    const currentUser = JSON.parse(sessionStorage.getItem("user")) || {};
    const currentUserId = currentUser.accountId;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = sessionStorage.getItem("token");

                // 获取用户资料
                const profileResponse = await axios.get(
                    `http://localhost:8080/accounts/${userId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setUsername(profileResponse.data.username);
                setBio(profileResponse.data.bio);

                // 获取当前用户是否关注目标用户
                if (currentUserId !== parseInt(userId)) {
                    const followCheckResponse = await axios.get(
                        `http://localhost:8080/follows/${currentUserId}/${userId}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    if (followCheckResponse.data) {
                        setFollowed(true);
                        const followTimeEpoch = followCheckResponse.data.followTimeEpoch;
                        // 确保时间戳转为日期格式
                        setFollowTime(followTimeEpoch ? new Date(followTimeEpoch * 1000) : null);
                    }

                    // 获取目标用户是否关注当前用户
                    const followedByCheckResponse = await axios.get(
                        `http://localhost:8080/follows/${userId}/${currentUserId}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    if (followedByCheckResponse.data) {
                        setFollowedBy(true);
                        const followedByTimeEpoch = followedByCheckResponse.data.followTimeEpoch;
                        setFollowedByTime(
                            followedByTimeEpoch ? new Date(followedByTimeEpoch * 1000) : null
                        );
                    }
                }

                setIsLoading(false);
            } catch (err) {
                console.error("Failed to fetch profile:", err);
                setError("Failed to load profile information.");
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [userId, currentUserId]);

    const handleFollow = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.post(
                `http://localhost:8080/follows`,
                { followerId: currentUserId, followeeId: userId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setFollowed(true);
            setFollowTime(new Date(response.data.followTimeEpoch * 1000)); // 更新关注时间
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
            setFollowTime(null); // 清除时间
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
        return <p>Loading profile...</p>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>Profile</h1>
            {isEditing ? (
                <div>
                    <p>
                        <strong>Update Username:</strong>
                        <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            placeholder={username}
                        />
                    </p>
                    <p>
                        <strong>Update Bio:</strong>
                        <textarea
                            value={newBio}
                            onChange={(e) => setNewBio(e.target.value)}
                            placeholder={bio}
                        />
                    </p>
                    <button onClick={handleUpdateProfile}>Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            ) : (
                <>
                    <p>
                        <strong>Username:</strong> {username}
                    </p>
                    <p>
                        <strong>Bio:</strong> {bio}
                    </p>
                </>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {currentUserId === parseInt(userId) ? (
                <button onClick={() => setIsEditing(true)}>Edit Profile</button>
            ) : (
                <div>
                    {followed && (
                        <p>
                            You followed {username} since{" "}
                            {followTime ? followTime.toLocaleString() : "an unknown time"}.
                        </p>
                    )}
                    {followedBy && (
                        <p>
                            {username} followed you since{" "}
                            {followedByTime ? followedByTime.toLocaleString() : "an unknown time"}.
                        </p>
                    )}
                    {followed && followedBy && <p>You are friends!</p>}
                    {followed ? (
                        <button onClick={handleUnfollow}>Unfollow</button>
                    ) : (
                        <button onClick={handleFollow}>Follow</button>
                    )}
                </div>
            )}
        </div>
    );
}

export default Profile;