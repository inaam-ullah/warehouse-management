import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, Box, Paper, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Notification from './Notification';

const ItemForm = ({ itemId }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [locationId, setLocationId] = useState('');
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const { handleSuccess } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('/locations')
      .then(response => {
        setLocations(response.data);
      })
      .catch(error => {
        setError('There was an error fetching the locations!');
        setOpen(true);
      });

    if (itemId) {
      axiosInstance.get(`/items/${itemId}`)
        .then(response => {
          const item = response.data;
          setName(item.name);
          setDescription(item.description);
          setQuantity(item.quantity);
          setLocationId(item.location_id._id);
        })
        .catch(error => {
          setError('There was an error fetching the item!');
          setOpen(true);
        });
    }
  }, [itemId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const itemData = { name, description, quantity, location_id: locationId };

    if (itemId) {
      axiosInstance.put(`/items/${itemId}`, itemData)
        .then(() => {
          handleSuccess('Item updated successfully!');
          navigate('/');
        })
        .catch(error => {
          setError('There was an error updating the item!');
          setOpen(true);
        });
    } else {
      axiosInstance.post('/items', itemData)
        .then(() => {
          handleSuccess('Item added successfully!');
          navigate('/');
        })
        .catch(error => {
          setError('There was an error creating the item!');
          setOpen(true);
        });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container>
      <Paper sx={{ p: 3, mt: 5 }}>
        <Typography variant="h5" mb={3}>{itemId ? 'Edit Item' : 'Add New Item'}</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            fullWidth
            margin="normal"
            type="number"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Location</InputLabel>
            <Select
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              required
            >
              {locations.map(location => (
                <MenuItem key={location._id} value={location._id}>{location.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box mt={3}>
            <Button type="submit" variant="contained" color="primary">
              {itemId ? 'Update' : 'Add'} Item
            </Button>
          </Box>
        </form>
      </Paper>
      {error && <Notification message={error} severity="error" open={open} handleClose={handleClose} />}
    </Container>
  );
};

export default ItemForm;
