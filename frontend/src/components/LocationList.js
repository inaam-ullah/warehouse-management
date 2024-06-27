import React, { useEffect, useState } from 'react';

import {
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { Link } from 'react-router-dom';

import Notification from './Notification';
import axiosInstance from '../utils/axiosConfig';

const LocationList = () => {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [open, setOpen] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    axiosInstance
      .get('/locations')
      .then(response => {
        if (response.data.length === 0) {
          setIsEmpty(true);
        } else {
          setLocations(response.data);
          setIsEmpty(false);
        }
      })
      .catch(error => {
        setError('There was an error fetching the locations!');
        setOpen(true);
      });
  }, []);

  const deleteLocation = async id => {
    try {
      await axiosInstance.delete(`/locations/${id}`);
      setLocations(locations.filter(location => location._id !== id));
      setSuccess('Location deleted successfully!');
      setOpen(true);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        'There was an error deleting the location!';
      setError(errorMessage);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
    setSuccess(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Locations
      </Typography>
      <Grid container spacing={3}>
        {locations.map(location => (
          <Grid item key={location._id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {location.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {location.address}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  component={Link}
                  to={`/locations/${location._id}`}
                  size="small"
                >
                  View
                </Button>
                <Button
                  component={Link}
                  to={`/locations/${location._id}/edit`}
                  size="small"
                  color="primary"
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => deleteLocation(location._id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {isEmpty && (
        <Typography variant="h6" mt={4}>
          No locations available.
        </Typography>
      )}
      {error && (
        <Notification
          message={error}
          severity="error"
          open={open}
          handleClose={handleClose}
        />
      )}
      {success && (
        <Notification
          message={success}
          severity="success"
          open={open}
          handleClose={handleClose}
        />
      )}
    </div>
  );
};

export default LocationList;
