import React from 'react';
import { Link } from 'react-router-dom';

export default function Success() {
  return (
    <div>
      <h2>🎉 Booking Confirmed!</h2>
      <Link to="/">Back to Events</Link>
    </div>
  );
}