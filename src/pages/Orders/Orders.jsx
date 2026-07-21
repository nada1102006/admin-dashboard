import { useState, useMemo, useEffect } from "react";
import api from "../../api/api.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderSidebar from "../../components/OrderSidebar/OrderSidebar.jsx";
import Pagination from "../../components/Pagination/Pagination.jsx";
import { IoSearch } from "react-icons/io5";
import "react-loading-skeleton/dist/skeleton.css";
import {
  CounterSkeleton,
  TableSkeleton,
} from "../../components/Skeleton/OrderSkeleton/OrderSkeleton.jsx";

import useTheme from "../../components/customHook/useTheme";
import { useLanguage } from "../../Context/LanguageContext";
import { BiSolidError } from "react-icons/bi";
import { MdOutlineClear } from "react-icons/md";
import { FaHashtag } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import "./Orders.css";

function Orders() {
  const { t } = useLanguage();
  //  data
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [selectStatusOrder, setSelectStatusOrder] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [oldStatusOrder, setOldStatusOrder] = useState(null);
  const [oldNoteAdmin, setOldNoteAdmin] = useState(null);
  //  search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");

  //  pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  //    sidebar
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // dark mode or light mode by localstorage :
  const { isDarkMode } = useTheme();

  // دالة مساعدة لتنسيق الأرقام مع الفواصل
  const formatPrice = (price) => {
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  //  open slidebar
  const openOrderDetails = async (orderId) => {
    try {
      setIsSidebarOpen(true);
      setIsLoadingDetails(true);
      setSelectedOrder(null);

      const response = await api.get(`orders/admin/${orderId}`);
      console.log(" Order details:", response.data);
      setOldStatusOrder(response.data.order.status);
      setOldNoteAdmin(response.data.order.adminNote);

      if (response.data.success) {
        const orderData = response.data.order;

        const transformedOrder = {
          id: orderData._id,
          orderNumber: orderData._id.slice(-8).toUpperCase(),
          customer: orderData.user?.username || "—",
          email: orderData.user?.email || "—",
          date: new Date(orderData.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          status:
            orderData.status.charAt(0).toUpperCase() +
            orderData.status.slice(1),
          statusColor: getStatusColor(orderData.status),
          payment:
            orderData.paymentStatus.charAt(0).toUpperCase() +
            orderData.paymentStatus.slice(1),
          method: orderData.paymentMethod || "cash",
          total: `${formatPrice(orderData.totalPrice)} EGP`,
          raw: orderData,
        };

        setSelectedOrder(transformedOrder);
        setSelectStatusOrder(orderData.status);
        setAdminNote(orderData.adminNote || "");
      } else {
        console.error("Failed to fetch order details");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Error fetching order details");
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // close slidebar
  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setTimeout(() => {
      setSelectedOrder(null);
      setIsLoadingDetails(false);
      setSelectStatusOrder("");
      setAdminNote("");
      setIsUpdating(false);
    }, 300);
    document.body.style.overflow = "auto";
  };

  // color status
  const getStatusColor = (status) => {
    const statusColorMap = {
      pending: "amber",
      confirmed: "sky",
      processing: "violet",
      shipped: "cyan",
      delivered: "emerald",
      cancelled: "rose",
      returned: "orange",
    };
    return statusColorMap[status] || "amber";
  };

  //  update status order
  const updateOrderStatus = async () => {
    if (!selectedOrder || !selectStatusOrder) {
      console.error("Missing order or status");
      toast.error("Please select a status");
      return;
    }

    if (oldStatusOrder === selectStatusOrder && oldNoteAdmin == adminNote) {
      toast.warning("No changes made. Status is already set to this value");
      return; // الخروج من الدالة بدون محاولة التحديث
    }
    setIsUpdating(true);

    try {
      const updateData = {
        status: selectStatusOrder,
        adminNote: adminNote || selectStatusOrder + " via FedEx",
      };

      console.log("Updating order:", {
        orderId: selectedOrder.id,
        ...updateData,
      });

      const response = await api.patch(
        `orders/admin/${selectedOrder.id}/status`,
        updateData,
      );

      console.log("Order updated:", response.data);

      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === selectedOrder.id
              ? {
                  ...order,
                  status: selectStatusOrder,
                  adminNote: adminNote || selectStatusOrder + " via FedEx",
                  updatedAt: new Date().toISOString(),
                }
              : order,
          ),
        );

        setSelectedOrder((prev) => ({
          ...prev,
          status:
            selectStatusOrder.charAt(0).toUpperCase() +
            selectStatusOrder.slice(1),
          statusColor: getStatusColor(selectStatusOrder),
          raw: {
            ...prev.raw,
            status: selectStatusOrder,
            adminNote: adminNote || selectStatusOrder + " via FedEx",
          },
        }));

        setOldStatusOrder(selectStatusOrder);

        toast.info("Order status updated successfully!");

        setTimeout(() => {
          closeSidebar();
        }, 500);
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error(
        error.response?.data?.message || "Failed to update order status",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching orders...");

      const response = await api.get("orders/admin");
      console.log("Response received:", response.data);

      if (response.data.success) {
        setOrders(response.data.orders);
        setTotalOrders(response.data.total);
        console.log(`Loaded ${response.data.orders.length} orders`);
      } else {
        setError(response.data.message || "Failed to fetch orders");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  //orders processing
  const transformedOrders = useMemo(() => {
    return orders.map((order) => {
      let customerName = "—";
      let customerEmail = "—";

      if (order.user) {
        customerName = order.user.username || "—";
        customerEmail = order.user.email || "—";
      } else if (order.shippingAddress) {
        customerName = order.shippingAddress.fullName || "—";
      }

      const statusMap = {
        pending: "Pending",
        confirmed: "Confirmed",
        processing: "Processing",
        shipped: "Shipped",
        delivered: "Delivered",
        cancelled: "Cancelled",
        returned: "Returned",
      };

      const paymentStatusMap = {
        pending: "Pending",
        paid: "Paid",
        failed: "Failed",
      };

      const statusColorMap = {
        pending: "amber",
        confirmed: "sky",
        processing: "violet",
        shipped: "cyan",
        delivered: "emerald",
        cancelled: "rose",
        returned: "orange",
      };

      const date = new Date(order.createdAt);
      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      return {
        id: order._id,
        orderNumber: order._id.slice(-8).toUpperCase(),
        customer: customerName,
        email: customerEmail,
        date: formattedDate,
        status: statusMap[order.status] || order.status,
        statusColor: statusColorMap[order.status] || "amber",
        payment: paymentStatusMap[order.paymentStatus] || order.paymentStatus,
        method: order.paymentMethod || "cash",
        total: `${formatPrice(order.totalPrice)} EGP`,
        raw: order,
      };
    });
  }, [orders]);

  //  filters
  const filteredOrders = useMemo(() => {
    return transformedOrders.filter((order) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        searchTerm === "" ||
        order.orderNumber.toLowerCase().includes(searchLower) ||
        order.customer.toLowerCase().includes(searchLower) ||
        order.email.toLowerCase().includes(searchLower);

      const matchesStatus =
        statusFilter === "" ||
        order.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesPayment =
        paymentFilter === "" ||
        order.payment.toLowerCase() === paymentFilter.toLowerCase();

      const matchesMethod =
        methodFilter === "" ||
        order.method.toLowerCase() === methodFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesPayment && matchesMethod;
    });
  }, [
    searchTerm,
    statusFilter,
    paymentFilter,
    methodFilter,
    transformedOrders,
  ]);

  //  pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFilterChange = (setter, value) => {
    setter(value);
    setCurrentPage(1);
  };

  //  status colors
  const getStatusColors = (status, color) => {
    const colors = {
      rose: "bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 ring-rose-300/40",
      violet:
        "bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 ring-violet-300/40",
      amber:
        "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 ring-amber-300/40",
      orange:
        "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 ring-orange-300/40",
      sky: "bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 ring-sky-300/40",
      cyan: "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 ring-cyan-300/40",
      emerald:
        "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 ring-emerald-300/40",
    };
    return colors[color] || colors.amber;
  };
  // status dot colors
  const getStatusDot = (color) => {
    const dots = {
      rose: "text-rose-400",
      violet: "text-violet-400",
      amber: "text-amber-400",
      orange: "text-orange-400",
      sky: "text-sky-400",
      cyan: "text-cyan-400",
      emerald: "text-emerald-400",
    };
    return dots[color] || "text-amber-400";
  };

  // loader skeleton colors :
  const skeletonBaseColor = isDarkMode ? "#1e293b" : "#e2e8f0";
  const skeletonHighlightColor = isDarkMode ? "#334155" : "#f1f5f9";

  //  error state if network error or api (/orders/admin)
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-xl font-bold flex gap-2 items-center justify-center text-sm md:text-lg">
            <BiSolidError />
            Error
          </p>
          <p className="text-sm md:text-lg">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-4 px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-xs sm:text-sm md:text-md "
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className=" orders bg-slate-50 dark:bg-slate-900">
      <div className=" px-5 py-8 min-[350px]:py-16 min-[500px]:px-10">
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="custom-toast-container"
        />
        <div className="TranslateYMain">
          {/* headers start */}
          <div className="flex flex-wrap justify-between items-center gap-5 pb-5">
            <div>
              <p className="text-slate-500 text-[8.5px] min-[870px]:text-[10px] font-bold uppercase tracking-[2px]">
                {t("orders.adminManagement")}
              </p>
              <h1 className="mt-2  text-md min-[870px]:text-2xl capitalize font-bold tracking-[1px] text-slate-900 dark:text-white">
                {t("orders.title")}
              </h1>
            </div>
            <div className="flex items-center justify-center gap-1.5 rounded-md min-[870px]:rounded-xl border border-slate-100 bg-white px-2 py-1 min-[870px]:px-3 min-[870px]:py-2 dark:border-slate-800 dark:bg-slate-900">
              <span className="text-sm min-[870px]:text-2xl font-bold text-slate-900 dark:text-white">
                {loading ? (
                  <CounterSkeleton
                    baseColor={skeletonBaseColor}
                    highlightColor={skeletonHighlightColor}
                  />
                ) : (
                  filteredOrders.length
                )}
              </span>
              <span className="text-[10px] min-[870px]:text-sm text-slate-400 capitalize">
                {t("orders.totalOrders")}
              </span>
            </div>
          </div>
          {/* headers end */}

          {/* filter start */}
          <div className="flex flex-wrap items-center gap-3 pb-5">
            <div className="relative min-w-[120px] min-[870px]:min-w-[200px] flex-1">
              <IoSearch className="cursor-pointer-none absolute top-[50%] translate-y-[-50%] left-3 text-slate-400 text-sm min-[870px]:text-md" />
              <input
                type="search"
                placeholder={t("orders.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) =>
                  handleFilterChange(setSearchTerm, e.target.value)
                }
                className="h-8 min-[870px]:h-10 w-full rounded-md min-[870px]:rounded-lg border border-slate-200 bg-white pl-8 pr-2 text-[10px] min-[870px]:text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                handleFilterChange(setStatusFilter, e.target.value)
              }
              className="h-8 min-[870px]:h-10 rounded-md min-[870px]:rounded-lg border border-slate-200 bg-white px-3 text-[10px] min-[870px]:text-sm text-slate-700 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="">{t("orders.allStatuses")}</option>
              <option value="pending">{t("status.pending")}</option>
              <option value="confirmed">{t("status.confirmed")}</option>
              <option value="processing">{t("status.processing")}</option>
              <option value="shipped">{t("status.shipped")}</option>
              <option value="delivered">{t("status.delivered")}</option>
              <option value="cancelled">{t("status.cancelled")}</option>
              <option value="returned">{t("status.returned")}</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) =>
                handleFilterChange(setPaymentFilter, e.target.value)
              }
              className="h-8 min-[870px]:h-10 rounded-md min-[870px]:rounded-lg border border-slate-200 bg-white px-3 text-[10px] min-[870px]:text-sm text-slate-700 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="">{t("orders.allPayments")}</option>
              <option value="pending">{t("common.pending")}</option>
              <option value="paid">{t("common.paid")}</option>
              <option value="failed">{t("common.failed")}</option>
            </select>

            <select
              value={methodFilter}
              onChange={(e) =>
                handleFilterChange(setMethodFilter, e.target.value)
              }
              className="h-8 min-[870px]:h-10 rounded-md min-[870px]:rounded-lg border border-slate-200 bg-white px-3 text-[10px] min-[870px]:text-sm text-slate-700 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="">{t("orders.allMethods")}</option>
              <option value="cash">{t("common.cash")}</option>
              <option value="stripe">{t("common.stripe")}</option>
            </select>

            {(searchTerm || statusFilter || paymentFilter || methodFilter) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("");
                  setPaymentFilter("");
                  setMethodFilter("");
                  setCurrentPage(1);
                }}
                className="flex justify-center items-center gap-1  h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                <MdOutlineClear className=" text-md md:text-lg" /> {t("orders.clearFilters")}
              </button>
            )}
          </div>
          {/* filter end */}

          {/* loader Skeleton -> أثناء التحميل الطلبات من السيرفر يظهر  */}
          {loading ? (
            <TableSkeleton
              baseColor={skeletonBaseColor}
              highlightColor={skeletonHighlightColor}
            />
          ) : (
            <div className="overflow-hidden rounded-lg min-[870px]:rounded-xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/90 dark:border-slate-800 dark:bg-slate-800/55">
                      <th className="px-4 py-3  min-[870px]:p-5 text-left text-[9px] min-[870px]:text-[11px] font-bold uppercase tracking-widest text-slate-400 ">
                        {t("orders.order")}
                      </th>
                      <th className="px-4 py-3  min-[870px]:p-5 text-left text-[9px] min-[870px]:text-[11px] font-bold uppercase tracking-widest text-slate-400 ">
                        {t("orders.customer")}
                      </th>
                      <th className="px-4 py-3  min-[870px]:p-5 text-left text-[9px] min-[870px]:text-[11px] font-bold uppercase tracking-widest text-slate-400 ">
                        {t("orders.date")}
                      </th>
                      <th className="px-4 py-3  min-[870px]:p-5 text-left text-[9px] min-[870px]:text-[11px] font-bold uppercase tracking-widest text-slate-400 ">
                        {t("orders.status")}
                      </th>
                      <th className="px-4 py-3  min-[870px]:p-5 text-left text-[9px] min-[870px]:text-[11px] font-bold uppercase tracking-widest text-slate-400 ">
                        {t("orders.payment")}
                      </th>
                      <th className="px-4 py-3  min-[870px]:p-5 text-left text-[9px] min-[870px]:text-[11px] font-bold uppercase tracking-widest text-slate-400 ">
                        {t("orders.total")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrders.length > 0 ? (
                      currentOrders.map((order, index) => (
                        <tr
                          key={index}
                          onClick={() => openOrderDetails(order.id)}
                          className="group opacity-100 transform-none cursor-pointer border-b border-slate-100 transition-colors  hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40"
                        >
                          <td className="px-3 py-1  min-[870px]:p-5">
                            <span className="flex items-center gap-0 text-[10px] min-[870px]:text-xs font-bold text-slate-500 dark:text-slate-400">
                              <FaHashtag />
                              {order.orderNumber}
                            </span>
                          </td>
                          <td className="px-3 py-1  min-[870px]:p-5">
                            <div className="flex items-center gap-2">
                              <span className="flex items-center justify-center text-[10px] min-[870px]:text-[13px] w-7  h-6  min-[870px]:h-7 min-[870px]:w-9  rounded-full bg-slate-100  font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                                {order.customer !== "—"
                                  ? order.customer.charAt(0).toUpperCase()
                                  : "U"}
                              </span>
                              <div className="w-full">
                                <p className="font-semibold text-[10px] min-[870px]:text-xs text-slate-800 dark:text-slate-100">
                                  {order.customer}
                                </p>
                                <p className=" text-[10px] min-[870px]:text-xs text-slate-400">
                                  {order.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-5 text-[10px] min-[870px]:text-xs text-slate-400 text-nowrap">
                            {order.date}
                          </td>
                          <td className="px-3 py-1  min-[870px]:p-5">
                            <span
                              className={`inline-flex w-max items-center justify-start gap-0.5 min-[870px]:gap-1 rounded-full ring-1  font-medium px-2 py-1 min-[870px]:px-2.5 min-[870px]:py-1.5  text-[8px] min-[870px]:text-[11px] ${getStatusColors(order.status, order.statusColor)}`}
                            >
                              <GoDotFill
                                className={`text-xs min-[870px]:text-sm ${getStatusDot(order.statusColor)}`}
                              />
                              {t(`status.${order.raw?.status}`) || order.status}
                            </span>
                          </td>
                          <td className="px-3 py-1  min-[870px]:p-5">
                            <div className="flex flex-col justify-center gap-1.5">
                              <span className="inline-flex w-max items-center rounded-md px-2.5 py-1 min-[870px]:px-3.5 min-[870px]:py-1.5 text-[8px]  min-[870px]:text-[11px] font-semibold uppercase  bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                                {t(`common.${order.raw?.paymentStatus}`) || order.payment}
                              </span>
                              <span className="text-[8px] min-[870px]:text-[11px] capitalize text-slate-400">
                                {t(`common.${order.raw?.paymentMethod}`) || order.method}
                              </span>
                            </div>
                          </td>
                          <td className="p-5 text-[10px] min-[870px]:text-sm font-semibold  text-slate-800 dark:text-slate-100 text-nowrap">
                            {order.total}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-4 py-8 text-center text-sm text-slate-500"
                        >
                          {t("orders.noOrders")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* pagination */}
              {filteredOrders.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  goToPage={goToPage}
                  nextPage={nextPage}
                  prevPage={prevPage}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* sidebar */}
      <OrderSidebar
        isSidebarOpen={isSidebarOpen}
        closeSidebar={closeSidebar}
        isLoadingDetails={isLoadingDetails}
        selectedOrder={selectedOrder}
        selectStatusOrder={selectStatusOrder}
        setSelectStatusOrder={setSelectStatusOrder}
        adminNote={adminNote}
        setAdminNote={setAdminNote}
        isUpdating={isUpdating}
        updateOrderStatus={updateOrderStatus}
        getStatusColors={getStatusColors}
        getStatusDot={getStatusDot}
        formatPrice={formatPrice}
      />
    </section>
  );
}

export default Orders;
