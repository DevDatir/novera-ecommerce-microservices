interface Props {

    search: string;
    category: string;
    gender: string;
    sort: string;

    onSearchChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onGenderChange: (value: string) => void;
    onSortChange: (value: string) => void;

}

const ProductFilters = ({
    search,
    category,
    gender,
    sort,
    onSearchChange,
    onCategoryChange,
    onGenderChange,
    onSortChange
}: Props) => {

    return (

        <div
            className="
                bg-white
                rounded-2xl
                shadow
                p-6
                mb-10
            "
        >

            <div
                className="
                    grid
                    md:grid-cols-4
                    gap-5
                "
            >

                <input

                    value={search}

                    onChange={(e) =>
                        onSearchChange(e.target.value)
                    }

                    placeholder="Search shoes..."

                    className="
                        border
                        rounded-xl
                        px-4
                        py-3
                    "

                />

                <select
                    value={category}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="border rounded-xl px-4 py-3"
                >
                    <option value="">All Categories</option>

                    <option value="RUNNING">Running</option>

                    <option value="SPORTS">Sneakers</option>

                    <option value="CASUAL">Casual</option>

                    <option value="LIFESTYLE">Training</option>

                </select>
                <select
                    value={gender}
                    onChange={(e) => onGenderChange(e.target.value)}
                    className="border rounded-xl px-4 py-3"
                >
                    <option value="">All</option>

                    <option value="MEN">Men</option>

                    <option value="WOMEN">Women</option>

                    <option value="UNISEX">Unisex</option>

                </select>
                <select

                    value={sort}

                    onChange={(e) =>
                        onSortChange(e.target.value)
                    }

                    className="
                        border
                        rounded-xl
                        px-4
                        py-3
                    "

                >

                    <option value="">Featured</option>

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

        </div>

    );

};

export default ProductFilters;