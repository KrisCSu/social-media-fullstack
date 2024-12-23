import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [bio, setBio] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/register", {
                username,
                password,
                bio,
            });

            if (response.status === 200) {
                setSuccess("Registration successful! Redirecting to login...");
                setTimeout(() => {
                    navigate("/login");
                }, 2000); // 2秒后跳转到登录页面
            }
        } catch (err) {
            console.error("Registration failed:", err);
            setError("Registration failed. Username might already be taken.");
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Register</h1>
            <form onSubmit={handleRegister} style={{ display: "inline-block", textAlign: "left" }}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <br />
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <br />
                <div>
                    <label>Bio:</label>
                    <input
                        type="text"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself"
                    />
                </div>
                <br />
                {error && <p style={{ color: "red" }}>{error}</p>}
                {success && <p style={{ color: "green" }}>{success}</p>}
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;