import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { signup } from '../api'; // assumes your api.js exports signup

export default function Signup() {
  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    if (!form.email || !form.password || !form.confirm)
      return setError('All fields are required.');
    if (form.password !== form.confirm)
      return setError("Passwords don't match.");

    try {
      const response = await signup({
        email: form.email,
        password: form.password
      });
      // Log the HTTP status code in the console:
      console.log('Signup status:', response.status); // <-- 200 if success

      setSuccess(response.data.msg || "Signup successful!");
      setForm({ email: '', password: '', confirm: '' });
    } catch (err) {
      // If error, log status as well (may be 400/409/500)
      console.log('Signup error status:', err.response?.status);
      setError(
        err.response?.data?.detail || "Signup failed. Try again."
      );
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={8} p={4} boxShadow={3} borderRadius={2}>
      <Typography variant="h5" gutterBottom>Sign Up</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <form onSubmit={handleSubmit} noValidate>
        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth required margin="normal"
          value={form.email}
          onChange={handleChange}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth required margin="normal"
          value={form.password}
          onChange={handleChange}
        />
        <TextField
          label="Confirm Password"
          name="confirm"
          type="password"
          fullWidth required margin="normal"
          value={form.confirm}
          onChange={handleChange}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
          Create Account
        </Button>
      </form>
    </Box>
  );
}
