import React from 'react';

import { useParams } from 'react-router-dom';

import LocationForm from '../components/LocationForm';

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
