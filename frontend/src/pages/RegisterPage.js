import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';
import { TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Notification from '../components/Notification';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${config.API_URL}/auth/register`, { username, password });
      navigate('/login');
    } catch (err) {
      setError('Error registering');
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Username"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary">
        Register
      </Button>
      {error && <Notification message={error} severity="error" open={open} handleClose={handleClose} />}
    </form>
  );
};

export default RegisterPage;
