import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardHome from "./pages/DashboardHome";
import Users from "./pages/Users";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import ProductDetails from "./pages/ProductDetails";
import Orders from "./pages/Orders";
import Carts from "./pages/Carts";
import Setting from "./pages/Setting";
import Login from "./pages/Login";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/users" element={<Users />} />
        <Route path="/products" element={<Products />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/carts" element={<Carts />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;