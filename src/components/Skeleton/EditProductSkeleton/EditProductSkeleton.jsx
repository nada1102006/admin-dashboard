// Components/Skeleton/EditProductSkeleton/EditProductSkeleton.jsx
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./EditProductSkeleton.css";

const EditProductSkeleton = ({ baseColor, highlightColor }) => {
  return (
    <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
      <main className="skeleton-edit-product p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 min-h-screen bg-slate-50/50 text-slate-900 mx-auto max-w-[1600px] dark:bg-slate-900">
        <div className="skeleton-header-wrapper relative overflow-hidden rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 p-8 shadow-lg">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Skeleton
                width={140}
                height={40}
                borderRadius={12}
                className="skeleton-back-btn"
              />

              <div className="mt-5 flex items-center gap-4">
                <Skeleton
                  width={56}
                  height={56}
                  borderRadius={16}
                  className="skeleton-icon"
                />
                <div>
                  <Skeleton
                    width={120}
                    height={14}
                    className="skeleton-badge mb-2"
                  />
                  <Skeleton
                    width={280}
                    height={40}
                    className="skeleton-title"
                  />
                </div>
              </div>
              <Skeleton
                width={400}
                height={20}
                className="skeleton-subtitle mt-4"
              />
            </div>

            <Skeleton
              width={200}
              height={80}
              borderRadius={16}
              className="skeleton-status-card"
            />
          </div>
        </div>

        <div className="grid gap-6 lg:gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="skeleton-gallery-section rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <Skeleton width={48} height={48} borderRadius={16} />
              <div>
                <Skeleton width={120} height={24} className="mb-1" />
                <Skeleton width={200} height={16} />
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden"
                >
                  <Skeleton height={192} borderRadius={0} />
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border-2 border-dashed border-cyan-500/30 dark:border-cyan-500/20 bg-cyan-50/50 dark:bg-slate-800/30 p-10">
              <div className="flex flex-col items-center justify-center">
                <Skeleton circle width={56} height={56} className="mb-4" />
                <Skeleton width={140} height={20} className="mb-2" />
                <Skeleton width={200} height={16} />
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-950/20 p-5">
              <Skeleton width={120} height={16} className="mb-2" />
              <Skeleton width={300} height={14} />
            </div>
          </section>

          <section className="skeleton-form-section rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 p-6 shadow-lg">
            <div className="grid gap-6">
              <div>
                <Skeleton width={120} height={14} className="mb-2" />
                <Skeleton height={56} borderRadius={16} />
              </div>

              <div>
                <Skeleton width={150} height={14} className="mb-2" />
                <Skeleton height={56} borderRadius={16} />
              </div>

              <div>
                <Skeleton width={120} height={14} className="mb-2" />
                <Skeleton height={120} borderRadius={16} />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Skeleton width={120} height={14} className="mb-2" />
                  <Skeleton height={56} borderRadius={16} />
                </div>
                <div>
                  <Skeleton width={140} height={14} className="mb-2" />
                  <Skeleton height={56} borderRadius={16} />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Skeleton width={100} height={14} className="mb-2" />
                  <Skeleton height={56} borderRadius={16} />
                </div>
                <div>
                  <Skeleton width={80} height={14} className="mb-2" />
                  <Skeleton height={56} borderRadius={16} />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Skeleton width={110} height={14} className="mb-2" />
                  <Skeleton height={56} borderRadius={16} />
                </div>
                <div>
                  <Skeleton width={130} height={14} className="mb-2" />
                  <Skeleton height={56} borderRadius={16} />
                </div>
              </div>

              <div>
                <Skeleton width={80} height={14} className="mb-2" />
                <Skeleton height={56} borderRadius={16} />
              </div>

              <div className="rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 p-6">
                <Skeleton width={80} height={14} className="mb-3" />
                <div className="flex gap-3">
                  <Skeleton height={56} className="flex-1" borderRadius={16} />
                  <Skeleton width={56} height={56} borderRadius={16} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Skeleton width={80} height={32} borderRadius={12} />
                  <Skeleton width={100} height={32} borderRadius={12} />
                  <Skeleton width={70} height={32} borderRadius={12} />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-2">
                <Skeleton width={160} height={56} borderRadius={16} />
                <Skeleton width={160} height={56} borderRadius={16} />
              </div>

              <div className="flex items-center justify-start gap-3 border-t border-slate-200/50 dark:border-slate-700/50 pt-6 mt-2">
                <Skeleton width={120} height={48} borderRadius={16} />
                <Skeleton width={160} height={48} borderRadius={16} />
              </div>
            </div>
          </section>
        </div>
      </main>
    </SkeletonTheme>
  );
};

export { EditProductSkeleton };
