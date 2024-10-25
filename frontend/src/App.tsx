import { useMemo, useState } from "react";
import "./App.css";
import CriteriaSelector from "./components/CriteriaSelector";
import WineList from "./components/WineList";
import WineSearch from "./components/WineSearch";
import { useBestSellingWines } from "./hooks/useBestSellingWines";
import { Criteria } from "./types";

function App() {
  const params = new URLSearchParams(window.location.search);
  const [criteria, setCriteria] = useState<Criteria>(
    (params.get("criteria") as Criteria) || "revenue"
  );
  const [searchTerm, setSearchTerm] = useState<string>(
    params.get("search") || ""
  );

  // Using custom hook to fetch wines
  const { wines } = useBestSellingWines(criteria);

  // Update the URL query string when criteria changes
  const updateCriteria = (newCriteria: Criteria) => {
    setCriteria(newCriteria);
    const params = new URLSearchParams(window.location.search);
    params.set("criteria", newCriteria);
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params}`
    );
  };

  // Update the URL query string when search term changes
  const updateSearchTerm = (term: string) => {
    setSearchTerm(term);
    const params = new URLSearchParams(window.location.search);
    params.set("search", term);
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params}`
    );
  };

  // Filter wines based on search term
  const filteredWines = useMemo(() => 
    // Mapping through the wines array to add an index to each wine for easier identification later
    wines
      .map((wine, idx) => ({ idx, wine }))
      // Filtering the wines based on the searchTerm:
      // 1. If there is no search term (i.e., it's empty), return all wines.
      // 2. If there is a search term, filter wines by matching the name (case-insensitive) or the vintage.
      .filter(({ wine }) =>
        !searchTerm // If searchTerm is empty, no filtering occurs, return true for all wines.
        || wine.name.toLowerCase().includes(searchTerm.toLowerCase()) // Check if the wine name includes the searchTerm (case-insensitive)
        || wine.vintage.toString().includes(searchTerm) // Check if the wine vintage matches the searchTerm
      ), 
    [wines, searchTerm]
  );
  

  return (
    <main>
      <h1>Best selling wine</h1>
      <CriteriaSelector criteria={criteria} updateCriteria={updateCriteria} />
      <WineSearch searchTerm={searchTerm} updateSearchTerm={updateSearchTerm} />
      <WineList wines={filteredWines} />
    </main>
  );
}

export default App;
