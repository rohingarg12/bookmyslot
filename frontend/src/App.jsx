// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link as RouterLink } from 'react-router-dom';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box
} from '@mui/material';

import Home         from './pages/Home.jsx';
import EventDetails from './pages/EventDetails.jsx';
import CreateEvent  from './pages/CreateEvent.jsx';
import MyBookings   from './pages/MyBookings.jsx';
import Success      from './pages/Success.jsx';
import ErrorPage    from './pages/ErrorPage.jsx';
import Login        from './Authentication/Login.jsx';
import Signup       from './Authentication/Signup.jsx';

import ProtectedRoute from './ProtectedRoute.jsx';
import { useAuth }    from './context/AuthContext.jsx';

const theme = createTheme({
  palette: {
    primary:   { main: '#1976d2' },
    background:{ default: '#f5f5f5' },
  },
});

export default function App() {
  const { user, logout } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        {/* Top AppBar */}
        <AppBar position="static" color="primary" elevation={1}>
          <Toolbar>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{ color: 'inherit', textDecoration: 'none', flexGrow: 1, fontWeight: 600 }}
            >
              BookMySlot
            </Typography>

            <Button
              color="inherit"
              component={RouterLink}
              to="/"
              sx={{ fontWeight: 500 }}
            >
              Events
            </Button>

            {user ? (
              <>
                <Button color="inherit" component={RouterLink} to="/create">Create Event</Button>
                <Button color="inherit" component={RouterLink} to="/bookings">My Bookings</Button>
                <Button color="inherit" onClick={logout}>Log Out</Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={RouterLink} to="/login">Log In</Button>
                <Button color="inherit" component={RouterLink} to="/signup">Sign Up</Button>
              </>
            )}
          </Toolbar>
        </AppBar>

        {/* Main content area */}
        <Box component="main" sx={{ p: { xs: 1, sm: 3 }, background: theme.palette.background.default, minHeight: '100vh' }}>
          <Routes>
            <Route path="/"            element={<Home />} />
            <Route path="/signup"      element={<Signup />} />
            <Route path="/login"       element={<Login />} />
            <Route path="/events/:id"  element={<EventDetails />} />
            <Route path="/success"     element={<Success />} />
            <Route path="/error"       element={<ErrorPage />} />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreateEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}
