import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./UsersSkeleton.css";

const StatsSkeleton = ({ baseColor, highlightColor }) => {
  const stats = Array(4).fill(null);

  const content = (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
      {stats.map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm border border-gray-100 dark:bg-slate-900 dark:border-slate-800"
        >
          <div>
            <Skeleton width={80} height={14} className="mb-2" />
            <Skeleton width={60} height={32} />
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-200 dark:bg-slate-700">
            <Skeleton circle width={24} height={24} />
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

const TableSkeleton = ({ baseColor, highlightColor }) => {
  const rows = Array(5).fill(null);

  const content = (
    <div className="hidden lg:block bg-slate-100  dark:bg-slate-900 rounded-2xl shadow-sm border-0 border-slate-700/50 overflow-hidden ">
      <div className="overflow-x-auto  ">
        <table className="w-full">
          <thead>
            <tr className="border-b dark:border-gray-500/30">
              <th className="text-left text-sm font-medium text-gray-500 px-6 py-4">
                <Skeleton width={60} height={14} />
              </th>
              <th className="text-left text-sm font-medium text-gray-500 px-6 py-4">
                <Skeleton width={40} height={14} />
              </th>
              <th className="text-left text-sm font-medium text-gray-500 px-6 py-4">
                <Skeleton width={50} height={14} />
              </th>
              <th className="text-left text-sm font-medium text-gray-500 px-6 py-4">
                <Skeleton width={50} height={14} />
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((_, index) => (
              <tr
                key={index}
                className="border-b border-gray-500 dark:border-slate-800 dark:hover:bg-slate-800"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Skeleton circle width={40} height={40} />
                    <div>
                      <Skeleton width={120} height={16} className="mb-1" />
                      <Skeleton width={150} height={12} />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Skeleton width={80} height={24} borderRadius={9999} />
                </td>
                <td className="px-6 py-4">
                  <Skeleton width={60} height={20} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Skeleton width={32} height={32} borderRadius={8} />
                    <Skeleton width={32} height={32} borderRadius={8} />
                    <Skeleton width={32} height={32} borderRadius={8} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

const MobileCardsSkeleton = ({ baseColor, highlightColor }) => {
  const cards = Array(3).fill(null);

  const content = (
    <div className="lg:hidden">
      {cards.map((_, index) => (
        <div
          key={index}
          className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm mb-4 dark:bg-slate-900 dark:border-slate-800"
        >
          <div className="flex items-start gap-4">
            <Skeleton circle width={48} height={48} />
            <div className="flex-1">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Skeleton width={140} height={18} className="mb-1" />
                  <Skeleton width={160} height={14} />
                </div>
                <Skeleton width={80} height={24} borderRadius={9999} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-gray-50 px-3 py-2 dark:bg-slate-800">
                  <Skeleton width={40} height={12} className="mb-1" />
                  <Skeleton width={60} height={16} />
                </div>
                <div className="rounded-2xl bg-gray-50 px-3 py-2 dark:bg-slate-800">
                  <Skeleton width={40} height={12} className="mb-1" />
                  <Skeleton width={70} height={24} borderRadius={9999} />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Skeleton width={80} height={36} borderRadius={16} />
            <Skeleton width={100} height={36} borderRadius={16} />
            <Skeleton width={80} height={36} borderRadius={16} />
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

const UsersSkeleton = ({ baseColor, highlightColor }) => {
  const content = (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <Skeleton width={150} height={14} className="mb-1" />
            <Skeleton width={200} height={32} />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Skeleton width={280} height={48} borderRadius={16} />
            <Skeleton width={140} height={48} borderRadius={16} />
          </div>
        </div>

        <StatsSkeleton baseColor={baseColor} highlightColor={highlightColor} />

        <TableSkeleton baseColor={baseColor} highlightColor={highlightColor} />

        <MobileCardsSkeleton
          baseColor={baseColor}
          highlightColor={highlightColor}
        />
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

export { UsersSkeleton, StatsSkeleton, TableSkeleton, MobileCardsSkeleton };
