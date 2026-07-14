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

  useEffect(() => {
    const getDashboard = async () => {
      try {
        const res = await api.get("/orders/admin");
        if (res.data.success && res.data.orders) {
          const allOrders = res.data.orders;
          
          const totalOrdersCount = allOrders.length;
          const totalRevenue = allOrders.reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);
          
          const statusCounts = { pending: 0, processing: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0 };
          allOrders.forEach(o => {
            if (statusCounts[o.status] !== undefined) {
              statusCounts[o.status]++;
            }
          });
          
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          const lastMonthRevenue = allOrders
            .filter(o => new Date(o.createdAt) >= thirtyDaysAgo)
            .reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);
            
          const productSales = {};
          let totalCustomers = new Set();
          
          allOrders.forEach(order => {
            if (order.user?._id) totalCustomers.add(order.user._id);
            else if (order.user) totalCustomers.add(order.user);
            else if (order.shippingAddress?.email) totalCustomers.add(order.shippingAddress.email);
            
            if (order.items && Array.isArray(order.items)) {
              order.items.forEach(item => {
                const productId = item.product || item.name; 
                if (!productId) return;
                
                if (!productSales[productId]) {
                  productSales[productId] = {
                    name: item.name || "Unknown Product",
                    image: item.image || "https://placehold.co/100x100/f8fafc/94a3b8?text=No+Image",
                    totalSold: 0
                  };
                }
                productSales[productId].totalSold += (Number(item.quantity) || 1);
              });
            }
          });

          const topProducts = Object.values(productSales)
            .sort((a, b) => b.totalSold - a.totalSold)
            .slice(0, 4);

          const sortedOrders = [...allOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          const recentOrders = sortedOrders.slice(0, 5);

          setData({
            orders: { total: totalOrdersCount, ...statusCounts },
            revenue: { total: totalRevenue, lastMonth: lastMonthRevenue },
            recentOrders: recentOrders,
            topProducts: topProducts,
            totalCustomers: totalCustomers.size
          });
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
      value: formatCurrency(data?.revenue?.total || 0),
      icon: <FaDollarSign />,
      color: "#10B981",
      bg: "#D1FAE5",
      caption: "Total gross revenue",
    },
    {
      title: "This Month",
      value: formatCurrency(data?.revenue?.lastMonth || 0),
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
      caption: "Customers who ordered",
    },
    {
      title: "Top Product",
      value: data?.topProducts?.[0]?.totalSold || 0,
      icon: <FaBoxOpen />,
      color: "#8B5CF6",
      bg: "#EDE9FE",
      caption: data?.topProducts?.[0]?.name 
        ? (data.topProducts[0].name.length > 20 ? data.topProducts[0].name.slice(0, 20) + "..." : data.topProducts[0].name)
        : "Most popular item",
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
              <span className="text-[#00bad5] tracking-[0.2em] text-[11px] uppercase font-bold">
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
                    className={`${conf.color} tracking-[0.2em] text-[11px] font-bold uppercase mb-3`}
                  >
                    {conf.label}
                  </div>

                  <div
                    className={`${conf.color} text-[32px] font-normal`}
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
            <span className="text-[#00bad5] tracking-[0.2em] text-[11px] uppercase font-bold">
              Recent Orders
            </span>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
              Latest customer activity
            </h2>
          </div>
          <span className="rounded-full bg-[#00bad5]/10 px-3 py-1 text-xs font-bold text-[#00bad5]">
            {data.recentOrders?.length || 0} orders
          </span>
        </div>

        <div className="space-y-4">
          {data.recentOrders?.map((order) => (
            <div
              key={order._id}
              className="flex items-center justify-between rounded-3xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 px-6 py-5 transition-all duration-300 hover:border-slate-200 hover:bg-slate-100 dark:hover:border-slate-700 dark:hover:bg-slate-900"
            >
              {/* Left */}
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  {order.user?.username ||
                    order.shippingAddress?.fullName ||
                    "Customer"}
                </h4>

                <p className="mt-1 text-[13px] font-medium text-slate-500 dark:text-slate-400">
                  {order.items?.length > 0 ? (
                    <>{order.items[0].name || "Product"} {order.items.length > 1 && `+ ${order.items.length - 1} more`}</>
                  ) : (
                    "Order items"
                  )} • {formatDate(order.createdAt)}
                </p>
              </div>

              {/* Right */}
              <div className="flex items-center gap-6">
                <span
                  className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${actualStatusConfig[order.status]?.badgeBg || "bg-slate-200 dark:bg-slate-800"
                    } ${actualStatusConfig[order.status]?.badgeText || "text-slate-600 dark:text-slate-300"
                    }`}
                >
                  {order.status}
                </span>

                <span className="min-w-[110px] text-right text-lg font-bold text-slate-900 dark:text-white">
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