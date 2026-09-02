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
          px-4 py-2 rounded-xl
          border border-gray-200 bg-white
          text-sm font-semibold text-gray-700
          hover:bg-gray-50 hover:border-gray-300
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all duration-200
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
              className="px-2 text-gray-400"
            >
              ···
            </span>
          ) : (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum as number)}
              className={`
                min-w-[40px] h-10 px-3 rounded-xl
                text-sm font-semibold
                transition-all duration-200
                ${
                  currentPage === pageNum
                    ? "bg-primary-600 text-white shadow-md"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
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
          px-4 py-2 rounded-xl
          border border-gray-200 bg-white
          text-sm font-semibold text-gray-700
          hover:bg-gray-50 hover:border-gray-300
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all duration-200
        "
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;