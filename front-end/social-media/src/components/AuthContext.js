import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [auth, setAuth] = useState(() => {
        const token = sessionStorage.getItem("token");
        const user = sessionStorage.getItem("user");
        return { token, user: JSON.parse(user) };
    });

    const login = (token, user) => {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));
        setAuth({ token, user });
    };

    const logout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        setAuth({ token: null, user: null });
        navigate("/login")
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};