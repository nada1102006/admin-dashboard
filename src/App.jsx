import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";

import HandleLottie from "./components/HandleLottie/HandleLottie";

const Login = lazy(() => import("./pages/Login/Login.jsx"));
const DashboardHome = lazy(() => import("./pages/DashboardHome"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const AddProduct = lazy(() => import("./pages/AddProduct"));
const Orders = lazy(() => import("./pages/Orders/Orders.jsx"));
const Users = lazy(() => import("./pages/Users"));
const Carts = lazy(() => import("./pages/Carts"));
const Settings = lazy(() => import("./pages/Setting"));

const withSuspense = (Component) => (
  <Suspense fallback={<HandleLottie state="secondary" />}>
    <Component />
  </Suspense>
);

// حماية Dashboard
const DashboardLayout = () => {
  const token = localStorage.getItem("userToken");

  // إذا لم يكن هناك توكين، إعادة التوجيه إلى login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard-container">
      <main className=" bg-slate-100 dark:bg-slate-950">
        <Outlet />
      </main>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: withSuspense(Login),
    errorElement: <HandleLottie state="error" />,
  },
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: withSuspense(DashboardHome),
      },
      {
        path: "dashboard",
        element: withSuspense(DashboardHome),
      },
      {
        path: "products",
        element: withSuspense(Products),
      },
      {
        path: "products/:id",
        element: withSuspense(ProductDetails),
      },
      {
        path: "add-product",
        element: withSuspense(AddProduct),
      },
      {
        path: "orders",
        element: withSuspense(Orders),
      },
      {
        path: "users",
        element: withSuspense(Users),
      },
      {
        path: "carts",
        element: withSuspense(Carts),
      },
      {
        path: "settings",
        element: withSuspense(Settings),
      },
      {
        path: "*",
        element: <HandleLottie state="error" />,
      },
    ],
    errorElement: <HandleLottie state="error" />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
