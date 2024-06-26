import React from 'react';
import ItemForm from '../components/ItemForm';
import { useParams } from 'react-router-dom';

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
