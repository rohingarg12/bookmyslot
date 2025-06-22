import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, TextField, Typography, Stack, IconButton, Paper, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { createEvent } from '../api';   // <-- Use your API helper!

export default function CreateEvent() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [slots, setSlots] = useState([{ time: '', maxBookings: 1 }]);
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  const addSlot = () => setSlots(prev => [...prev, { time: '', maxBookings: 1 }]);
  const removeSlot = index => setSlots(prev => prev.filter((_, i) => i !== index));
  const updateSlot = (index, field, value) =>
    setSlots(prev => prev.map((slot, i) => i === index ? { ...slot, [field]: value } : slot));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append(
        'slots',
        JSON.stringify(slots.map(s => ({
          timeUtc: new Date(s.time).toISOString(),
          maxBookings: Number(s.maxBookings)
        })))
      );
      if (image) formData.append('image', image);

      await createEvent(formData);  // Use the axios helper!
      navigate('/');
    } catch (err) {
      setError('Failed to create event');
      console.error(err);
    }
  };

  return (
    <Box maxWidth={520} mx="auto" mt={5} p={4} component={Paper} elevation={4} borderRadius={3}>
      <Typography variant="h5" mb={3} fontWeight={600}>Create Event</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Stack spacing={2}>
          <TextField
            label="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mt: 1 }}
          >
            {image ? image.name : "Upload Event Image"}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={e => setImage(e.target.files[0])}
            />
          </Button>
          <Box>
            <Typography fontWeight={500} mb={1}>Time Slots</Typography>
            <Stack spacing={2}>
              {slots.map((slot, i) => (
                <Paper
                  key={i}
                  variant="outlined"
                  sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}
                >
                  <TextField
                    label="Date & Time"
                    type="datetime-local"
                    value={slot.time}
                    onChange={e => updateSlot(i, 'time', e.target.value)}
                    required
                    InputLabelProps={{ shrink: true }}
                    sx={{ minWidth: 200 }}
                  />
                  <TextField
                    label="Max Bookings"
                    type="number"
                    inputProps={{ min: 1 }}
                    value={slot.maxBookings}
                    onChange={e => updateSlot(i, 'maxBookings', e.target.value)}
                    required
                    sx={{ width: 140 }}
                  />
                  <IconButton color="error" onClick={() => removeSlot(i)} disabled={slots.length === 1}>
                    <DeleteIcon />
                  </IconButton>
                </Paper>
              ))}
            </Stack>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{ mt: 2 }}
              onClick={addSlot}
            >
              Add Slot
            </Button>
          </Box>
          <Button variant="contained" color="primary" type="submit" size="large" sx={{ mt: 3 }}>
            Save Event
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
