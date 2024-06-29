interface Category {
  name: string;
  background: string;
  border: string;
}

interface Props {
  onSelectCategory: (category: string) => void;
  categories: Category[];
  category: string;
}

const FilterCategory = ({ onSelectCategory, categories, category }: Props) => {
  return (
    <div className="d-flex justify-content-center mb-3">
      <select
        onChange={(event) => onSelectCategory(event.target.value)}
        className="form-control w-100 text-center"
        id="category"
        value={category || "All Categories"}
      >
        <option value="">{"All Categories"}</option>
        {categories.map((category) => (
          <option key={category.name} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterCategory;
