import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  Card,
  CardContent,
  Fade,
} from '@mui/material';
import { fetchUserBookings } from '../api';

export default function MyBookings() {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const load = () => {
    setTouched(true);
    setError('');
    if (!email) {
      setError('Please enter an email address.');
      setBookings([]);
      return;
    }
    fetchUserBookings(email)
      .then(res => setBookings(res.data))
      .catch(() => {
        setError('No bookings found or server error.');
        setBookings([]);
      });
  };

  const toLocalString = (utcString) => {
    if (!utcString) return 'Invalid Date';
    const date = new Date(utcString);
    return isNaN(date) ? 'Invalid Date' : date.toLocaleString(undefined, {
      timeZone,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box maxWidth="sm" mx="auto" mt={7}>
      <Card elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={700} mb={2} textAlign="center">
          My Bookings
        </Typography>
        <Stack direction="row" spacing={1} mb={2}>
          <TextField
            label="Email"
            variant="outlined"
            value={email}
            onChange={e => setEmail(e.target.value)}
            size="small"
            fullWidth
            error={!!error && touched}
            onBlur={() => setTouched(true)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={load}
            size="medium"
            sx={{ px: 3, minWidth: 100, fontWeight: 600 }}
          >
            Load
          </Button>
        </Stack>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {bookings.length > 0 && (
          <Stack spacing={2} mt={3}>
            {bookings.map((b, idx) => (
              <Fade in key={b.id} timeout={350 + idx * 70}>
                <Card variant="outlined" sx={{ borderRadius: 2, p: 1.5 }}>
                  <CardContent sx={{ p: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600} color="primary.main">
                      {b.eventTitle ? b.eventTitle : `Event #${b.eventId}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {toLocalString(b.timeUtc)}
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            ))}
          </Stack>
        )}

        {bookings.length === 0 && !error && touched && (
          <Typography color="text.secondary" mt={2} textAlign="center">
            No bookings to display.
          </Typography>
        )}
      </Card>
    </Box>
  );
}
