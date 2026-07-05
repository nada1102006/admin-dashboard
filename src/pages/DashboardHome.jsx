import React, { useState, useEffect } from 'react';
import api from '../api/api';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const formatDate = (dateString) => {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateString));
};

const statusConfig = {
  pending: {
    label: 'PENDING',
    color: 'text-amber-400',
    bg: 'bg-amber-50/50',
    border: 'border-amber-200/60',
    badgeBg: 'bg-amber-100/50',
    badgeText: 'text-amber-500'
  },
  processing: {
  label: 'PROCESSING',
  color: 'text-blue-400',
  bg: 'bg-blue-50/50',
  border: 'border-blue-200/60',
  badgeBg: 'bg-emerald-100/50',
  badgeText: 'text-emerald-500'
},
};

const actualStatusConfig = {
  pending: {
    label: 'PENDING',
    color: 'text-amber-500',
    bg: 'bg-orange-50/60',
    border: 'border-orange-200/60',
    badgeBg: 'bg-amber-100/50',
    badgeText: 'text-amber-600'
  },
  processing: {
    label: 'PROCESSING',
    color: 'text-blue-400',
    bg: 'bg-blue-50/60',
    border: 'border-blue-200/60',
    badgeBg: 'bg-blue-100/50',
    badgeText: 'text-blue-600'
  },
  confirmed: {
    label: 'CONFIRMED',
    color: 'text-sky-400',
    bg: 'bg-sky-50/60',
    border: 'border-sky-200/60',
    badgeBg: 'bg-sky-100/50',
    badgeText: 'text-sky-600'
  },
  shipped: {
    label: 'SHIPPED',
    color: 'text-purple-400',
    bg: 'bg-purple-50/60',
    border: 'border-purple-200/60',
    badgeBg: 'bg-purple-100/50',
    badgeText: 'text-purple-600'
  },
  delivered: {
    label: 'DELIVERED',
    color: 'text-emerald-400',
    bg: 'bg-emerald-50/60',
    border: 'border-emerald-200/60',
    badgeBg: 'bg-emerald-100/50',
    badgeText: 'text-emerald-600'
  },
  cancelled: {
    label: 'CANCELLED',
    color: 'text-rose-400',
    bg: 'bg-rose-50/60',
    border: 'border-rose-200/60',
    badgeBg: 'bg-rose-100/50',
    badgeText: 'text-rose-600'
  }
};

export default function DashboardHome() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/orders/admin/dashboard', {
          withCredentials: true
        });
        if (response.data.success) {
          setData(response.data.dashboard);
        } else {
          throw new Error('API returned unsuccessful response');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl m-6">Error: {error}</div>;
  }

  if (!data) return null;

  return (
    <div className="p-6 bg-gray-50/50 min-h-screen font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* TOP SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* ORDER STATUS CARD (Left Half) */}
          <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="bg-gray-200 text-gray-600 tracking-[0.2em] text-[10px] px-2 py-1 uppercase rounded font-semibold">
                  Order Status
                </span>
                <h2 className="text-xl font-bold mt-3 text-gray-900">Live fulfillment breakdown</h2>
              </div>
              <span className="bg-emerald-50 text-emerald-400 text-xs px-3 py-1.5 rounded-full font-medium">
                Updated from API
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {['pending', 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(statusKey => {
                 const conf = actualStatusConfig[statusKey];
                 const count = data.orders?.[statusKey] || 0;
                 return (
                   <div key={statusKey} className={`${conf.bg} ${conf.border} border rounded-2xl p-4 sm:p-5 flex flex-col justify-center transition-transform hover:-translate-y-1 duration-200 cursor-default`}>
                     <div className={`${conf.color} text-[10px] sm:text-[11px] font-medium tracking-[0.2em] uppercase mb-3`}>{conf.label}</div>
                     <div className={`${conf.color} text-3xl sm:text-4xl font-light`}>{count}</div>
                   </div>
                 );
              })}
            </div>
          </div>
          
          {/* EMPTY SPACE (Right Half) */}
          <div className="hidden lg:block"></div>
        </div>

        {/* RECENT ORDERS CARD */}
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 p-8">
           <div className="flex justify-between items-start mb-8">
            <div>
              <span className="text-cyan-400 tracking-[0.2em] text-[11px] uppercase font-bold">
                Recent Orders
              </span>
              <h2 className="text-2xl font-bold mt-2 text-gray-900">Latest customer activity</h2>
            </div>
            <span className="bg-cyan-50 text-cyan-400 text-xs px-4 py-1.5 rounded-full font-medium">
              {data.recentOrders?.length || 0} orders
            </span>
          </div>

          <div className="space-y-4">
            {data.recentOrders?.map(order => (
              <div key={order._id} className="border border-gray-100 rounded-[1.25rem] p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:shadow-md transition-all duration-200 gap-4 bg-white">
                <div>
                  <div className="text-[15px] font-medium text-gray-900">{order.user?.username || order.shippingAddress?.fullName || 'Customer'}</div>
                  <div className="text-[13px] text-gray-500 mt-1">
                    {order.items?.[0]?.name} • {formatDate(order.createdAt)}
                  </div>
                </div>
                <div className="flex items-center gap-6">
                   <span className={`px-4 py-1.5 rounded-full text-[13px] font-medium ${actualStatusConfig[order.status]?.badgeBg || 'bg-gray-100'} ${actualStatusConfig[order.status]?.badgeText || 'text-gray-600'} lowercase`}>
                     {order.status}
                   </span>
                   <span className="text-[15px] font-medium text-gray-900 w-24 text-right">
                     {formatCurrency(order.totalPrice)}
                   </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}