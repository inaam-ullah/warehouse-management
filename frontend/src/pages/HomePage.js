import React, { useEffect, useState } from 'react';

import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import { Link } from 'react-router-dom';

import ItemList from '../components/ItemList';
import Notification from '../components/Notification';
import axiosInstance from '../utils/axiosConfig';

const HomePage = () => {
  const [lowStockItems, setLowStockItems] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axiosInstance.get('/items');
        const lowStock = response.data.filter(item => item.quantity < 5);
        setLowStockItems(lowStock);
      } catch (error) {
        setError('There was an error fetching the items!');
        setOpen(true);
      }
    };

    fetchItems();
  }, []);

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Warehouse Items
      </Typography>
      {lowStockItems.length > 0 && (
        <div>
          <Typography variant="h6" color="error" gutterBottom>
            Low Stock Alerts
          </Typography>
          <Grid container spacing={3}>
            {lowStockItems.map(item => (
              <Grid item key={item._id} xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Quantity: {item.quantity}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      component={Link}
                      to={`/items/${item._id}`}
                      size="small"
                      data-testid={`view-button-${item._id}`}
                    >
                      View
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      )}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/items/new"
            data-testid="add-item-button"
          >
            Add New Item
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/locations/new"
            data-testid="add-location-button"
          >
            Add New Location
          </Button>
        </Grid>
      </Grid>
      <ItemList />
      {error && (
        <Notification
          message={error}
          severity="error"
          open={open}
          handleClose={handleClose}
        />
      )}
    </div>
  );
};

export default HomePage;
