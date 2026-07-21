import { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import BackToUp from "@uiw/react-back-to-top";
import { FaArrowUp } from "react-icons/fa";
import "./Layout.css"

export default function DashboardLayout() {
  const [size, setSize] = useState(50);
  const [iconSize, setIconSize] = useState(24);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let newSize, newIconSize;
      if (width < 480) {
        newSize = 38;
        newIconSize = 18;
      } else if (width < 768) {
        newSize = 44;
        newIconSize = 20;
      } else if (width < 1024) {
        newSize = 50;
        newIconSize = 24;
      } else {
        newSize = 55;
        newIconSize = 26;
      }
      setSize(newSize);
      setIconSize(newIconSize);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const token = localStorage.getItem("userToken");
  if (!token) return <Navigate to="/login" replace />;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex bg-slate-50 dark:bg-slate-950 transition-colors min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar ثابت */}
        <div className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
          <Navbar onMenuClick={() => setSidebarOpen((prev) => !prev)} />
        </div>

        {/* المحتوى - بدون overflow-y-auto ليصبح التمرير على الصفحة */}
        <main className="flex-1 lg:p-0">
          <div className="min-h-[calc(100vh-72px)]">
            <Outlet />
          </div>
        </main>
      </div>

      <BackToUp
        top={200}
        size={size}
        strokeWidth={4}
        className="my-back-to-top z-[30]"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
        }}
      >
        <FaArrowUp
          style={{
            fontSize: iconSize + "px",
            color: "rgb(12, 188, 215)",
            width: iconSize + "px",
            height: iconSize + "px",
          }}
        />
      </BackToUp>
    </div>
  );
}
