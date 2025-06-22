import React from 'react';
import { Link } from 'react-router-dom';

export default function ErrorPage() {
  return (
    <div>
      <h2>⚠️ Booking Failed</h2>
      <Link to="/">Back to Events</Link>
    </div>
  );
}