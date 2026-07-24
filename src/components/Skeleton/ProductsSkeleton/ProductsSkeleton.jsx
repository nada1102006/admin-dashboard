import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductsSkeleton = ({ baseColor, highlightColor }) => {
  return (
    <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-[1600px] space-y-6 lg:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-[28px] bg-white shadow-[0_2px_20px_rgba(0,0,0,0.02)] gap-4 border border-[#e0f7fc]/0 dark:bg-slate-900">
            <div className="flex items-center gap-5">
              <Skeleton circle width={60} height={60} />
              <div>
                <Skeleton width={150} height={14} className="mb-2" />
                <Skeleton width={180} height={32} />
              </div>
            </div>
            <Skeleton width={180} height={52} borderRadius={16} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col rounded-[28px] border border-slate-100 bg-white p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] dark:bg-slate-900 dark:border-slate-800"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                    <Skeleton circle width={24} height={24} />
                  </div>
                  <Skeleton width={80} height={32} className="mb-2" />
                  <Skeleton width={60} height={14} />
                </div>
              ))}
          </div>

          <div className="rounded-[28px] bg-white p-5 lg:p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Skeleton height={52} borderRadius={16} />
              </div>
              <div className="flex gap-3">
                <Skeleton width={120} height={52} borderRadius={16} />
                <Skeleton width={120} height={52} borderRadius={16} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="group relative flex flex-col overflow-hidden rounded-4xl border border-slate-100 bg-white shadow-[0_2px_20px_rgba(0,0,0,0.02)] dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="relative aspect-4/3 w-full shrink-0 overflow-hidden bg-slate-50 dark:bg-slate-950">
                    <Skeleton height="100%" />

                    <div className="absolute left-4 top-4 z-10">
                      <Skeleton width={90} height={30} borderRadius={9999} />
                    </div>

                    <div className="absolute bottom-4 right-4 z-10">
                      <Skeleton width={80} height={30} borderRadius={9999} />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col px-6 pb-6 pt-5 dark:bg-slate-900">
                    <Skeleton width="80%" height={24} className="mb-2" />
                    <Skeleton width="60%" height={14} className="mb-3" />
                    <Skeleton width="90%" height={16} className="mb-4" />

                    <div className="mt-auto pt-5">
                      <div className="flex items-baseline gap-2">
                        <Skeleton width={100} height={32} />
                        <Skeleton width={80} height={20} />
                      </div>

                      <div className="mt-3.5 flex flex-wrap gap-2">
                        <Skeleton width={60} height={28} borderRadius={12} />
                        <Skeleton width={70} height={28} borderRadius={12} />
                        <Skeleton width={50} height={28} borderRadius={12} />
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                      <div className="flex flex-wrap gap-2">
                        <Skeleton width={80} height={36} borderRadius={14} />
                        <Skeleton width={70} height={36} borderRadius={14} />
                        <Skeleton width={100} height={36} borderRadius={14} />
                      </div>
                      <Skeleton width={70} height={36} borderRadius={14} />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export { ProductsSkeleton };
