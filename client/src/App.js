import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Profile Components
import Profile from './components/profile/Profile';
import UserProfile from './components/profile/UserProfile';

// Team Components
import Teams from './components/teams/Teams';
import CreateTeam from './components/teams/CreateTeam';
import SearchTeams from './components/teams/SearchTeams';
import MyTeam from './components/teams/MyTeam';
import ManageRequests from './components/teams/ManageRequests';

import { AuthProvider, useAuth } from './contexts/AuthContext';

// RTL theme configuration
const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/profile/:userId" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                
                {/* Team Routes */}
                <Route path="/teams" element={<ProtectedRoute><Teams /></ProtectedRoute>} />
                <Route path="/teams/create" element={<ProtectedRoute><CreateTeam /></ProtectedRoute>} />
                <Route path="/teams/search" element={<ProtectedRoute><SearchTeams /></ProtectedRoute>} />
                <Route path="/teams/my-team" element={<ProtectedRoute><MyTeam /></ProtectedRoute>} />
                <Route path="/teams/requests" element={<ProtectedRoute><ManageRequests /></ProtectedRoute>} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;