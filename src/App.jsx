import React from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import DashboardHome from './pages/DashboardHome';
import Edit from './pages/Edit';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import AddProduct from './pages/AddProduct';
import Orders from './pages/Orders';
import Users from './pages/Users';
import Carts from './pages/Carts';  
import Settings from './pages/Setting';
import QuickEdit from './pages/quickEdit';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/edit" element={<Edit />} />
        <Route path="/quick-edit" element={<QuickEdit />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/users" element={<Users />} />
        <Route path="/carts" element={<Carts />} />
        <Route path="/settings" element={<Settings />} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
      </Router>
  );
}

export default App;