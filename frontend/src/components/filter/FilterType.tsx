import React from "react";
import { Category } from "../../models/category";

interface Props {
  onSelectType: (type: string) => void;
  categories: Category[];
  type: string;
}

const FilterType: React.FC<Props> = ({ onSelectType, categories, type }) => {
  const uniqueTypes = Array.from(new Set(categories.map(cat => cat.type)));

  return (
    <div className="d-flex justify-content-center mb-3">
      <select
        onChange={(event) => onSelectType(event.target.value)}
        className="form-control w-100 text-center"
        id="type"
        value={type || "All Types"}
      >
        <option value="">All Types</option>
        {uniqueTypes.map((t, index) => (
          <option key={index} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterType;