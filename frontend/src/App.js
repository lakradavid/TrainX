import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PersonalTrainer from './pages/PersonalTrainer';
import Workouts from './pages/Workouts';
import SmartCoach from './pages/SmartCoach';
import Profile from './pages/Profile';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Listen for token changes (e.g., after login)
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Also check on mount and when localStorage changes directly
  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  return (
    <Router>
      <div className="min-vh-100 bg-light">
        <Routes>
          <Route 
            path="/login" 
            element={!token ? <Login /> : <Navigate to="/dashboard" replace />} 
          />
          <Route 
            path="/register" 
            element={!token ? <Register /> : <Navigate to="/dashboard" replace />} 
          />
          <Route 
            path="/dashboard" 
            element={token ? <Dashboard /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/profile" 
            element={token ? <Profile /> : <Navigate to="/login" replace />} 
          />
          <Route path="/trainer" element={token ? <PersonalTrainer /> : <Navigate to="/login" replace />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/smart-coach" element={<SmartCoach />} />
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;