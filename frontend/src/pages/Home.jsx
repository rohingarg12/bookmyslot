import React, { useEffect, useState } from 'react';
import { fetchEvents } from '../api';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Stack,
  Container,
  CardMedia
} from '@mui/material';

export default function Home() {
  const [events, setEvents] = useState([]);
  // Use your deployed backend URL if needed:
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchEvents().then(res => setEvents(res.data));
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f9fafc' }}>
      <Container maxWidth="md">
        <Typography
          variant="h4"
          fontWeight={600}
          mb={4}
          color="primary"
          align="center"
        >
          Upcoming Events
        </Typography>
        {events.length === 0 ? (
          <Typography color="text.secondary" variant="body1" align="center">
            No upcoming events at the moment.
          </Typography>
        ) : (
          <Stack spacing={3}>
            {events.map(ev => (
              <Card
                key={ev.id}
                variant="outlined"
                sx={{
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: 4, borderColor: 'primary.light' }
                }}
              >
                {ev.image_url && (
                  <CardMedia
                    component="img"
                    height="180"
                    image={
                      ev.image_url.startsWith('/uploads')
                        ? apiBase + ev.image_url
                        : ev.image_url
                    }
                    alt={ev.title}
                    sx={{
                      objectFit: 'cover',
                      borderBottom: '1px solid #eee'
                    }}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" fontWeight={500} gutterBottom>
                    {ev.title}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    {ev.description || "No description"}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Slots available: <b>{ev.slots?.length || 0}</b>
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    component={Link}
                    to={`/events/${ev.id}`}
                    variant="contained"
                    color="primary"
                    size="small"
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
}
