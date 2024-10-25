import React, { useCallback, useState } from "react";
import { debounce } from "../utils";

type WineSearchProps = {
  searchTerm: string;
  updateSearchTerm: (term: string) => void;
};

const WineSearch: React.FC<WineSearchProps> = ({
  searchTerm,
  updateSearchTerm,
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchTerm);

  // Delay invoking the search by 300 ms
  const debouncedUpdateSearchTerm = useCallback(debounce((term: string) => {
    updateSearchTerm(term);
  }, 300), [updateSearchTerm]);

  return (
    <input
      type="search"
      value={localSearchTerm}
      onChange={(e) => {
        setLocalSearchTerm(e.target.value)
        debouncedUpdateSearchTerm(e.target.value)
      }}
      placeholder="Search by name or vintage"
    />
  );
};

export default WineSearch;
