import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddItemPage from './pages/AddItemPage';
import EditItemPage from './pages/EditItemPage';
import ItemDetailPage from './pages/ItemDetailPage';
import LocationPage from './pages/LocationPage';
import AddLocationPage from './pages/AddLocationPage';
import EditLocationPage from './pages/EditLocationPage';
import LocationDetailPage from './pages/LocationDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuthProvider from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import Header from './components/Header';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } />
          <Route path="/" element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          } />
          <Route path="/items/new" element={
            <PrivateRoute>
              <AddItemPage />
            </PrivateRoute>
          } />
          <Route path="/items/:id" element={
            <PrivateRoute>
              <ItemDetailPage />
            </PrivateRoute>
          } />
          <Route path="/items/:id/edit" element={
            <PrivateRoute>
              <EditItemPage />
            </PrivateRoute>
          } />
          <Route path="/locations" element={
            <PrivateRoute>
              <LocationPage />
            </PrivateRoute>
          } />
          <Route path="/locations/new" element={
            <PrivateRoute>
              <AddLocationPage />
            </PrivateRoute>
          } />
          <Route path="/locations/:id" element={
            <PrivateRoute>
              <LocationDetailPage />
            </PrivateRoute>
          } />
          <Route path="/locations/:id/edit" element={
            <PrivateRoute>
              <EditLocationPage />
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
