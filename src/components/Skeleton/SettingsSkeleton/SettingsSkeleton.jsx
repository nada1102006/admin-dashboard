import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./SettingsSkeleton.css";

const SettingsSkeleton = ({ baseColor, highlightColor }) => {
  return (
    <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
      <div className="skeleton-settings-container setting-container p-4 lg:p-8 min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900">
        <div className="setting-main space-y-6 dark:bg-slate-900">
          <div className="skeleton-setting-header setting-header rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl dark:bg-slate-900">
            <Skeleton
              width={80}
              height={14}
              className="skeleton-loading mb-2"
            />
            <Skeleton
              width={250}
              height={28}
              className="skeleton-loading skeleton-header-title mb-2"
            />
            <Skeleton
              width={400}
              height={16}
              className="skeleton-loading skeleton-header-subtitle"
            />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export { SettingsSkeleton };
