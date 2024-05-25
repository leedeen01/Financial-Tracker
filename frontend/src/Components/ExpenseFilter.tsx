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
    <select
      onChange={(event) => onSelectCategory(event.target.value)}
      className="form-control"
      id="category"
    >
      <option value="All">All categories</option>
      {categories.map((category) => (
        <option key={category.name} value={category.name}>
          {category.name}
        </option>
      ))}
    </select>
  );
};

export default ExpenseFilter;
