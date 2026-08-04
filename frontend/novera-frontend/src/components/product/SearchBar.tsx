interface Props {

    value: string;

    onChange: (value: string) => void;

}

const SearchBar = ({
    value,
    onChange
}: Props) => {

    return (

        <input

            value={value}

            onChange={(e) =>
                onChange(e.target.value)
            }

            placeholder="Search shoes..."

            className="
                w-full
                border
                rounded-xl
                px-5
                py-4
                mb-8
            "

        />

    );

};

export default SearchBar;