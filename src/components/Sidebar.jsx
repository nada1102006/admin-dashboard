import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Users,
  Package,
  Plus,
  ClipboardList,
  ShoppingCart,
  Settings,
  X,
} from "lucide-react";
import { useLanguage } from "../Context/LanguageContext";

export default function Sidebar({ open, onClose }) {
  const { t, isRTL } = useLanguage();

  const NAV_ITEMS = [
    { labelKey: "sidebar.dashboard", icon: Home, to: "/" },
    { labelKey: "sidebar.users", icon: Users, to: "/users" },
    { labelKey: "sidebar.products", icon: Package, to: "/products" },
    { labelKey: "sidebar.addProduct", icon: Plus, to: "/add-product" },
    { labelKey: "sidebar.orders", icon: ClipboardList, to: "/orders" },
    { labelKey: "sidebar.carts", icon: ShoppingCart, to: "/carts" },
    { labelKey: "sidebar.settings", icon: Settings, to: "/settings" },
  ];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed z-40 inset-y-0 ${isRTL ? "right-0" : "left-0"} w-64 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 flex flex-col
        ${isRTL ? "border-l" : "border-r"}
        transition-colors transition-transform duration-300 ease-in-out
        lg:static ${isRTL ? "lg:translate-x-0" : "lg:translate-x-0"}
        ${open 
          ? "translate-x-0" 
          : isRTL 
            ? "translate-x-full lg:translate-x-0" 
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-6 pt-6 pb-5 flex items-start justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-sky-500">
              {t("sidebar.commerce")}
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              {t("sidebar.adminPanel")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.labelKey}
                to={item.to}
                end={item.to === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-slate-900 text-white dark:bg-sky-500"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`
                }
              >
                <Icon size={18} />
                {t(item.labelKey)}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4">
          <div className="rounded-2xl p-4 bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-blue-500/20">
            <p className="text-[10px] font-bold tracking-[0.25em] opacity-90">
              {t("sidebar.liveStatus")}
            </p>
            <p className="font-bold mt-1 leading-snug">
              {t("sidebar.liveMessage")}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}