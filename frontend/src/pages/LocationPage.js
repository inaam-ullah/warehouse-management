import React from 'react';
import LocationList from '../components/LocationList';
import { Button, Typography, Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LocationPage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
        <Typography variant="h4">Warehouse Locations</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/locations/new')}>
          Add New Location
        </Button>
      </Box>
      <LocationList />
    </Container>
  );
};

export default LocationPage;
