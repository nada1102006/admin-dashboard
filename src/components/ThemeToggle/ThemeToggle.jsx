// components/ThemeToggle.jsx
import { useState, useEffect } from "react";
import { IoMoon, IoGlobeOutline } from "react-icons/io5";
import { FaSun } from "react-icons/fa6";
import { useLanguage } from "../../Context/LanguageContext";

function ThemeToggle() {
  const { lang, toggleLang } = useLanguage();
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved
      ? saved === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <button
        onClick={toggleLang}
        className="px-3 py-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg border border-slate-200 dark:border-slate-700 hover:scale-105 transition-all duration-300 flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
        title={lang === "en" ? "تغيير إلى العربية" : "Switch to English"}
      >
        <IoGlobeOutline className="text-cyan-500 text-base" />
        <span>{lang === "en" ? "عربي" : "EN"}</span>
      </button>

      <button
        onClick={() => setIsDark(!isDark)}
        className="p-2 min-[500px]:p-3 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg border border-slate-200 dark:border-slate-700 hover:scale-110 transition-all duration-300 cursor-pointer"
      >
        {isDark ? (
          <FaSun
            className="text-yellow-400 hover:text-yellow-300 transition-colors min-[500px]:w-6 min-[500px]:h-6"
            style={{ filter: "drop-shadow(0 0 8px rgba(250, 204, 21, 0.5))" }}
          />
        ) : (
          <IoMoon
            className="text-sky-500 hover:text-sky-400 transition-colors min-[500px]:w-6 min-[500px]:h-6"
            style={{ filter: "drop-shadow(0 0 8px rgba(100, 116, 139, 0.3))" }}
          />
        )}
      </button>
    </div>
  );
}

export default ThemeToggle;
