import React from "react";
import { Criteria } from "../types";

type CriteriaSelectorProps = {
  criteria: Criteria;
  updateCriteria: (newCriteria: Criteria) => void;
};

const CriteriaSelector: React.FC<CriteriaSelectorProps> = ({ criteria, updateCriteria }) => {
  return (
    <div>
      <label>
        <input
          type="radio"
          value="revenue"
          checked={criteria === "revenue"}
          onChange={() => updateCriteria("revenue")}
        />
        By revenue
      </label>
      <label>
        <input
          type="radio"
          value="quantity"
          checked={criteria === "quantity"}
          onChange={() => updateCriteria("quantity")}
        />
        By # bottles sold
      </label>
      <label>
        <input
          type="radio"
          value="orders"
          checked={criteria === "orders"}
          onChange={() => updateCriteria("orders")}
        />
        By # orders
      </label>
    </div>
  );
};

export default CriteriaSelector;
