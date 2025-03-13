// Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const isAuthenticated = !!localStorage.getItem('token');
    const username = localStorage.getItem('username') || 'User';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/');
        setIsMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">
                    <img className="logo" src="/logo2.png" alt="Logo" />
                </Link>
            </div>
            
            {/* Hamburger Button */}
            <button 
                className="hamburger-btn" 
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
            >
                <span className={`hamburger-icon ${isMobileMenuOpen ? 'open' : ''}`}></span>
            </button>

            {/* Navigation Links */}
            <ul className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
                {isAuthenticated ? (
                    <>
                        <li>
                            <Link 
                                to="/dashboard" 
                                className="nav-link" 
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <span className="username">
                                {username.charAt(0).toUpperCase() + username.slice(1)}
                            </span>
                        </li>
                        <li>
                            <button 
                                onClick={handleLogout} 
                                className="nav-button logout-btn"
                            >
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link 
                                to="/login" 
                                className="nav-link" 
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/register" 
                                className="nav-link" 
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Register
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;