import React from 'react';
import LocationForm from '../components/LocationForm';
import { useParams } from 'react-router-dom';

const EditLocationPage = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Edit Location</h1>
      <LocationForm locationId={id} />
    </div>
  );
};

export default EditLocationPage;
