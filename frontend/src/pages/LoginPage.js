import React, { useState, useContext } from 'react';
import axios from 'axios';
import config from '../config';
import { AuthContext } from '../context/AuthContext';
import { TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Notification from '../components/Notification';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, handleError } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${config.API_URL}/auth/login`, { username, password });
      localStorage.setItem('token', res.data.token);
      login(res.data.token);
      navigate('/');
    } catch (err) {
      setError('Error logging in');
      setOpen(true);
      handleError('Error logging in');
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary">
        Login
      </Button>
      <Button color="inherit" onClick={() => navigate('/register')}>
        Register
      </Button>
      {error && <Notification message={error} severity="error" open={open} handleClose={handleClose} />}
    </form>
  );
};

export default LoginPage;
