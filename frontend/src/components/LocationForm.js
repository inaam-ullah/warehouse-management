import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { TextField, Button, Box, Paper, Container, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Notification from './Notification';

const LocationForm = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const { handleSuccess } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axiosInstance.get(`/locations/${id}`)
        .then(response => {
          const location = response.data;
          setName(location.name);
          setAddress(location.address);
        })
        .catch(error => {
          setError('There was an error fetching the location!');
          setOpen(true);
        });
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const locationData = { name, address };

    if (id) {
      axiosInstance.put(`/locations/${id}`, locationData)
        .then(() => {
          handleSuccess('Location updated successfully!');
          navigate('/locations');
        })
        .catch(error => {
          setError('There was an error updating the location!');
          setOpen(true);
        });
    } else {
      axiosInstance.post('/locations', locationData)
        .then(() => {
          handleSuccess('Location added successfully!');
          navigate('/locations');
        })
        .catch(error => {
          setError('There was an error creating the location!');
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
        <Typography variant="h5" mb={3}>{id ? 'Edit Location' : 'Add New Location'}</Typography>
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
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <Box mt={3}>
            <Button type="submit" variant="contained" color="primary">
              {id ? 'Update' : 'Add'} Location
            </Button>
          </Box>
        </form>
      </Paper>
      {error && <Notification message={error} severity="error" open={open} handleClose={handleClose} />}
    </Container>
  );
};

export default LocationForm;
