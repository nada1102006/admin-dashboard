import React, { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Navbar from "../Navbar"; 
import Sidebar from "../Sidebar";
import { useLanguage } from "../../Context/LanguageContext";

export default function DashboardLayout() {
  const token = localStorage.getItem("userToken");
  const { isRTL } = useLanguage();
  
  // 1. حماية المسارات (لو مفيش توكين يرجع للـ login)
  if (!token) return <Navigate to="/login" replace />;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors overflow-hidden">
      {/* 2. السايدبار والنافبار ثابتين هنا */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        
        {/* 3. هنا المكان اللي هتظهر فيه صفحات المنتجات والأوامر */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}