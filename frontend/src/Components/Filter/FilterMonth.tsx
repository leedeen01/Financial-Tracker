import { months } from "../../models/expense";

interface Props {
  onSelectMonth: (category: string) => void;
  month: string;
}

const FilterMonth = ({ onSelectMonth, month }: Props) => {
  return (
    <div className="d-flex justify-content-center mb-3">
      <select
        onChange={(event) => onSelectMonth(event.target.value)}
        className="form-control w-100 text-center"
        id="month"
        value={month || "All Month"}
      >
        <option value="">{"All Month"}</option>
        {months.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterMonth;
