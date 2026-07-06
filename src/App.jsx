import { lazy, Suspense } from "react";
import HandleLottie from "./components/HandleLottie/HandleLottie";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const Login = lazy(() => import("./pages/Login/Login.jsx"));
const DashboardHome = lazy(() => import("./pages/DashboardHome"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const AddProduct = lazy(() => import("./pages/AddProduct"));
const Orders = lazy(() => import("./pages/Orders"));
const Users = lazy(() => import("./pages/Users"));
const Carts = lazy(() => import("./pages/Carts"));
const Settings = lazy(() => import("./pages/Setting"));

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <Suspense fallback={<HandleLottie state={"secondary"} />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={<HandleLottie state={"secondary"} />}>
              <DashboardHome />
            </Suspense>
          }
        />
        <Route
          path="/products"
          element={
            <Suspense fallback={<HandleLottie state={"secondary"} />}>
              <Products />
            </Suspense>
          }
        />
        <Route
          path="/products/:id"
          element={
            <Suspense fallback={<HandleLottie state={"secondary"} />}>
              <ProductDetails />
            </Suspense>
          }
        />
        <Route
          path="/add-product"
          element={
            <Suspense fallback={<HandleLottie state={"secondary"} />}>
              <AddProduct />
            </Suspense>
          }
        />
        <Route
          path="/orders"
          element={
            <Suspense fallback={<HandleLottie state={"secondary"} />}>
              <Orders />
            </Suspense>
          }
        />
        <Route
          path="/users"
          element={
            <Suspense fallback={<HandleLottie state={"secondary"} />}>
              <Users />
            </Suspense>
          }
        />
        <Route
          path="/carts"
          element={
            <Suspense fallback={<HandleLottie state={"secondary"} />}>
              <Carts />
            </Suspense>
          }
        />
        <Route
          path="/settings"
          element={
            <Suspense fallback={<HandleLottie state={"secondary"} />}>
              <Settings />
            </Suspense>
          }
        />

        <Route
          path="*"
          element={
            <Suspense fallback={<HandleLottie state={"error"} />}></Suspense>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
