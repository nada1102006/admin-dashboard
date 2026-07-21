import { useState, useEffect } from "react";
import { CartsSkeleton } from "../components/Skeleton/CartsSkeleton/CartsSkeleton";
import useTheme from "../components/customHook/useTheme";
import { useLanguage } from "../Context/LanguageContext";
import { FiShoppingCart, FiBox, FiUsers, FiDollarSign } from "react-icons/fi";

function Carts() {
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();

  const [showSkeleton, setShowSkeleton] = useState(true);
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCarts: 0,
    totalItems: 0,
    totalValue: 0,
    uniqueUsers: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
      setLoading(false);
      setCarts([]);
      setStats({
        totalCarts: 0,
        totalItems: 0,
        totalValue: 0,
        uniqueUsers: 0,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (showSkeleton || loading) {
    const skeletonBaseColor = isDarkMode ? "#1e293b" : "#e2e8f0";
    const skeletonHighlightColor = isDarkMode ? "#334155" : "#f1f5f9";

    return (
      <CartsSkeleton
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
                <FiShoppingCart size={28} />
              </div>
              <div>
                <p className="text-[11px] font-bold tracking-[0.25em] text-sky-500 dark:text-sky-400 uppercase">
                  {t("carts.title")}
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  {t("carts.overview")}
                </h2>
              </div>
            </div>
            <span className="rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 backdrop-blur-sm">
              {t("dashboard.updatedFromApi")}
            </span>
          </div>
          <p className="relative z-10 mt-2 text-sm text-slate-500 dark:text-slate-400">
            {t("carts.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<FiShoppingCart />}
            value={stats.totalCarts}
            label={t("carts.totalCarts")}
            tone="cyan"
          />
          <StatCard
            icon={<FiBox />}
            value={stats.totalItems}
            label={t("carts.totalItems")}
            tone="amber"
          />
          <StatCard
            icon={<FiDollarSign />}
            value={`$${stats.totalValue.toFixed(2)}`}
            label={t("carts.totalValue")}
            tone="emerald"
          />
          <StatCard
            icon={<FiUsers />}
            value={stats.uniqueUsers}
            label={t("carts.uniqueUsers")}
            tone="purple"
          />
        </div>

        {carts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30">
            <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mb-4">
              <FiShoppingCart size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {t("carts.noCarts")}
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              {t("carts.noCartsDesc")}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            <div className="rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 p-6 shadow-lg">
              <p className="text-center text-slate-500 dark:text-slate-400">
                Cart items will be displayed here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, tone, className = "" }) {
  const tones = {
    cyan: "bg-gradient-to-br from-cyan-500 to-sky-500 text-white shadow-lg shadow-cyan-500/30",
    amber:
      "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30",
    emerald:
      "bg-gradient-to-br from-emerald-400 to-green-500 text-white shadow-lg shadow-emerald-500/30",
    purple:
      "bg-gradient-to-br from-purple-500 to-violet-500 text-white shadow-lg shadow-purple-500/30",
  };

  return (
    <div
      className={`flex flex-col rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${className}`}
    >
      <div
        className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${tones[tone]}`}
      >
        {icon}
      </div>
      <h3 className="text-[32px] font-black tracking-tight text-slate-900 dark:text-white leading-none">
        {value}
      </h3>
      <p className="mt-2 text-[14px] font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
    </div>
  );
}

export default Carts;