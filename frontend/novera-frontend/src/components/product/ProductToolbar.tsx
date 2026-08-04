interface Props {

    selectedCategory: number | null;

    selectedSort: string;

    onCategoryChange: (categoryId: number | null) => void;

    onSortChange: (sort: string) => void;

}

const ProductToolbar = ({
    selectedCategory,
    selectedSort,
    onCategoryChange,
    onSortChange
}: Props) => {

    return (

        <div
            className="
                flex
                flex-col
                lg:flex-row
                justify-between
                gap-6
                mb-10
            "
        >

            <div className="flex flex-wrap gap-3">

                <button

                    onClick={() => onCategoryChange(null)}

                    className={`
                        px-5
                        py-2
                        rounded-full
                        transition
                        ${
                            selectedCategory === null
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100"
                        }
                    `}
                >
                    All
                </button>

                <button

                    onClick={() => onCategoryChange(1)}

                    className={`
                        px-5
                        py-2
                        rounded-full
                        ${
                            selectedCategory === 1
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100"
                        }
                    `}
                >
                    Running
                </button>

                <button

                    onClick={() => onCategoryChange(2)}

                    className={`
                        px-5
                        py-2
                        rounded-full
                        ${
                            selectedCategory === 2
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100"
                        }
                    `}
                >
                    Sneakers
                </button>

                <button

                    onClick={() => onCategoryChange(3)}

                    className={`
                        px-5
                        py-2
                        rounded-full
                        ${
                            selectedCategory === 3
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100"
                        }
                    `}
                >
                    Casual
                </button>

                <button

                    onClick={() => onCategoryChange(4)}

                    className={`
                        px-5
                        py-2
                        rounded-full
                        ${
                            selectedCategory === 4
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100"
                        }
                    `}
                >
                    Training
                </button>

            </div>

            <select

                value={selectedSort}

                onChange={(e) =>
                    onSortChange(e.target.value)
                }

                className="
                    border
                    rounded-xl
                    px-4
                    py-3
                    w-60
                "

            >

                <option value="id,asc">
                    Latest
                </option>

                <option value="price,asc">
                    Price Low → High
                </option>

                <option value="price,desc">
                    Price High → Low
                </option>

                <option value="rating,desc">
                    Highest Rated
                </option>

            </select>

        </div>

    );

};

export default ProductToolbar;