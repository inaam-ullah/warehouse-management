import React from 'react';

import { useParams } from 'react-router-dom';

import ItemForm from '../components/ItemForm';

const EditItemPage = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Edit Item</h1>
      <ItemForm itemId={id} />
    </div>
  );
};

export default EditItemPage;
