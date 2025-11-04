import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box, CssBaseline, CircularProgress } from '@mui/material';
import { theme } from './theme/theme';
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Lazily loaded route components keep the glow look while trimming the initial bundle
const Home = lazy(() => import('./components/layout/Home'));
const Login = lazy(() => import('./components/auth/Login'));
const Register = lazy(() => import('./components/auth/Register'));
const Profile = lazy(() => import('./components/profile/Profile'));
const UserProfile = lazy(() => import('./components/profile/UserProfile'));
const Teams = lazy(() => import('./components/teams/Teams'));
const CreateTeam = lazy(() => import('./components/teams/CreateTeam'));
const SearchTeams = lazy(() => import('./components/teams/SearchTeams'));
const MyTeam = lazy(() => import('./components/teams/MyTeam'));
const ManageRequests = lazy(() => import('./components/teams/ManageRequests'));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

// Layout wrapper that shows/hides Navbar and Footer based on route
const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Box component="main" sx={{ flexGrow: 1, background: 'transparent' }}>
        {children}
      </Box>
      {!isAuthPage && <Footer />}
    </>
  );
};

const LoadingState = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', background: 'transparent' }}>
    <CircularProgress sx={{ color: '#7f5af0' }} />
  </Box>
);

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'transparent' }}>
            <Layout>
              <Suspense fallback={<LoadingState />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
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
              </Suspense>
            </Layout>
          </Box>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;