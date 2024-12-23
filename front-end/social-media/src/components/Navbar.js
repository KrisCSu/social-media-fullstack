import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext"; // Ensure correct import
import { AppBar, Toolbar, Typography, IconButton, InputBase, Box } from "@mui/material";
import { Search as SearchIcon, Home as HomeIcon, PostAdd as PostAddIcon, AccountCircle, Logout } from "@mui/icons-material";

function Navbar() {
    const { auth, logout } = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?query=${searchQuery}`);
        }
    };

    return (
        <AppBar position="static" color="primary">
            <Toolbar style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box style={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h6" component="div" style={{ marginRight: "20px" }}>
                        Commune
                    </Typography>
                    {auth.token && (
                        <IconButton color="inherit" component={Link} to="/home">
                            <HomeIcon />
                        </IconButton>
                    )}
                </Box>

                {auth.token && (
                    <Box
                        component="form"
                        onSubmit={handleSearch}
                        style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}
                    >
                        <InputBase
                            placeholder="Search…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                backgroundColor: "white",
                                padding: "5px 10px",
                                borderRadius: "5px",
                                width: "60%",
                            }}
                        />
                        <IconButton type="submit" color="inherit">
                            <SearchIcon />
                        </IconButton>
                    </Box>
                )}

                {auth.token && (
                    <Box style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <IconButton color="inherit" component={Link} to="/create">
                            <PostAddIcon />
                        </IconButton>
                        <IconButton color="inherit" component={Link} to={`/profile/${auth.user.accountId}`}>
                            <AccountCircle />
                        </IconButton>
                        <IconButton color="inherit" onClick={logout}>
                            <Logout />
                        </IconButton>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;