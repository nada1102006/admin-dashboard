import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./AddProductSkeleton.css";

const AddProductSkeleton = ({ baseColor, highlightColor }) => {
  return (
    <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
      <main className="skeleton-add-product p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 min-h-screen bg-slate-50/50 text-slate-900 mx-auto max-w-[1600px] dark:bg-slate-950">
        <div className="skeleton-header relative overflow-hidden rounded-[32px] border border-slate-100 bg-white p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] dark:bg-slate-900 dark:border-slate-800">
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Skeleton
                width={160}
                height={40}
                borderRadius={9999}
                className="mb-4"
              />
              <div className="mt-5 flex items-center gap-4">
                <Skeleton width={56} height={56} borderRadius={16} />
                <div>
                  <Skeleton width={120} height={14} className="mb-2" />
                  <Skeleton
                    width={280}
                    height={36}
                    className="skeleton-header-title"
                  />
                </div>
              </div>
              <Skeleton
                width={400}
                height={20}
                className="skeleton-header-subtitle mt-4"
              />
            </div>
            <Skeleton width={200} height={80} borderRadius={16} />
          </div>
        </div>

        <div className="grid gap-6 lg:gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="skeleton-form-section rounded-[28px] border border-slate-100 bg-white p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <Skeleton width={48} height={48} borderRadius={16} />
              <div>
                <Skeleton width={120} height={24} className="mb-1" />
                <Skeleton width={200} height={16} />
              </div>
            </div>

            <div className="skeleton-gallery-upload mt-6 flex cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#00bad5]/30 bg-[#f2fbfe] p-10 text-center transition-all dark:bg-slate-900/50 dark:border-[#00bad5]/20">
              <Skeleton circle width={56} height={56} className="mb-4" />
              <Skeleton width={140} height={20} className="mb-2" />
              <Skeleton width={200} height={16} />
            </div>

            <div className="skeleton-tips mt-6 rounded-2xl border border-[#dcfce7] bg-[#f0fdf4] p-5 dark:bg-slate-900/50 dark:border-teal-900/50">
              <Skeleton width={120} height={16} className="mb-2" />
              <Skeleton width={300} height={14} />
            </div>
          </section>

          <section className="skeleton-form-section rounded-[28px] border border-slate-100 bg-white p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] dark:bg-slate-900 dark:border-slate-800">
            <div className="grid gap-6">
              {/* Name */}
              <div className="skeleton-form-field">
                <Skeleton width={120} height={14} className="mb-2" />
                <Skeleton
                  height={56}
                  borderRadius={16}
                  className="skeleton-input"
                />
              </div>

              <div className="skeleton-form-field">
                <Skeleton width={150} height={14} className="mb-2" />
                <Skeleton
                  height={56}
                  borderRadius={16}
                  className="skeleton-input"
                />
              </div>

              <div className="skeleton-form-field">
                <Skeleton width={120} height={14} className="mb-2" />
                <Skeleton
                  height={120}
                  borderRadius={16}
                  className="skeleton-textarea"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="skeleton-form-field">
                  <Skeleton width={120} height={14} className="mb-2" />
                  <Skeleton
                    height={56}
                    borderRadius={16}
                    className="skeleton-input"
                  />
                </div>
                <div className="skeleton-form-field">
                  <Skeleton width={140} height={14} className="mb-2" />
                  <Skeleton
                    height={56}
                    borderRadius={16}
                    className="skeleton-input"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="skeleton-form-field">
                  <Skeleton width={100} height={14} className="mb-2" />
                  <Skeleton
                    height={56}
                    borderRadius={16}
                    className="skeleton-input"
                  />
                </div>
                <div className="skeleton-form-field">
                  <Skeleton width={80} height={14} className="mb-2" />
                  <Skeleton
                    height={56}
                    borderRadius={16}
                    className="skeleton-input"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="skeleton-form-field">
                  <Skeleton width={110} height={14} className="mb-2" />
                  <Skeleton
                    height={56}
                    borderRadius={16}
                    className="skeleton-select"
                  />
                </div>
                <div className="skeleton-form-field">
                  <Skeleton width={130} height={14} className="mb-2" />
                  <Skeleton
                    height={56}
                    borderRadius={16}
                    className="skeleton-input"
                  />
                </div>
              </div>

              <div className="skeleton-form-field">
                <Skeleton width={80} height={14} className="mb-2" />
                <Skeleton
                  height={56}
                  borderRadius={16}
                  className="skeleton-input"
                />
              </div>

              <div className="rounded-[24px] border border-slate-100 bg-slate-50 p-6 dark:bg-slate-900/50 dark:border-slate-800">
                <Skeleton width={80} height={14} className="mb-3" />
                <div className="flex gap-3">
                  <Skeleton height={56} className="flex-1" borderRadius={16} />
                  <Skeleton width={56} height={56} borderRadius={16} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Skeleton
                    width={80}
                    height={32}
                    borderRadius={12}
                    className="skeleton-tag"
                  />
                  <Skeleton
                    width={100}
                    height={32}
                    borderRadius={12}
                    className="skeleton-tag"
                  />
                  <Skeleton
                    width={70}
                    height={32}
                    borderRadius={12}
                    className="skeleton-tag"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-2">
                <Skeleton
                  width={160}
                  height={56}
                  borderRadius={16}
                  className="skeleton-toggle"
                />
                <Skeleton
                  width={160}
                  height={56}
                  borderRadius={16}
                  className="skeleton-toggle"
                />
              </div>

              <div className="flex items-center justify-start gap-3 border-t border-slate-100 dark:border-slate-800 pt-6 mt-2">
                <Skeleton
                  width={120}
                  height={48}
                  borderRadius={16}
                  className="skeleton-btn-secondary"
                />
                <Skeleton
                  width={160}
                  height={48}
                  borderRadius={16}
                  className="skeleton-btn-primary"
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </SkeletonTheme>
  );
};

export { AddProductSkeleton };
