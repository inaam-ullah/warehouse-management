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

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [open, setOpen] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    axiosInstance
      .get('/items')
      .then(response => {
        if (response.data.length === 0) {
          setIsEmpty(true);
        } else {
          setItems(response.data);
          setIsEmpty(false);
        }
      })
      .catch(error => {
        setError('There was an error fetching the items!');
        setOpen(true);
      });
  }, []);

  const deleteItem = id => {
    axiosInstance
      .delete(`/items/${id}`)
      .then(() => {
        setItems(items.filter(item => item._id !== id));
        setError('Item deleted successfully!'); // Changed to setError for red alert
        setOpen(true);
      })
      .catch(error => {
        setError('There was an error deleting the item!');
        setOpen(true);
      });
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
    setSuccess(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Items
      </Typography>
      <Grid container spacing={3}>
        {items.map(item => (
          <Grid item key={item._id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {item.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {item.description}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Quantity: {item.quantity}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Location: {item.location_id?.name}
                </Typography>
              </CardContent>
              <CardActions>
                <Button component={Link} to={`/items/${item._id}`} size="small">
                  View
                </Button>
                <Button
                  component={Link}
                  to={`/items/${item._id}/edit`}
                  size="small"
                  color="primary"
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => deleteItem(item._id)}
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
          No items available.
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

export default ItemList;
