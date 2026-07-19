import { LuDot, LuLoaderCircle } from "react-icons/lu";
import { FaHashtag } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import { GoDotFill } from "react-icons/go";
import { FiMinus } from "react-icons/fi";
import { TbReorder } from "react-icons/tb";
import { useLanguage } from "../../Context/LanguageContext";

function OrderSidebar({
  isSidebarOpen,
  closeSidebar,
  isLoadingDetails,
  selectedOrder,
  selectStatusOrder,
  setSelectStatusOrder,
  adminNote,
  setAdminNote,
  isUpdating,
  updateOrderStatus,
  getStatusColors,
  getStatusDot,
  formatPrice,
}) {
  const { t } = useLanguage();
  return (
    <>
      {/* background */}
      <div
        className={`fixed inset-0 z-30 bg-black/25 backdrop-blur-[2px] transition-opacity duration-300 ease-in-out ${
          isSidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSidebar}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 right-0 z-40 flex flex-col w-[100%] min-[300px]:w-[70%] min-[500px]:w-[55%] min-[850px]:w-[50%] min-[900px]:w-[45%] min-[1200px]:w-[40%]  bg-white shadow-2xl dark:bg-slate-900 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-3 py-6 min-[850px]:p-6 dark:border-slate-800">
          <div>
            <p className="mb-1.5 text-xs min-[850px]:text-sm font-semibold uppercase tracking-widest text-slate-400">
              Order detail
            </p>
            <p className="flex items-center gap-0 text-xs min-[850px]:text-sm font-bold text-slate-800 dark:text-slate-100">
              {selectedOrder?.orderNumber && (
                <>
                  <FaHashtag />
                  {selectedOrder?.orderNumber}
                </>
              )}
            </p>
          </div>
          <button
            onClick={() => closeSidebar()}
            className="flex h-8 w-8 text-xl min-[850px]:text-2xl items-center justify-center rounded-lg text-slate-400 transition duration-300 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Close"
          >
            <IoCloseSharp />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 min-[850px]:p-5">
          {isLoadingDetails ? (
            <div className="flex h-full items-center justify-center">
              <div className=" flex flex-col justify-center items-center">
                <LuLoaderCircle className="animate-spin text-slate-300 text-3xl min-[850px]:text-5xl" />
                <p className="mt-4 text-slate-500 capitalize text-center">
                  Loading order details...
                </p>
              </div>
            </div>
          ) : selectedOrder ? (
            <div className="space-y-5">
              {/* status & payment */}
              <div className="flex flex-wrap items-center gap-3 pb-2">
                <span
                  className={`flex items-center justify-center gap-0.5 rounded-full ring-1 font-medium px-3 py-1 text-[10px] min-[850px]:text-xs ${getStatusColors(selectedOrder.raw.status, selectedOrder.statusColor)}`}
                >
                  <GoDotFill
                    className={`text-xs min-[850px]:text-sm ${getStatusDot(selectedOrder.statusColor)}`}
                  />
                  {selectedOrder.status}
                </span>
                <span className="inline-flex items-center rounded-md px-3 py-1.5 text-[10px] min-[850px]:text-xs font-semibold uppercase  bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                  {selectedOrder.payment}
                </span>
                <span className="ml-auto  min-[218px]:ml-0 min-[255px]:ml-auto text-[10px] min-[850px]:text-xs capitalize text-slate-400">
                  {selectedOrder.method}
                </span>
              </div>

              {/* info */}
              <div className="mb-5">
                <p className="mb-3 text-[9px]  min-[850px]:text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  Info
                </p>
                <div className="rounded-xl border border-slate-100 px-4 min-[850px]:px-5 py-2 dark:border-slate-800">
                  <div className=" flex flex-wrap flex-col min-[270px]:flex-row  items-start justify-between gap-3 py-2.5 text-xs min-[850px]:text-sm border-b border-slate-100 dark:border-slate-800 ">
                    <span className=" text-slate-500 dark:text-slate-400">
                      Placed
                    </span>
                    <span className="text-right font-medium text-slate-800 dark:text-slate-100 text-xs min-[850px]:text-sm">
                      {selectedOrder.date}
                    </span>
                  </div>
                  <div className=" flex flex-wrap flex-col min-[270px]:flex-row items-start justify-between gap-3 py-2.5 text-xs min-[850px]:text-sm border-b border-slate-100 dark:border-slate-800 ">
                    <span className=" text-slate-500 dark:text-slate-400">
                      Customer
                    </span>
                    <span className="text-right font-medium text-slate-800 dark:text-slate-100 text-xs min-[850px]:text-sm">
                      {selectedOrder.customer}
                    </span>
                  </div>
                  <div className=" flex flex-wrap flex-col min-[270px]:flex-row items-start justify-between gap-3 py-2.5 text-xs min-[850px]:text-sm border-b border-slate-100 dark:border-slate-800 ">
                    <span className="text-slate-500 dark:text-slate-400">
                      Email
                    </span>
                    <span className="text-right font-medium text-slate-800 dark:text-slate-100 text-xs min-[850px]:text-sm">
                      {selectedOrder.email}
                    </span>
                  </div>
                  <div className=" flex flex-wrap flex-col min-[270px]:flex-row items-start justify-between gap-3 py-2.5 text-xs min-[850px]:text-sm border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <span className=" text-slate-500 dark:text-slate-400 ">
                      Ship to
                    </span>
                    <span className="text-right font-medium text-slate-800 dark:text-slate-100 text-xs min-[850px]:text-sm">
                      {selectedOrder.raw?.shippingAddress?.city || "—"},{" "}
                      {selectedOrder.raw?.shippingAddress?.country || "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* items */}
              <div className="mb-5">
                <p className="mb-3 text-[9px] min-[850px]:text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  Items
                </p>
                {selectedOrder.raw?.items?.map((item, index) => (
                  <div
                    key={index}
                    className="text-center min-[270px]:text-start flex flex-wrap flex-col min-[300px]:flex-row min-[387px]:flex-col min-[420px]:flex-row items-center justify-center min-[300px]:justify-start gap-3 rounded-xl border border-slate-100 px-3 py-4 dark:border-slate-800"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-9 w-9 min-[850px]:h-10 min-[850px]:w-10  rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="mb-1 text-[10px] min-[850px]:text-sm font-medium text-slate-800 dark:text-slate-100">
                        {item.name}
                      </p>
                      <p className=" text-[10px] min-[850px]:text-xs text-slate-400 flex items-center justify-center min-[300px]:justify-start min-[387px]:justify-center min-[420px]:justify-start gap-0.5">
                        <IoCloseSharp /> {item.quantity} <LuDot />{" "}
                        {formatPrice(item.price)} EGP
                      </p>
                    </div>
                    <span className="text-xs min-[850px]:text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {formatPrice(item.price * item.quantity)} EGP
                    </span>
                  </div>
                ))}
              </div>

              {/* totals */}
              <div className="mb-5 rounded-xl border border-slate-100 px-4 py-1 dark:border-slate-800">
                <div className="flex flex-wrap flex-col min-[270px]:flex-row items-start justify-between gap-3 py-2.5 text-xs min-[850px]:text-sm border-b border-slate-100 dark:border-slate-800">
                  <span className=" text-slate-500 dark:text-slate-400">
                    Subtotal
                  </span>
                  <span className="text-right font-medium text-slate-800 dark:text-slate-100">
                    {formatPrice(selectedOrder.raw?.subtotal || 0)} EGP
                  </span>
                </div>
                <div className="flex flex-wrap flex-col min-[270px]:flex-row items-start justify-between gap-3 py-2.5 text-xs min-[850px]:text-sm border-b border-slate-100 dark:border-slate-800 ">
                  <span className=" text-slate-500 dark:text-slate-400">
                    Shipping
                  </span>
                  <span className="text-right font-medium text-slate-800 dark:text-slate-100">
                    {formatPrice(selectedOrder.raw?.shippingFee || 0)} EGP
                  </span>
                </div>
                <div className="flex flex-wrap flex-col min-[270px]:flex-row items-start justify-between gap-3 py-2.5 text-xs min-[850px]:text-sm border-b border-slate-100 dark:border-slate-800 ">
                  <span className=" text-slate-500 dark:text-slate-400">
                    Tax (14%)
                  </span>
                  <span className="text-right font-medium text-slate-800 dark:text-slate-100">
                    {formatPrice(selectedOrder.raw?.tax || 0)} EGP
                  </span>
                </div>
                {selectedOrder.raw?.discount > 0 && (
                  <div className="flex flex-wrap flex-col min-[270px]:flex-row items-start justify-between gap-3 py-2.5 text-xs min-[850px]:text-sm border-b border-slate-100 dark:border-slate-800 ">
                    <span className=" text-slate-500 dark:text-slate-400">
                      Discount
                    </span>
                    <span className="flex items-center text-right font-medium text-green-600 dark:text-green-400">
                      <FiMinus />
                      {formatPrice(selectedOrder.raw?.discount || 0)} EGP
                    </span>
                  </div>
                )}
                <div className="flex flex-wrap flex-col min-[270px]:flex-row items-start min-[270px]:items-center justify-between py-3 text-xs min-[850px]:text-sm font-bold text-slate-900 dark:text-white">
                  <span>Total</span>
                  <span className="text-xs min-[850px]:text-sm">
                    {selectedOrder.total}
                  </span>
                </div>
              </div>

              {/* Customer Note */}
              {selectedOrder.raw?.customerNote && (
                <div className="mb-5 ">
                  <p className="mb-3 text-[9px] min-[850px]:text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    Customer Note
                  </p>
                  <div className="rounded-lg min-[850px]:rounded-xl border border-slate-100 px-4 py-3 dark:border-slate-800">
                    <p className="text-xs min-[850px]:text-sm text-slate-700 dark:text-slate-300">
                      {selectedOrder.raw.customerNote}
                    </p>
                  </div>
                </div>
              )}

              {/* update status */}
              <div className="mb-5">
                <p className="mb-3 text-[9px] min-[850px]:text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  Update status
                </p>
                <div className="space-y-3 rounded-lg min-[850px]:rounded-xl border border-slate-100 p-3 min-[850px]:p-4 dark:border-slate-800">
                  <select
                    value={selectStatusOrder}
                    onChange={(e) => setSelectStatusOrder(e.target.value)}
                    disabled={isUpdating}
                    className="w-full rounded-md min-[850px]:rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs min-[850px]:text-sm text-slate-800 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 disabled:opacity-50 "
                  >
                    <option value="pending">{t("common.pending")}</option>
                    <option value="confirmed">{t("common.confirmed")}</option>
                    <option value="processing">{t("common.processing")}</option>
                    <option value="shipped">{t("common.shipped")}</option>
                    <option value="delivered">{t("common.delivered")}</option>
                    <option value="cancelled">{t("common.cancelled")}</option>
                    <option value="returned">{t("common.returned")}</option>
                  </select>

                  <textarea
                    rows="3"
                    placeholder="Admin note (optional)…"
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    disabled={isUpdating}
                    className="w-full rounded-md min-[850px]:rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs min-[850px]:text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 disabled:opacity-50 resize-none"
                  />

                  <button
                    onClick={updateOrderStatus}
                    disabled={isUpdating || !selectStatusOrder}
                    className="w-full cursor-pointer rounded-md min-[850px]:rounded-lg bg-slate-900 py-1.5 min-[270px]:py-2.5 text-xs min-[850px]:text-sm font-semibold text-white transition duration-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 flex items-center justify-center gap-2"
                  >
                    {isUpdating ? (
                      <>
                        <LuLoaderCircle className="animate-spin" />
                        <span> Processing...</span>
                      </>
                    ) : (
                      <span> Save changes</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-slate-500 flex items-center justify-center gap-1 text-[10px] min-[250px]:text-[16px]">
                <TbReorder className="text-sm md:text-xl" />
                No order selected
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default OrderSidebar;