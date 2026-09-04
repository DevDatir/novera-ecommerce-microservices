interface Props {
  selectedCategory: number | null;
  selectedSort: string;
  selectedGender: string | null;
  onCategoryChange: (categoryId: number | null) => void;
  onSortChange: (sort: string) => void;
  onGenderChange: (gender: string | null) => void;
}

const CATEGORIES = [{ id: 1, name: "Running" }, { id: 2, name: "Sneakers" }, { id: 3, name: "Casual" }, { id: 4, name: "Training" }];
const GENDERS = [{ value: "MALE", label: "Men" }, { value: "FEMALE", label: "Women" }, { value: "UNISEX", label: "Unisex" }];
const SORT_OPTIONS = [{ value: "id,asc", label: "Latest" }, { value: "price,asc", label: "Price: low to high" }, { value: "price,desc", label: "Price: high to low" }, { value: "rating,desc", label: "Top rated" }, { value: "unitsSold,desc", label: "Best selling" }];
const chip = "min-h-10 rounded-md border px-4 text-sm font-semibold transition-colors";

const ProductToolbar = ({ selectedCategory, selectedSort, selectedGender, onCategoryChange, onSortChange, onGenderChange }: Props) => (
  <section aria-label="Product filters" className="mb-8 border border-ink-100 bg-sand-50 p-4 sm:p-6">
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
      <fieldset>
        <legend className="mb-3 text-sm font-bold text-ink-900">Shop for</legend>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => onGenderChange(null)} className={`${chip} ${selectedGender === null ? "border-ink-900 bg-ink-900 text-white" : "border-ink-200 bg-white text-ink-700 hover:border-ink-900"}`}>All</button>
          {GENDERS.map(({ value, label }) => <button type="button" key={value} onClick={() => onGenderChange(value)} className={`${chip} ${selectedGender === value ? "border-ink-900 bg-ink-900 text-white" : "border-ink-200 bg-white text-ink-700 hover:border-ink-900"}`}>{label}</button>)}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-bold text-ink-900">Category</legend>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => onCategoryChange(null)} className={`${chip} ${selectedCategory === null ? "border-primary-500 bg-primary-500 text-white" : "border-ink-200 bg-white text-ink-700 hover:border-primary-500"}`}>All</button>
          {CATEGORIES.map(({ id, name }) => <button type="button" key={id} onClick={() => onCategoryChange(id)} className={`${chip} ${selectedCategory === id ? "border-primary-500 bg-primary-500 text-white" : "border-ink-200 bg-white text-ink-700 hover:border-primary-500"}`}>{name}</button>)}
        </div>
      </fieldset>

      <label className="block text-sm font-bold text-ink-900">
        <span className="mb-3 block">Sort by</span>
        <span className="block">
          <select value={selectedSort} onChange={(event) => onSortChange(event.target.value)} className="min-h-10 w-full rounded-md border border-ink-200 bg-white px-4 py-2 text-sm font-semibold text-ink-800 hover:border-ink-900 focus:border-primary-500 focus:outline-none lg:min-w-52">
            {SORT_OPTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
          </select>
        </span>
      </label>
    </div>
  </section>
);

export default ProductToolbar;
