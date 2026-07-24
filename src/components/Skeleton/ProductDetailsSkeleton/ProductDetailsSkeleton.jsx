import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./ProductDetailsSkeleton.css";

const ProductDetailsSkeleton = ({ baseColor, highlightColor }) => {
  return (
    <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
      <section className="skeleton-product-details min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8 dark:bg-slate-900">
        <div className="mx-auto max-w-[1600px] space-y-8">
          <div className="skeleton-header-wrapper relative overflow-hidden rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 p-6 shadow-lg">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Skeleton
                  width={48}
                  height={48}
                  borderRadius={16}
                  className="skeleton-icon"
                />
                <div>
                  <Skeleton
                    width={120}
                    height={20}
                    borderRadius={8}
                    className="skeleton-back-link"
                  />

                  <Skeleton
                    width={250}
                    height={32}
                    borderRadius={8}
                    className="skeleton-title mt-1"
                  />
                </div>
              </div>

              <Skeleton
                width={160}
                height={40}
                borderRadius={12}
                className="skeleton-tag"
              />
            </div>
          </div>

          <div className="grid gap-8 lg:gap-10 xl:grid-cols-[1fr_1.1fr]">
            <div className="skeleton-gallery-wrapper rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 p-4 shadow-lg aspect-square">
              <Skeleton
                height="100%"
                borderRadius={16}
                className="skeleton-gallery-image"
              />
            </div>

            <div className="space-y-6">
              <div className="skeleton-overview-wrapper rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/40 dark:from-slate-800 dark:via-slate-800/90 dark:to-sky-900/30 p-6 shadow-lg">
                <Skeleton
                  width="80%"
                  height={36}
                  borderRadius={8}
                  className="skeleton-product-name"
                />

                <Skeleton
                  width="40%"
                  height={32}
                  borderRadius={8}
                  className="skeleton-product-price mt-4"
                />

                <Skeleton
                  width="60%"
                  height={24}
                  borderRadius={8}
                  className="skeleton-rating mt-3"
                />

                <div className="mt-4 space-y-2">
                  <Skeleton
                    width="100%"
                    height={16}
                    borderRadius={4}
                    className="skeleton-desc-line"
                  />
                  <Skeleton
                    width="95%"
                    height={16}
                    borderRadius={4}
                    className="skeleton-desc-line"
                  />
                  <Skeleton
                    width="90%"
                    height={16}
                    borderRadius={4}
                    className="skeleton-desc-line"
                  />
                  <Skeleton
                    width="85%"
                    height={16}
                    borderRadius={4}
                    className="skeleton-desc-line"
                  />
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  <Skeleton
                    width={100}
                    height={32}
                    borderRadius={12}
                    className="skeleton-badge"
                  />
                  <Skeleton
                    width={120}
                    height={32}
                    borderRadius={12}
                    className="skeleton-badge"
                  />
                  <Skeleton
                    width={90}
                    height={32}
                    borderRadius={12}
                    className="skeleton-badge"
                  />
                </div>

                <Skeleton
                  width="100%"
                  height={1}
                  className="skeleton-divider mt-4"
                />

                <div className="flex flex-wrap gap-3 mt-4">
                  <Skeleton
                    width={140}
                    height={48}
                    borderRadius={12}
                    className="skeleton-btn-primary"
                  />
                  <Skeleton
                    width={140}
                    height={48}
                    borderRadius={12}
                    className="skeleton-btn-secondary"
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Skeleton
                    width="100%"
                    height={40}
                    borderRadius={8}
                    className="skeleton-info-item"
                  />
                  <Skeleton
                    width="100%"
                    height={40}
                    borderRadius={8}
                    className="skeleton-info-item"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SkeletonTheme>
  );
};

export { ProductDetailsSkeleton };
