import { FaChevronLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";

function Pagination({ currentPage, totalPages, goToPage, nextPage, prevPage }) {
  if (totalPages <= 0) return null;
  return (
    <div className="flex flex-col min-[350px]:flex-row items-center justify-center min-[350px]:justify-between gap-3 min-[300px]:gap-0 border-t border-slate-100 px-5 py-3.5 dark:border-slate-800">
      <p className="text-[12px] sm:text-sm text-slate-400">
        Page{" "}
        <span className="font-semibold text-slate-600 dark:text-slate-300">
          {currentPage}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-slate-600 dark:text-slate-300">
          {totalPages}
        </span>
      </p>
      <div className="flex justify-center items-center gap-1.5 mt-3 min-[350px]:mt-0">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="flex w-6 h-6 min-[800px]:h-8 min-[800px]:w-8 items-center justify-center rounded min-[800px]:rounded-lg border border-slate-200 text-[12px] min-[800px]:text-sm text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <FaChevronLeft />
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => goToPage(index + 1)}
            className={`flex w-6 h-6 min-[800px]:h-8 min-[800px]:w-8 items-center justify-center min-[800px]:rounded-lg text-[12px] min-[800px]:text-sm font-medium transition ${
              currentPage === index + 1
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "border border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="flex w-6 h-6 min-[800px]:h-8 min-[800px]:w-8 items-center justify-center min-[800px]:rounded-lg border border-slate-200 text-[12px] min-[800px]:text-sm text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}

export default Pagination;