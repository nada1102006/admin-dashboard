import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./CartsSkeleton.css";

const CartsSkeleton = ({ baseColor, highlightColor }) => {
  return (
    <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
      <div className="skeleton-carts-container cart-container p-4 lg:p-8 min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900">
        <div className="cart-main space-y-6">
          <div className="skeleton-cart-header cart-header rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl dark:bg-slate-900">
            <Skeleton
              width={80}
              height={14}
              className="skeleton-loading mb-2"
            />
            <Skeleton
              width={200}
              height={28}
              className="skeleton-loading skeleton-header-title mb-2"
            />
            <Skeleton
              width={350}
              height={16}
              className="skeleton-loading skeleton-header-subtitle"
            />
          </div>

          <div className="skeleton-grid cart-empty grid gap-6 xl:grid-cols-2">
            <div className="skeleton-empty-state rounded-3xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-700">
              <Skeleton width={200} height={20} className="skeleton-loading" />
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export { CartsSkeleton };
