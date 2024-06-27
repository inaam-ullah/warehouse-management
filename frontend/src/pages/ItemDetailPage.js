// src/pages/ItemDetailPage.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { useParams } from 'react-router-dom';
import { Paper, Typography, Box, Divider } from '@mui/material';
import Notification from '../components/Notification';
import Spinner from '../components/Spinner';

const ItemDetailPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axiosInstance.get(`/items/${id}`)
      .then(response => {
        setItem(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('There was an error fetching the item!');
        setLoading(false);
        setOpen(true);
      });
  }, [id]);

  const handleClose = () => {
    setOpen(false);
  };

  if (loading) {
    return <Spinner />;
  }

  if (!item) {
    return <Typography data-testid="item-not-found" variant="h6">Item not found</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5, p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography data-testid="item-name" variant="h4" gutterBottom>{item.name}</Typography>
        <Divider />
        <Typography data-testid="item-description" variant="body1" sx={{ mt: 2 }}>{item.description}</Typography>
        <Typography data-testid="item-quantity" variant="body1" sx={{ mt: 2 }}>Quantity: {item.quantity}</Typography>
        <Typography data-testid="item-location" variant="body1" sx={{ mt: 2 }}>Location: {item.location_id?.name ?? 'No location'}</Typography>
        <Typography data-testid="item-last-updated" variant="body1" sx={{ mt: 2 }}>Last Updated: {new Date(item.last_updated).toLocaleString()}</Typography>
      </Paper>
      {error && <Notification message={error} severity="error" open={open} handleClose={handleClose} />}
    </Box>
  );
};

export default ItemDetailPage;
