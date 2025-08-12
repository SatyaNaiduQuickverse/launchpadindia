import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import EnhancedDashboard from './pages/EnhancedDashboard';
import ResumeBuilder from "./pages/ResumeBuilder";
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminResumeDetail from './pages/AdminResumeDetail';
import './App.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user && user.isAdmin ? children : <Navigate to="/admin/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/resume/:id" element={
              <AdminRoute>
                <AdminResumeDetail />
              </AdminRoute>
            } />
            
            {/* Student Routes - NAVBAR REMOVED */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <EnhancedDashboard />
              </ProtectedRoute>
            } />
            <Route path="/resume/:id?" element={
              <ProtectedRoute>
                <ResumeBuilder />
              </ProtectedRoute>
            } />
          </Routes>
          
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
