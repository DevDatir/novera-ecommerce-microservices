interface Props {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange
}: Props) => {

    if (totalPages <= 1)
        return null;

    return (

        <div className="flex justify-center items-center gap-3 mt-12">

            <button
                disabled={currentPage === 0}
                onClick={() => onPageChange(currentPage - 1)}
                className="px-5 py-2 rounded-lg border disabled:opacity-40"
            >
                Previous
            </button>

            {Array.from({ length: totalPages }).map((_, index) => (

                <button

                    key={index}

                    onClick={() => onPageChange(index)}

                    className={`w-10 h-10 rounded-lg transition
                        ${
                            currentPage === index
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 hover:bg-gray-200"
                        }
                    `}
                >
                    {index + 1}
                </button>

            ))}

            <button
                disabled={currentPage === totalPages - 1}
                onClick={() => onPageChange(currentPage + 1)}
                className="px-5 py-2 rounded-lg border disabled:opacity-40"
            >
                Next
            </button>

        </div>

    );

};

export default Pagination;