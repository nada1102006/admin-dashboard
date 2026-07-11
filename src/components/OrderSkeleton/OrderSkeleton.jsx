import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./OrderSkeleton.css";

//  skeleton loading for table
const TableSkeleton = ({ baseColor, highlightColor }) => {
  const skeletonRows = 8;

  const content = (
    <div className="overflow-hidden rounded-lg min-[870px]:rounded-xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/90 dark:border-slate-800 dark:bg-slate-800/55">
              <th className="px-4 py-3  min-[870px]:p-5 text-left text-[9px] min-[870px]:text-[11px] font-bold uppercase tracking-widest text-slate-400 ">
                Order
              </th>
              <th className="px-4 py-3  min-[870px]:p-5 text-left text-[9px] min-[870px]:text-[11px] font-bold uppercase tracking-widest text-slate-400 ">
                Customer
              </th>
              <th className="px-4 py-3  min-[870px]:p-5 text-left text-[9px] min-[870px]:text-[11px] font-bold uppercase tracking-widest text-slate-400 ">
                Date
              </th>
              <th className="px-4 py-3  min-[870px]:p-5 text-left text-[9px] min-[870px]:text-[11px] font-bold uppercase tracking-widest text-slate-400 ">
                Status
              </th>
              <th className="px-4 py-3  min-[870px]:p-5 text-left text-[9px] min-[870px]:text-[11px] font-bold uppercase tracking-widest text-slate-400 ">
                Payment
              </th>
              <th className="px-4 py-3  min-[870px]:p-5 text-left text-[9px] min-[870px]:text-[11px] font-bold uppercase tracking-widest text-slate-400 ">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(skeletonRows)].map((_, index) => (
              <tr
                key={index}
                className="group opacity-100 transform-none cursor-pointer border-b border-slate-100 transition-colors  hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40"
              >
                {/* order id */}
                <td className="px-3 py-1  min-[870px]:p-5">
                  <Skeleton
                    width={60}
                    height={16}
                    className="skeleton-order-id"
                  />
                </td>

                {/* customer */}
                <td className="px-3 py-1  min-[870px]:p-5">
                  <div className="flex items-center gap-1.5 min-[870px]:gap-2.5">
                    <Skeleton
                      circle
                      width={32}
                      height={32}
                      className="skeleton-avatar"
                    />
                    <div className="space-y-1 min-[870px]:space-y-1.5">
                      <Skeleton
                        width={96}
                        height={16}
                        className="skeleton-name"
                      />
                      <Skeleton
                        width={128}
                        height={12}
                        className="skeleton-email"
                      />
                    </div>
                  </div>
                </td>

                {/* date */}
                <td className="px-3 py-1  min-[870px]:p-5">
                  <Skeleton width={80} height={16} className="skeleton-date" />
                </td>

                {/* status */}
                <td className="px-3 py-1  min-[870px]:p-5">
                  <Skeleton
                    width={80}
                    height={24}
                    borderRadius={9999}
                    className="skeleton-status"
                  />
                </td>

                {/* payment */}
                <td className="px-3 py-1  min-[870px]:p-5">
                  <div className="space-y-1 min-[870px]:space-y-1.5">
                    <Skeleton
                      width={56}
                      height={16}
                      className="skeleton-payment-method"
                    />
                    <Skeleton
                      width={40}
                      height={12}
                      className="skeleton-payment-status"
                    />
                  </div>
                </td>

                {/* total */}
                <td className="px-3 py-1  min-[870px]:p-5">
                  <Skeleton width={80} height={16} className="skeleton-total" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // SkeletonTheme color
  if (baseColor && highlightColor) {
    return (
      <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
        {content}
      </SkeletonTheme>
    );
  }

  return content;
};

// skeleton for counter orders
const CounterSkeleton = ({ baseColor, highlightColor }) => {
  const content = (
    <Skeleton width={30} height={28} inline className="skeleton-counter" />
  );

  // SkeletonTheme color
  if (baseColor && highlightColor) {
    return (
      <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
        {content}
      </SkeletonTheme>
    );
  }

  return content;
};

export { TableSkeleton, CounterSkeleton };
