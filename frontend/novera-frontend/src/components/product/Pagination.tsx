import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: Props) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 7; // Max number of page buttons to show

    if (totalPages <= showPages) {
      // Show all pages if total is small
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(0);

      if (currentPage > 2) {
        pages.push("...");
      }

      // Show pages around current
      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages - 2, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 3) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages - 1);
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      <button
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        className="
          inline-flex items-center gap-2
          px-4 py-2 rounded-md
          border border-ink-200 bg-white
          text-sm font-semibold text-ink-700
          hover:border-ink-900
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-colors duration-150
        "
      >
        <ChevronLeft size={16} />
        <span className="hidden sm:inline">Previous</span>
      </button>

      <div className="flex items-center gap-2">
        {getPageNumbers().map((pageNum, idx) =>
          pageNum === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-2 text-ink-300"
            >
              ···
            </span>
          ) : (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum as number)}
              className={`
                min-w-[40px] h-10 px-3 rounded-md
                text-sm font-semibold
                transition-colors duration-150
                ${
                  currentPage === pageNum
                    ? "bg-primary-500 text-white"
                    : "bg-white border border-ink-200 text-ink-700 hover:border-ink-900"
                }
              `}
            >
              {(pageNum as number) + 1}
            </button>
          )
        )}
      </div>

      <button
        disabled={currentPage === totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
        className="
          inline-flex items-center gap-2
          px-4 py-2 rounded-md
          border border-ink-200 bg-white
          text-sm font-semibold text-ink-700
          hover:border-ink-900
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-colors duration-150
        "
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;