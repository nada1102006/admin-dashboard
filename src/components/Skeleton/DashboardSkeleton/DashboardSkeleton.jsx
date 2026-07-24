import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./DashboardSkeleton.css";

const CardsSkeleton = ({ baseColor, highlightColor }) => {
  const cards = Array(6).fill(null);

  const content = (
    <div className="cards-grid">
      {cards.map((_, index) => (
        <div
          key={index}
          className="card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm"
        >
          <div className="card-icon skeleton-card-icon-wrapper">
            <Skeleton
              circle
              width={48}
              height={48}
              className="skeleton-card-icon"
            />
          </div>

          <h4 className="mt-4">
            <Skeleton width={100} height={14} />
          </h4>

          <h2 className="mt-2">
            <Skeleton width={120} height={28} />
          </h2>

          <p className="dash-card-caption mt-2">
            <Skeleton width={80} height={12} />
          </p>
        </div>
      ))}
    </div>
  );

  if (baseColor && highlightColor) {
    return (
      <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
        {content}
      </SkeletonTheme>
    );
  }

  return content;
};

const OrderStatusSkeleton = ({ baseColor, highlightColor }) => {
  const statuses = [
    "pending",
    "processing",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ];

  const content = (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl min-h-[520px] dark:border-slate-800 dark:bg-slate-900/90">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Skeleton width={150} height={14} className="mb-2" />
          <Skeleton width={200} height={24} />
        </div>
        <Skeleton width={120} height={32} borderRadius={9999} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statuses.map((status) => (
          <div
            key={status}
            className="border rounded-[22px] p-6 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
          >
            <Skeleton width={80} height={14} className="mb-3" />
            <Skeleton width={60} height={32} />
          </div>
        ))}
      </div>
    </div>
  );

  if (baseColor && highlightColor) {
    return (
      <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
        {content}
      </SkeletonTheme>
    );
  }

  return content;
};

const BestSellerSkeleton = ({ baseColor, highlightColor }) => {
  const products = Array(4).fill(null);

  const content = (
    <div className="best-seller bg-white/90 rounded-3xl border border-slate-200 p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900/90">
      <Skeleton width={120} height={20} className="mb-6" />

      {products.map((_, index) => (
        <div
          key={index}
          className="product-item bg-white/90 rounded-2xl border border-slate-200 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 mb-3 last:mb-0"
        >
          <div className="flex items-center gap-4">
            <Skeleton width={60} height={60} borderRadius={12} />
            <div className="flex-1">
              <Skeleton width={140} height={16} className="mb-2" />
              <Skeleton width={80} height={14} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (baseColor && highlightColor) {
    return (
      <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
        {content}
      </SkeletonTheme>
    );
  }

  return content;
};

const RecentOrdersSkeleton = ({ baseColor, highlightColor }) => {
  const orders = Array(5).fill(null);

  const content = (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900/90">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Skeleton width={150} height={14} className="mb-2" />
          <Skeleton width={200} height={24} />
        </div>
        <Skeleton width={100} height={32} borderRadius={9999} />
      </div>

      <div className="space-y-4">
        {orders.map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-3xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 px-6 py-5"
          >
            <div className="flex-1">
              <Skeleton width={160} height={20} className="mb-2" />
              <Skeleton width={200} height={14} />
            </div>
            <div className="flex items-center gap-6">
              <Skeleton width={80} height={28} borderRadius={9999} />
              <Skeleton width={110} height={24} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (baseColor && highlightColor) {
    return (
      <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
        {content}
      </SkeletonTheme>
    );
  }

  return content;
};

const DashboardSkeleton = ({ baseColor, highlightColor }) => {
  const content = (
    <section className="dashboard bg-slate-100  dark:bg-slate-900">
      <div className="dashboard-header bg-slate-50  dark:bg-slate-900">
        <Skeleton width={150} height={14} className="mb-2" />
        <Skeleton width={300} height={28} className="mb-2" />
        <Skeleton width={400} height={20} />
      </div>

      <CardsSkeleton baseColor={baseColor} highlightColor={highlightColor} />

      <div className="bottom-section grid gap-8 xl:grid-cols-[2fr_1fr] items-start">
        <OrderStatusSkeleton
          baseColor={baseColor}
          highlightColor={highlightColor}
        />
        <BestSellerSkeleton
          baseColor={baseColor}
          highlightColor={highlightColor}
        />
      </div>

      <RecentOrdersSkeleton
        baseColor={baseColor}
        highlightColor={highlightColor}
      />
    </section>
  );

  if (baseColor && highlightColor) {
    return (
      <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
        {content}
      </SkeletonTheme>
    );
  }

  return content;
};

export {
  DashboardSkeleton,
  CardsSkeleton,
  OrderStatusSkeleton,
  BestSellerSkeleton,
  RecentOrdersSkeleton,
};
