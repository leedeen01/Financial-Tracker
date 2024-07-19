import { months } from "../../models/expense";

interface Props {
  onSelectMonth: (month: string) => void;
  onSelectYear: (year: string) => void;
  month: string;
  year: string;

}

const FilterDate = ({ onSelectMonth, onSelectYear, month, year }: Props) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="d-flex justify-content-center mb-3">
      <select
        onChange={(event) => onSelectMonth(event.target.value)}
        className="form-control w-100 text-center"
        id="month"
        value={month || "All Months"}
      >
        <option value="">{"All Months"}</option>
        {months.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>
      <select
        onChange={(event) => onSelectYear(event.target.value)}
        className="form-control w-100 text-center"
        id="year"
        value={year || "All Year"}
      >
        <option value="">{"All Year"}</option>
        {Array.from({ length: 10 }, (_, index) => currentYear - index).map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterDate;
