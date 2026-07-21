import { useState, useEffect } from "react";
import { SettingsSkeleton } from "../components/Skeleton/SettingsSkeleton/SettingsSkeleton";
import useTheme from "../components/customHook/useTheme";
import { 
  FiSettings, 
  FiMoon, 
  FiSun, 
  FiGlobe, 
  FiBell, 
  FiUser, 
  FiMail,
  FiShield,
  FiDatabase,
  FiCloud,
  FiRefreshCw,
  FiCheckCircle
} from "react-icons/fi";

export default function Settings() {
  const { isDarkMode, toggleTheme } = useTheme(); // ← استخدم toggleTheme من الـ hook
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (showSkeleton) {
    const skeletonBaseColor = isDarkMode ? "#1e293b" : "#e2e8f0";
    const skeletonHighlightColor = isDarkMode ? "#334155" : "#f1f5f9";

    return (
      <SettingsSkeleton
        baseColor={skeletonBaseColor}
        highlightColor={skeletonHighlightColor}
      />
    );
  }

  return (
    <div className="p-4 lg:p-8 min-h-screen bg-slate-50/50 text-slate-900 dark:bg-slate-900">
      <div className="mx-auto max-w-[1600px] space-y-6 lg:space-y-8 slide-up">
        
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-500/5"></div>
          <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-500/5"></div>
          
          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-500 text-white shadow-lg shadow-cyan-500/30">
                <FiSettings size={28} />
              </div>
              <div>
                <p className="text-[11px] font-bold tracking-[0.25em] text-sky-500 dark:text-sky-400 uppercase">
                  SETTINGS
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  Preferences and integrations
                </h2>
              </div>
            </div>
            <span className="rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 backdrop-blur-sm">
              v2.0.1
            </span>
          </div>
          <p className="relative z-10 mt-2 text-sm text-slate-500 dark:text-slate-400">
            Theme mode, API credentials, and dashboard preferences are managed here.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          <SettingCard
            icon={<FiMoon />}
            title="Appearance"
            description="Customize your dashboard theme"
            tone="cyan"
          >
            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={toggleTheme} // ← استخدم toggleTheme مباشرة
                className={`flex  cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  !isDarkMode
                    ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'bg-white/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <FiSun size={16} />
                Light
              </button>
              <button
                onClick={toggleTheme} 
                className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'bg-white/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <FiMoon size={16} />
                Dark
              </button>
            </div>
          </SettingCard>

          <SettingCard
            icon={<FiBell />}
            title="Notifications"
            description="Manage your alerts and updates"
            tone="amber"
          >
            <div className="flex items-center justify-between mt-3">
              <span className="text-sm text-slate-600 dark:text-slate-300">Email notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-sky-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-slate-600 dark:text-slate-300">Push notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-sky-500"></div>
              </label>
            </div>
          </SettingCard>

          <SettingCard
            icon={<FiShield />}
            title="Security"
            description="Protect your account"
            tone="emerald"
          >
            <button className="w-full cursor-pointer rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all backdrop-blur-sm">
              Change Password
            </button>
            <button className="w-full cursor-pointer rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all backdrop-blur-sm mt-2">
              Two-Factor Authentication
            </button>
          </SettingCard>

          <SettingCard
            icon={<FiGlobe />}
            title="Language"
            description="Choose your preferred language"
            tone="purple"
          >
            <select className="w-full rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 backdrop-blur-sm">
              <option value="en">English</option>
              <option value="ar">العربية</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
            </select>
          </SettingCard>

          <SettingCard
            icon={<FiCloud />}
            title="API Integration"
            description="Manage API connections"
            tone="blue"
          >
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <FiCheckCircle className="text-emerald-500" />
              <span>API Status: Connected</span>
            </div>
            <button className="w-full rounded-xl cursor-pointer border border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all backdrop-blur-sm mt-2">
              <FiRefreshCw className="inline mr-2" />
              Refresh Connection
            </button>
          </SettingCard>

          <SettingCard
            icon={<FiDatabase />}
            title="Database"
            description="Data management settings"
            tone="rose"
          >
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-slate-600 dark:text-slate-300">Auto-backup</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-sky-500"></div>
              </label>
            </div>
            <button className="w-full cursor-pointer rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all backdrop-blur-sm mt-2">
              Export Data
            </button>
          </SettingCard>

        </div>

        <div className="rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 text-white shadow-lg shadow-purple-500/30">
              <FiUser size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Profile Information</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Update your personal details</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                placeholder="yasmeen sharf"
                className="w-full rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 backdrop-blur-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="admin@gmail.com "
                  className="w-full rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>
          <button className="mt-4 cursor-pointer rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 hover:from-cyan-600 hover:to-sky-600 transition-all">
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}

function SettingCard({ icon, title, description, tone, children }) {
  const toneColors = {
    cyan: "from-cyan-500 to-sky-500",
    amber: "from-amber-400 to-orange-500",
    emerald: "from-emerald-400 to-green-500",
    purple: "from-purple-500 to-violet-500",
    blue: "from-blue-500 to-indigo-500",
    rose: "from-rose-400 to-red-500",
  };

  return (
    <div className="rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${toneColors[tone]} text-white shadow-lg shadow-${tone}-500/30`}>
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
      </div>
      <div className="mt-4">
        {children}
      </div>
    </div>
  );
}