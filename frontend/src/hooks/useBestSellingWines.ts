import { useEffect, useState } from "react";
import { Wine, Criteria } from "../types";
import { fetchBestSellingWines } from "../utils/api";

export const useBestSellingWines = (criteria: Criteria) => {
  const [wines, setWines] = useState<Wine[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchBestSellingWines(criteria);
      setWines(data);
    };
    fetchData();
  }, [criteria]);

  return { wines };
};
