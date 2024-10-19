import React from "react";

type WineSearchProps = {
  searchTerm: string;
  updateSearchTerm: (term: string) => void;
};

const WineSearch: React.FC<WineSearchProps> = ({
  searchTerm,
  updateSearchTerm,
}) => {
  return (
    <input
      type="search"
      value={searchTerm}
      onChange={(e) => updateSearchTerm(e.target.value)}
      placeholder="Search by name or vintage"
    />
  );
};

export default WineSearch;
