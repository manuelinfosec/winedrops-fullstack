import React from "react";
import { Wine } from "../types";

type WineListProps = {
  wines: {idx: number; wine: Wine}[];
};

const WineList: React.FC<WineListProps> = ({ wines }) => {
  return (
    <ol>
      {wines.map(({ idx, wine }) => (
        <li
          key={wine.name + idx}
          style={{
            color: wine.highlight !== "none" ? wine.highlight : undefined,
            listStyleType: "none",
          }}
        >
          {idx + 1}. {wine.name}{" "}
          <span>
            £
            {wine.total_revenue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </li>
      ))}
    </ol>
  );
};

export default WineList;
