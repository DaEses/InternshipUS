import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth, ProtectedRoute, PublicRoute } from './contexts/AuthContext';
import { useState, useEffect } from 'react';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile.clean';
import JobTracker from './pages/JobTracker.new';
import JobMatcher from './pages/JobMatcher';
import ResumeScan from './pages/ResumeScan';
import ResumeOptimizer from './pages/ResumeOptimizer';
import Scanner from './pages/Scanner';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import PageNotFound from './pages/PageNotFound';

// Core styles
import './App.css';
import './Home.css';

// Loading screen component
const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Main App Component
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            
            {/* Auth Routes */}
            <Route path="/login" element={
              <PublicRoute>
                <AuthLayout><Login /></AuthLayout>
              </PublicRoute>
            } />
            
            <Route path="/signup" element={
              <PublicRoute>
                <AuthLayout><Signup /></AuthLayout>
              </PublicRoute>
            } />
            
            <Route path="/forgot-password" element={
              <PublicRoute>
                <AuthLayout><ForgotPassword /></AuthLayout>
              </PublicRoute>
            } />
            
            <Route path="/reset-password" element={
              <PublicRoute>
                <AuthLayout><ResetPassword /></AuthLayout>
              </PublicRoute>
            } />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <MainLayout><Dashboard /></MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/tracking" element={
              <ProtectedRoute>
                <MainLayout><JobTracker /></MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/job-matcher" element={
              <ProtectedRoute>
                <MainLayout><JobMatcher /></MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/resume-scan" element={
              <ProtectedRoute>
                <MainLayout><ResumeScan /></MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <MainLayout><Profile /></MainLayout>
              </ProtectedRoute>
            } />
            


            <Route path="/resume-optimizer" element={
              <ProtectedRoute>
                <MainLayout><ResumeOptimizer /></MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/scanner" element={
              <ProtectedRoute>
                <MainLayout><Scanner /></MainLayout>
              </ProtectedRoute>
            } />
            
            {/* 404 Route */}
            <Route path="*" element={
              <MainLayout>
                <PageNotFound />
              </MainLayout>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;