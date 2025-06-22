import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEvent, bookSlot } from '../api';
import {
  Card, CardContent, Typography, TextField,
  Button, Box, Alert, Stack, Radio, RadioGroup, FormControlLabel
} from '@mui/material';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [slotId, setSlotId] = useState(null);
  const [form, setForm] = useState({ name: '', email: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    fetchEvent(id).then(res => setEvent(res.data));
  }, [id]);

  const toLocalString = (utcString) => {
    const date = new Date(utcString);
    return date.toLocaleString(undefined, {
      timeZone,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await bookSlot(event.id, { slotId, ...form });
      fetchEvent(id).then(res => setEvent(res.data));
      navigate('/success');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Booking failed. Try again.');
      }
    }
    setLoading(false);
  };

  if (!event) return (
    <Box mt={6} display="flex" justifyContent="center">
      <Typography variant="h6">Loading event details...</Typography>
    </Box>
  );

  return (
    <Box maxWidth={500} mx="auto" mt={6}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {event.title}
          </Typography>
          <Typography color="text.secondary" mb={2}>
            {event.description || 'No description provided.'}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Available Slots
          </Typography>
          <RadioGroup
            name="slots"
            value={slotId || ''}
            onChange={e => setSlotId(Number(e.target.value))}
          >
            {event.slots.map((slot) => (
              <FormControlLabel
                key={slot.id}
                value={slot.id}
                control={<Radio />}
                label={`${toLocalString(slot.timeUtc)} (${slot.left} left)`}
                disabled={slot.left <= 0}
                sx={{ mb: 0.5 }}
              />
            ))}
          </RadioGroup>
          {slotId && (
            <Box component="form" mt={2} onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Your Name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                  fullWidth
                />
                <TextField
                  label="Your Email"
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                  fullWidth
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                >
                  {loading ? "Booking..." : "Book Slot"}
                </Button>
              </Stack>
            </Box>
          )}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
