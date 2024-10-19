import { useEffect, useMemo, useState } from "react";
import "./App.css";

// Defining the Wine type to structure each wine's data
type Wine = {
  name: string;
  vintage: number;
  total_quantity: number;
  total_revenue: number;
  total_orders: number;
  highlight: "green" | "none" | "red"; // Highlight used for color styling
};

// Defining available criteria for sorting/filtering the wines
type Criteria = "revenue" | "orders" | "quantity";

function App() {
  // Reading URL parameters to initialize criteria and search term state
  const params = new URLSearchParams(window.location.search);
  const [wines, setWines] = useState<Wine[]>([]); // State to store fetched wines
  const [criteria, setCriteria] = useState<Criteria>(() => {
    return (params.get("criteria") as Criteria) || "revenue"; // Default to 'revenue'
  });
  const [searchTerm, setSearchTerm] = useState<string>(() => {
    return params.get("search") || ""; // Initialize from URL search param if available
  });

  // Fetches wine data based on the selected criteria
  const fetchBestSellingWines = async (criteria: Criteria) => {
    try {
      // Fetch wine data from backend using the selected criteria (revenue, quantity, or orders)
      const response = await fetch(
        `http://localhost:3000/best-selling?criteria=${criteria}`
      );
      const data = await response.json();
      console.log({ data });
      setWines(data); // Updating state with the fetched wine data
    } catch (error) {
      console.error("Error fetching wine list:", error); // Handle any fetch errors
    }
  };

  // Call fetchBestSellingWines when the criteria changes (i.e., sort/filter)
  useEffect(() => {
    fetchBestSellingWines(criteria);
  }, [criteria]); // Depend on criteria so it refetches data when criteria changes

  // Updates criteria state and the URL query string when a different filter is selected
  const updateCriteria = (newCriteria: Criteria) => {
    setCriteria(newCriteria);
    const params = new URLSearchParams(window.location.search);
    params.set("criteria", newCriteria);
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params}`
    ); // Updates the URL without reloading the page
  };

  // Updates search term state and the URL query string when the user types in the search field
  const updateSearchTerm = (term: string) => {
    setSearchTerm(term);
    const params = new URLSearchParams(window.location.search);
    params.set("search", term);
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params}`
    ); // Updates the URL with the search term
  };

  // Filters wines based on the search term (case-insensitive match of name or vintage)
  const filteredWines = useMemo(
    () =>
      wines
        .map((wine, idx) => ({ idx, wine })) // Add index for numbering
        .filter(
          ({ wine }) =>
            !searchTerm || // No search term means no filtering
            searchTerm.length < 1 ||
            wine.name.toLowerCase().includes(searchTerm.toLowerCase()) || // Match wine name
            wine.vintage.toString().includes(searchTerm) // Match wine vintage (year)
        ),
    [wines, searchTerm] // Depend on wines and searchTerm to recalculate on change
  );

  return (
    <main>
      <h1>Best selling wine</h1>
      <div>
        {/* Radio buttons for selecting sorting/filtering criteria */}
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

      {/* Search bar for searching by name or vintage */}
      <div>
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => updateSearchTerm(e.target.value)}
          placeholder="Search by name or vintage"
        />
      </div>

      {/* List of filtered wines, sorted by the selected criteria */}
      <ol>
        {filteredWines.map(({ idx, wine }) => (
          <li
            key={wine.name + idx} // Unique key for each list item
            style={{
              color: wine?.highlight !== "none" ? wine.highlight : undefined, // Apply highlight if needed
              listStyleType: "none", // Remove default list styling
            }}
          >
            {idx + 1}. {wine.name}{" "}
            <span>
              {" "}
              £
              {wine.total_revenue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2, // Formatting revenue to 2 decimal places
              })}
            </span>
          </li>
        ))}
      </ol>
    </main>
  );
}

export default App;
