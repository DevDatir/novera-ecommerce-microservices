import { Search, X } from "lucide-react";
import { useState } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
}

const SearchBar = ({ value, onChange, onSearch }: Props) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChange("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative mb-8">
      <div
        className={`
          relative flex items-center
          border-2 rounded-2xl px-4 py-3.5
          bg-white transition-all duration-200
          ${
            isFocused
              ? "border-primary-400 ring-4 ring-primary-100 shadow-md"
              : "border-gray-200"
          }
        `}
      >
        <Search
          size={18}
          className={`
            flex-shrink-0 transition-colors
            ${isFocused ? "text-primary-600" : "text-gray-400"}
          `}
        />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search shoes by name..."
          className="
            flex-1 ml-3 bg-transparent outline-none
            text-base text-gray-900 placeholder-gray-400
          "
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="
              flex-shrink-0 text-gray-400 hover:text-gray-600
              transition-colors
            "
          >
            <X size={18} />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;