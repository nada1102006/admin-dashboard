import { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/Dashboard.css";
import { LuLoaderCircle } from "react-icons/lu";
import {
  FaShoppingBag,
  FaClock,
  FaDollarSign,
  FaChartLine,
  FaUsers,
  FaBoxOpen,
} from "react-icons/fa";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const formatDate = (dateString) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
};

const actualStatusConfig = {
  pending: {
    label: "PENDING",
    color: "text-amber-300",
    bg: "bg-[#2d2928]",
    border: "border-amber-700/40",
    badgeBg: "bg-amber-500/10",
    badgeText: "text-amber-300",
  },

  processing: {
    label: "PROCESSING",
    color: "text-sky-300",
    bg: "bg-[#11293f]",
    border: "border-sky-700/40",
    badgeBg: "bg-sky-500/10",
    badgeText: "text-sky-300",
  },

  confirmed: {
    label: "CONFIRMED",
    color: "text-cyan-300",
    bg: "bg-[#13283f]",
    border: "border-cyan-700/40",
    badgeBg: "bg-cyan-500/10",
    badgeText: "text-cyan-300",
  },

  shipped: {
    label: "SHIPPED",
    color: "text-violet-300",
    bg: "bg-[#24224b]",
    border: "border-violet-700/40",
    badgeBg: "bg-violet-500/10",
    badgeText: "text-violet-300",
  },

  delivered: {
    label: "DELIVERED",
    color: "text-emerald-300",
    bg: "bg-[#15323a]",
    border: "border-emerald-700/40",
    badgeBg: "bg-emerald-500/10",
    badgeText: "text-emerald-300",
  },

  cancelled: {
    label: "CANCELLED",
    color: "text-rose-300",
    bg: "bg-[#332132]",
    border: "border-rose-700/40",
    badgeBg: "bg-rose-500/10",
    badgeText: "text-rose-300",
  },

};

export default function DashboardHome() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getDashboard = async () => {
      try {
        const res = await api.get("/orders/admin/dashboard", {
          withCredentials: true,
        });
        if (res.data.success) {
          setData(res.data.dashboard);
        } else {
          throw new Error("API returned unsuccessful response");
        }
      } catch (err) {
        console.log("Dashboard Error:", err);
        setError(
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    getDashboard();
  }, []);

  if (loading) {
   return (
    <div className="flex flex-col items-center justify-center min-h-[500px] w-full">
      <LuLoaderCircle className="w-12 h-12 animate-spin text-cyan-400 mb-4" />
      <p className="text-slate-400 animate-pulse">Loading dashboard data...</p>
    </div>
  );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl m-6">
        Error: {error}
      </div>
    );
  }

  if (!data) return null;

  const cards = [
    {
      title: "Total Orders",
      value: data?.orders?.total || 0,
      icon: <FaShoppingBag />,
      color: "#e546b5",
      bg: "#EEF2FF",
      caption: "All orders received",
    },
    {
      title: "Pending Orders",
      value: data?.orders?.pending || 0,
      icon: <FaClock />,
      color: "#F59E0B",
      bg: "#FEF3C7",
      caption: "Awaiting action",
    },
    {
      title: "Revenue",
      value: `$${data?.revenue?.total || 0}`,
      icon: <FaDollarSign />,
      color: "#10B981",
      bg: "#D1FAE5",
      caption: "Total gross revenue",
    },
    {
      title: "This Month",
      value: `$${data?.revenue?.lastMonth || 0}`,
      icon: <FaChartLine />,
      color: "#EC4899",
      bg: "#FCE7F3",
      caption: "Monthly sales target",
    },
    {
      title: "Users",
      value: data?.totalCustomers || 0,
      icon: <FaUsers />,
      color: "#3B82F6",
      bg: "#DBEAFE",
      caption: "15 sold",
    },
    {
      title: "Top Product",
      value: data?.topProducts?.[0]?.totalSold || 0,
      icon: <FaBoxOpen />,
      color: "#8B5CF6",
      bg: "#EDE9FE",
      caption: "Registered customers",
    },
  ];

  return (
    <section className="dashboard">
      <div className="dashboard-header bg-white dark:bg-slate-950">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-400 ">Admin Overview</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white text-black">Real-time commerce health</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-300">Monitor your storefront with AI-style clarity and live API metrics.</p>
      </div>

      <div className="cards-grid">
        {cards.map((card, index) => (
          <div className="card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-xl" key={index} style={{ "--card-accent": card.color }}>
            <div className="card-icon" style={{ background: `linear-gradient(135deg, ${card.color}, ${card.color}dd)` }}>
              {card.icon}
            </div>

            <h4>{card.title}</h4>

            <h2 className="text-black dark:text-white">{card.value}</h2>

            <p className="dash-card-caption">
              {card.caption}
            </p>
          </div>
        ))}
      </div>

      <div className="bottom-section grid gap-8 xl:grid-cols-[2fr_1fr] items-start">
        {/* ORDER STATUS CARD */}
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl min-h-[520px] dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-sm uppercase tracking-[0.35em] text-cyan-400">
                Order Status
              </span>

              <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                Live fulfillment breakdown
              </h2>
            </div>

            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
              Updated from API
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[
              "pending",
              "processing",
              "confirmed",
              "shipped",
              "delivered",
              "cancelled",
            ].map((statusKey) => {
              const conf = actualStatusConfig[statusKey];
              const count = data.orders?.[statusKey] || 0;

              return (
                <div
                  key={statusKey}
                  className={`${conf.bg} ${conf.border} border rounded-[22px] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}                >
                  <div
                    className={`${conf.color} text-xs tracking-[0.28em] sm:text-[11px] font-medium  uppercase mb-3`}
                  >
                    {conf.label}
                  </div>

                  <div
                    className={`${conf.color} text-5xl font-light`}
                  >
                    {count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* BEST SELLER */}
        <div className="best-seller bg-white/90 rounded-3xl border border-slate-200 p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900/90">
          <h3>Best Seller</h3>

          {data?.topProducts?.map((product, index) => (
            <div className="product-item bg-white/90 rounded-2xl border border-slate-200 p-4 shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90" key={index}>
              <img src={product.image} alt={product.name} />

              <div className="text-black dark:text-white">
                <h4>{product.name}</h4>
                <p>{product.totalSold} Sold</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT ORDERS CARD */}
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900/90">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-cyan-400 tracking-[0.2em] text-[11px] uppercase font-bold">
              Recent Orders
            </span>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
              Latest customer activity
            </h2>
          </div>
          <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
            {data.recentOrders?.length || 0} orders
          </span>
        </div>

        <div className="space-y-4">
          {data.recentOrders?.map((order) => (
            <div
              key={order._id}
              className="flex items-center justify-between rounded-3xl border border-slate-700  dark:bg-slate-950 px-6 py-5 transition-all duration-300 hover:border-slate-600 dark:hover:bg-slate-900 "
            >
              {/* Left */}
              <div>
                <h4 className="text-lg font-semibold text-black dark:text-white">
                  {order.user?.username ||
                    order.shippingAddress?.fullName ||
                    "Customer"}
                </h4>

                <p className="mt-1 text-sm text-slate-400">
                  {order.items?.[0]?.name} • {formatDate(order.createdAt)}
                </p>
              </div>

              {/* Right */}
              <div className="flex items-center gap-6">
                <span
                  className={`rounded-full px-4 py-1.5 text-sm font-medium ${actualStatusConfig[order.status]?.badgeBg || "bg-slate-800"
                    } ${actualStatusConfig[order.status]?.badgeText || "text-slate-300"
                    }`}
                >
                  {order.status}
                </span>

                <span className="min-w-[110px] text-right text-xl font-medium text-white">
                  {formatCurrency(order.totalPrice)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

////////////////////////////////////////////////////////////////////