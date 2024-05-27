interface Category {
  name: string;
  background: string;
  border: string;
}

interface Props {
  onSelectCategory: (category: string) => void;
  categories: Category[];
}

const ExpenseFilter = ({ onSelectCategory, categories }: Props) => {
  return (
    <div className="d-flex justify-content-center">
      <select
        onChange={(event) => onSelectCategory(event.target.value)}
        className="form-control w-25 text-center"
        id="category"
      >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category.name} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ExpenseFilter;
