// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TaskForm from './pages/TaskForm';
import Home from './pages/Home'; // New import
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

// ProtectedRoute component with token validation
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    
    try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        if (decodedToken.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            return <Navigate to="/login" replace />;
        }
    } catch (error) {
        localStorage.removeItem('token');
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

// PublicRoute component
const PublicRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('token');
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
};

const App = () => {
    return (
        <Router>
            <div className="app-container">
                <Navbar />
                <main>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} /> {/* Default route is now Home */}
                        <Route
                            path="/login"
                            element={
                                <PublicRoute>
                                    <Login />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/register"
                            element={
                                <PublicRoute>
                                    <Register />
                                </PublicRoute>
                            }
                        />

                        {/* Protected Routes */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/taskform"
                            element={
                                <ProtectedRoute>
                                    <TaskForm />
                                </ProtectedRoute>
                            }
                        />

                        {/* 404 Route */}
                        <Route
                            path="*"
                            element={
                                <div className="not-found">
                                    <h1>404 - Page Not Found</h1>
                                    <p>The page you're looking for doesn't exist.</p>
                                </div>
                            }
                        />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
};

export default App;