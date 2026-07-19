import React from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, LogOut, Menu, Languages } from "lucide-react";
import kodaLogo from "../assets/images/KodaLogo2.png";
import { useLanguage } from "../Context/LanguageContext";

export default function Navbar({ onMenuClick, darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const { t, toggleLang, lang } = useLanguage();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="h-[72px] bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-6 transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
        >
          <Menu size={22} />
        </button>

        <img src={kodaLogo} alt="Koda Store" className="h-9 w-auto" />
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-none">
            {t("navbar.title")}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {t("navbar.subtitle")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Language Toggle */}
        <button
          onClick={toggleLang}
          title={lang === "en" ? "التحويل للعربية" : "Switch to English"}
          className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-500 dark:text-sky-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <span className="text-[13px] font-bold select-none">
            {lang === "en" ? "ع" : "EN"}
          </span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-500 dark:text-yellow-300 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          {darkMode ? <Moon size={17} /> : <Sun size={17} />}
        </button>

        <div className="hidden sm:flex items-center gap-2 pl-1">
          <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center text-sm font-bold">
            AA
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {t("navbar.adminAccount")}
            </p>
            <p className="text-xs text-slate-400">{t("navbar.admin")}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">{t("navbar.logout")}</span>
        </button>
      </div>
    </header>
  );
}