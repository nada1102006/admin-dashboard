import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import HandleLottie from "./components/HandleLottie/HandleLottie";

// تعديل المسارات بناءً على الفولدرات الحقيقية في شجرة المشروع
const Login          = lazy(() => import("./pages/Login/Login.jsx"));
const DashboardHome  = lazy(() => import("./pages/DashboardHome"));
const Products       = lazy(() => import("./pages/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const AddProduct     = lazy(() => import("./pages/AddProduct"));
const Orders         = lazy(() => import("./pages/Orders"));
const Users          = lazy(() => import("./pages/Users"));
const Carts          = lazy(() => import("./pages/Carts"));
const Settings       = lazy(() => import("./pages/Setting"));

// المكون الوسيط للـ Loader
const withSuspense = (Component) => (
  <Suspense fallback={<HandleLottie state={"secondary"} />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/login",
    element: withSuspense(Login),
  },
  {
    path: "/",
    // شيلنا الـ Layout مؤقتاً هنا وحطينا مكانها الـ Routes الأساسية عشان المشروع يفتح
    // وبمجرد ما المشروع يشتغل، تقدري تشوفي فولدر Layout مستخبي جوه pages ولا فين وتعدلي مساره
    element: withSuspense(DashboardHome), 
    children: [
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
        element: <HandleLottie state={"error"} />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;