import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext"; // Ensure correct import

function Navbar() {
    const { auth, logout } = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = useState("");  // State to hold the search input
    const navigate = useNavigate(); // Hook to navigate to a different page

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Navigate to the search results page with the query
            navigate(`/search?query=${searchQuery}`);
        }
    };

    return (
        <nav style={styles.navbar}>
            <div style={styles.navLeft}>
                {/* Home button right after the heading */}
                <h2 style={styles.title}>Anti Social Social App</h2>
                {auth.token && (
                    <Link to="/home" style={styles.navLink}>Home</Link>
                )}
            </div>
            <ul style={styles.navList}>
                {auth.token ? (
                    <>
                        {/* Search bar before the "New Post" button */}
                        <li>
                            <form onSubmit={handleSearch} style={styles.searchForm}>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={styles.searchInput}
                                />
                            </form>
                        </li>
                        {/* "New Post" button */}
                        <li>
                            <Link to="/create" style={styles.navLink}>New Post</Link>
                        </li>
                        <li>
                            <Link to={`/profile/${auth.user.accountId}`} style={styles.navLink}>
                                Profile
                            </Link>
                        </li>
                        <li>
                            <button
                                style={{ ...styles.navLink, border: "none", background: "none" }}
                                onClick={logout}
                            >
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to="/login" style={styles.navLink}>Login</Link>
                        </li>
                        <li>
                            <Link to="/register" style={styles.navLink}>Register</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}

const styles = {
    navbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#333",
        color: "#fff",
    },
    navLeft: {
        display: "flex",
        alignItems: "center",
    },
    title: {
        marginRight: "20px",
    },
    navList: {
        listStyle: "none",
        display: "flex",
        gap: "20px",
        margin: 0,
        padding: 0,
        alignItems: "center", // Ensure items are aligned correctly
    },
    navLink: {
        color: "#fff",
        textDecoration: "none",
        fontSize: "16px",
    },
    searchForm: {
        display: "flex",
        alignItems: "center",
    },
    searchInput: {
        padding: "5px",
        fontSize: "14px",
        borderRadius: "4px",
        border: "1px solid #ccc",
    },
};

export default Navbar;