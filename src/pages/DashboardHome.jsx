import { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/Dashboard.css";
import {
  FaShoppingBag,
  FaClock,
  FaDollarSign,
  FaChartLine,
  FaUsers,
  FaBoxOpen,
} from "react-icons/fa";
import { DashboardSkeleton } from "../components/Skeleton/DashboardSkeleton/DashboardSkeleton";
import useTheme from "../components/customHook/useTheme";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EGP",
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
    color: "text-amber-500 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-200 dark:border-amber-900/50",
    badgeBg: "bg-amber-100 dark:bg-amber-900/30",
    badgeText: "text-amber-700 dark:text-amber-400",
  },
  processing: {
    label: "PROCESSING",
    color: "text-sky-500 dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-950/40",
    border: "border-sky-200 dark:border-sky-900/50",
    badgeBg: "bg-sky-100 dark:bg-sky-900/30",
    badgeText: "text-sky-700 dark:text-sky-400",
  },
  confirmed: {
    label: "CONFIRMED",
    color: "text-cyan-500 dark:text-cyan-400",
    bg: "bg-cyan-50 dark:bg-cyan-950/40",
    border: "border-cyan-200 dark:border-cyan-900/50",
    badgeBg: "bg-cyan-100 dark:bg-cyan-900/30",
    badgeText: "text-cyan-700 dark:text-cyan-400",
  },
  shipped: {
    label: "SHIPPED",
    color: "text-violet-500 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950/40",
    border: "border-violet-200 dark:border-violet-900/50",
    badgeBg: "bg-violet-100 dark:bg-violet-900/30",
    badgeText: "text-violet-700 dark:text-violet-400",
  },
  delivered: {
    label: "DELIVERED",
    color: "text-emerald-500 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-200 dark:border-emerald-900/50",
    badgeBg: "bg-emerald-100 dark:bg-emerald-900/30",
    badgeText: "text-emerald-700 dark:text-emerald-400",
  },
  cancelled: {
    label: "CANCELLED",
    color: "text-rose-500 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-950/40",
    border: "border-rose-200 dark:border-rose-900/50",
    badgeBg: "bg-rose-100 dark:bg-rose-900/30",
    badgeText: "text-rose-700 dark:text-rose-400",
  },
};

export default function DashboardHome() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const getDashboard = async () => {
      try {
        const res = await api.get("/orders/admin");
        if (res.data.success && res.data.orders) {
          const allOrders = res.data.orders;

          const totalOrdersCount = allOrders.length;
          const totalRevenue = allOrders.reduce(
            (sum, o) => sum + (Number(o.totalPrice) || 0),
            0,
          );

          const statusCounts = {
            pending: 0,
            processing: 0,
            confirmed: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0,
          };
          allOrders.forEach((o) => {
            if (statusCounts[o.status] !== undefined) {
              statusCounts[o.status]++;
            }
          });

          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          const lastMonthRevenue = allOrders
            .filter((o) => new Date(o.createdAt) >= thirtyDaysAgo)
            .reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);

          const productSales = {};
          let totalCustomers = new Set();

          allOrders.forEach((order) => {
            if (order.user?._id) totalCustomers.add(order.user._id);
            else if (order.user) totalCustomers.add(order.user);
            else if (order.shippingAddress?.email)
              totalCustomers.add(order.shippingAddress.email);

            if (order.items && Array.isArray(order.items)) {
              order.items.forEach((item) => {
                const productId = item.product || item.name;
                if (!productId) return;

                if (!productSales[productId]) {
                  productSales[productId] = {
                    name: item.name || "Unknown Product",
                    image:
                      item.image ||
                      "https://placehold.co/100x100/f8fafc/94a3b8?text=No+Image",
                    totalSold: 0,
                  };
                }
                productSales[productId].totalSold += Number(item.quantity) || 1;
              });
            }
          });

          const topProducts = Object.values(productSales)
            .sort((a, b) => b.totalSold - a.totalSold)
            .slice(0, 4);

          const sortedOrders = [...allOrders].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          );
          const recentOrders = sortedOrders.slice(0, 5);

          setData({
            orders: { total: totalOrdersCount, ...statusCounts },
            revenue: { total: totalRevenue, lastMonth: lastMonthRevenue },
            recentOrders: recentOrders,
            topProducts: topProducts,
            totalCustomers: totalCustomers.size,
          });
        } else {
          throw new Error("API returned unsuccessful response");
        }
      } catch (err) {
        console.log("Dashboard Error:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch dashboard data",
        );
      } finally {
        setLoading(false);
      }
    };

    getDashboard();
  }, []);

  if (loading) {
    const skeletonBaseColor = isDarkMode ? "#1e293b" : "#e2e8f0";
    const skeletonHighlightColor = isDarkMode ? "#334155" : "#f1f5f9";

    return (
      <DashboardSkeleton
        baseColor={skeletonBaseColor}
        highlightColor={skeletonHighlightColor}
      />
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500 bg-red-50 dark:bg-red-950/30 rounded-xl m-6">
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
      caption: "All orders received",
    },
    {
      title: "Pending Orders",
      value: data?.orders?.pending || 0,
      icon: <FaClock />,
      color: "#F59E0B",
      caption: "Awaiting action",
    },
    {
      title: "Revenue",
      value: formatCurrency(data?.revenue?.total || 0),
      icon: <FaDollarSign />,
      color: "#10B981",
      caption: "Total gross revenue",
    },
    {
      title: "This Month",
      value: formatCurrency(data?.revenue?.lastMonth || 0),
      icon: <FaChartLine />,
      color: "#EC4899",
      caption: "Monthly sales target",
    },
    {
      title: "Users",
      value: data?.totalCustomers || 0,
      icon: <FaUsers />,
      color: "#3B82F6",
      caption: "Customers who ordered",
    },
    {
      title: "Top Product",
      value: data?.topProducts?.[0]?.totalSold || 0,
      icon: <FaBoxOpen />,
      color: "#8B5CF6",
      caption: data?.topProducts?.[0]?.name
        ? data.topProducts[0].name.length > 20
          ? data.topProducts[0].name.slice(0, 20) + "..."
          : data.topProducts[0].name
        : "Most popular item",
    },
  ];

  return (
    <section className="dashboard min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-6 lg:p-8">
      <div className="slide-up max-w-7xl mx-auto space-y-6">
        
        <div className="dashboard-header relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-br from-slate-100 via-sky-50 to-blue-100/60 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/40 border border-slate-200/50 dark:border-slate-700/50 shadow-lg shadow-sky-100/20 dark:shadow-sky-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-sky-200/30 dark:hover:shadow-sky-900/20 hover:border-sky-300/50 hover:from-sky-100 hover:via-sky-200/50 hover:to-blue-200/60 dark:border-slate-700/50 dark:hover:border-slate-700/50 dark:bg-gradient-to-br dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/40 dark:hover:from-slate-800 dark:hover:via-slate-800/90 dark:hover:to-sky-900/40">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-sky-400/10 rounded-full blur-3xl dark:bg-sky-500/5" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl dark:bg-blue-500/5" />
          
          <div className="relative z-10">
            <p className="text-sm uppercase tracking-[0.35em] text-sky-500 dark:text-sky-400 font-semibold">
              Admin Overview
            </p>
            <h2 className="mt-2 text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              Real-time commerce health
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Monitor your storefront with AI-style clarity and live API metrics.
            </p>
          </div>
        </div>

        <div className="cards-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {cards.map((card, index) => (
            <div
              className="card p-6 rounded-2xl transition-all duration-300  hover:shadow-xl hover:-translate-y-1 border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 hover:from-sky-100 hover:via-sky-200/50 hover:to-blue-200/60 dark:hover:from-slate-800 dark:hover:via-slate-800/90 dark:hover:to-sky-900/30 dark:hover:border-slate-700/50"
              key={index}
            >
              <div
                className="card-icon w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl mb-4 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${card.color}, ${card.color}dd)`,
                }}
              >
                {card.icon}
              </div>

              <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                {card.title}
              </h4>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {card.value}
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {card.caption}
              </p>
            </div>
          ))}
        </div>

        <div className="bottom-section grid gap-6 lg:grid-cols-[2fr_1fr] items-start">
          
          <div className="rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:from-sky-100 hover:via-sky-200/50 hover:to-blue-200/60 dark:hover:from-slate-800 dark:hover:via-slate-800/90 dark:hover:to-sky-900/30 dark:hover:border-slate-700/50">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-sky-500 dark:text-sky-400 tracking-[0.2em] text-[11px] uppercase font-bold">
                  Order Status
                </span>
                <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                  Live fulfillment breakdown
                </h2>
              </div>

              <span className="rounded-full bg-emerald-100 dark:bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                Updated from API
              </span>
            </div>

            <div className="grid gap-4 grid-cols-2 xl:grid-cols-3">
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
                    className={`${conf.bg} ${conf.border} border rounded-[22px] p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                  >
                    <div
                      className={`${conf.color} tracking-[0.2em] text-[10px] font-bold uppercase mb-2`}
                    >
                      {conf.label}
                    </div>

                    <div className={`${conf.color} text-3xl font-bold`}>
                      {count}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="best-seller rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:from-sky-100 hover:via-sky-200/50 hover:to-blue-200/60 dark:hover:from-slate-800 dark:hover:via-slate-800/90 dark:hover:to-sky-900/30 dark:hover:border-slate-700/50">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Best Sellers
            </h3>

            <div className="space-y-3">
              {data?.topProducts?.map((product, index) => (
                <div
                  className="product-item bg-white/70 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-md backdrop-blur-sm hover:bg-white/90 dark:hover:bg-slate-800/50 dark:hover:border-slate-700/50"
                  key={index}
                >
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-12 h-12 rounded-lg object-cover bg-slate-100 dark:bg-slate-700"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {product.name}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {product.totalSold} Sold
                    </p>
                  </div>

                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    #{index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:from-sky-100 hover:via-sky-200/50 hover:to-blue-200/60 dark:hover:from-slate-800 dark:hover:via-slate-800/90 dark:hover:to-sky-900/30 dark:hover:border-slate-700/50">
          <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
            <div>
              <span className="text-sky-500 dark:text-sky-400 tracking-[0.2em] text-[11px] uppercase font-bold">
                Recent Orders
              </span>
              <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                Latest customer activity
              </h2>
            </div>
            <span className="rounded-full bg-sky-100 dark:bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-600 dark:text-sky-400">
              {data.recentOrders?.length || 0} orders
            </span>
          </div>

          <div className="space-y-3">
            {data.recentOrders?.map((order) => (
              <div
                key={order._id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/30 px-4 py-4 transition-all duration-300 hover:border-slate-300 hover:bg-white/90 dark:hover:border-slate-700/50 dark:hover:bg-slate-800/30 backdrop-blur-sm"
              >
                <div className="min-w-0 flex-1">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white truncate">
                    {order.user?.username ||
                      order.shippingAddress?.fullName ||
                      "Customer"}
                  </h4>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {order.items?.length > 0 ? (
                      <>
                        {order.items[0].name || "Product"}{" "}
                        {order.items.length > 1 &&
                          `+ ${order.items.length - 1} more`}
                      </>
                    ) : (
                      "Order items"
                    )}{" "}
                    • {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      actualStatusConfig[order.status]?.badgeBg ||
                      "bg-slate-200 dark:bg-slate-800"
                    } ${
                      actualStatusConfig[order.status]?.badgeText ||
                      "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {order.status}
                  </span>

                  <span className="text-base font-bold text-slate-900 dark:text-white min-w-[90px] text-right">
                    {formatCurrency(order.totalPrice)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}