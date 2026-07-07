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
export default function DashboardHome() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDashboard = async () => {
      try {
        const res = await api.get("/orders/admin/dashboard");
        setData(res.data.dashboard);
      } catch (err) {
        console.log("Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };

    getDashboard();
  }, []);

  if (loading) {
    return <h2 className="loading">Loading...</h2>;
  }

const cards = [
  {
    title: "Total Orders",
    value: data?.orders?.total || 0,
    icon: <FaShoppingBag />,
    color: "#4F46E5",
    bg: "#EEF2FF",
  },
  {
    title: "Pending Orders",
    value: data?.orders?.pending || 0,
    icon: <FaClock />,
    color: "#F59E0B",
    bg: "#FEF3C7",
  },
  {
    title: "Revenue",
    value: `$${data?.revenue?.total || 0}`,
    icon: <FaDollarSign />,
    color: "#10B981",
    bg: "#D1FAE5",
  },
  {
    title: "This Month",
    value: `$${data?.revenue?.lastMonth || 0}`,
    icon: <FaChartLine />,
    color: "#EC4899",
    bg: "#FCE7F3",
  },
  {
    title: "Users",
    value: data?.totalCustomers || 0 ,
    icon: <FaUsers />,
    color: "#3B82F6",
    bg: "#DBEAFE",
  },
  {
    title: "Top Product",
    value: data?.topProducts?.[0]?.totalSold || 0,
    icon: <FaBoxOpen />,
    color: "#8B5CF6",
    bg: "#EDE9FE",
  },
];

return (
  <section className="dashboard">

    <div className="dashboard-header">
      <h1>Admin Overview</h1>
      <p>Monitor your store performance.</p>
    </div>

    <div className="cards-grid">
  {cards.map((card, index) => (
   <div
  className="card"
  key={index}
  style={{ background: card.bg }}
>
      <div
        className="card-icon"
        style={{ background: card.color }}
      >
        {card.icon}
      </div>

      <h4>{card.title}</h4>

      <h2>{card.value}</h2>
    </div>
  ))}
</div>

    <div className="bottom-section">
   <div className="best-seller">

  <h3>Best Seller</h3>

  {data?.topProducts?.map((product, index) => (
    <div className="product-item" key={index}>

      <img
        src={product.image}
        alt={product.name}
      />

      <div>
        <h4>{product.name}</h4>
        <p>{product.totalSold} Sold</p>
      </div>

    </div>
  ))}

</div>

    </div>

  </section>
)};
