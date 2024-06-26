import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { useParams } from 'react-router-dom';
import { Paper, Typography, CircularProgress, Box, Divider } from '@mui/material';
import Notification from '../components/Notification';

const LocationDetailPage = () => {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axiosInstance.get(`/locations/${id}`)
      .then(response => {
        setLocation(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('There was an error fetching the location!');
        setLoading(false);
        setOpen(true);
      });
  }, [id]);

  const handleClose = () => {
    setOpen(false);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!location) {
    return <Typography variant="h6">Location not found</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5, p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>{location.name}</Typography>
        <Divider />
        <Typography variant="body1" sx={{ mt: 2 }}>{location.address}</Typography>
      </Paper>
      {error && <Notification message={error} severity="error" open={open} handleClose={handleClose} />}
    </Box>
  );
};

export default LocationDetailPage;
