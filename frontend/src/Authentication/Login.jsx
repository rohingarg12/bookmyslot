// src/Authentication/Login.jsx
import React, { useState } from 'react';
import {
  Box, Button, TextField,
  Typography, Link, Alert
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { login }    from '../api.jsx';
import { useAuth }  from '../context/AuthContext.jsx';

export default function Login() {
  const [creds, setCreds] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login: loginCtx } = useAuth();
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) =>
    setCreds(c => ({ ...c, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!creds.email || !creds.password)
      return setError('Please fill in both fields.');

    try {
      const { data } = await login(creds);
      localStorage.setItem('token', data.access_token);

      // Save the email as well
      // Prefer: from response (if your backend returns email), otherwise use creds
      localStorage.setItem('email', data.email || creds.email);

      // Optionally update context
      loginCtx({ email: data.email || creds.email });

      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials');
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={8} p={4} boxShadow={3} borderRadius={2}>
      <Typography variant="h5" gutterBottom>Log In</Typography>
      {error && <Alert severity="error" sx={{ mb:2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit} noValidate>
        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth required margin="normal"
          value={creds.email}
          onChange={handleChange}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth required margin="normal"
          value={creds.password}
          onChange={handleChange}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt:3 }}>
          Log In
        </Button>
      </form>

      <Typography variant="body2" align="center" sx={{ mt:2 }}>
        Don’t have an account?{' '}
        <Link component={RouterLink} to="/signup">Sign up</Link>
      </Typography>
    </Box>
  );
}
