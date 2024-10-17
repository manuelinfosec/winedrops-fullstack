import { useEffect, useMemo, useState } from 'react';
import "./App.css";

type Wine = {
  name: string;
  vintage: number;
  total_quantity: number;
  total_revenue: number;
  total_orders: number;
  highlight: "green" | "none" | "red";
}

type Criteria = 'revenue' | 'orders' | 'quantity'

function App() {
  const params = new URLSearchParams(window.location.search);
  const [wines, setWines] = useState<Wine[]>([]);
  const [criteria, setCriteria] = useState<Criteria>(() => {
    return (params.get('criteria') as Criteria) || 'revenue';
  });
  const [searchTerm, setSearchTerm] = useState<string>(() => {
    return params.get('search') || '';
  });

  const fetchBestSellingWines = async (criteria: Criteria) => {
    try {
      const response = await fetch(`http://localhost:3000/best-selling?criteria=${criteria}`);
      const data = await response.json();
      console.log({ data });
      setWines(data);
    } catch (error) {
      console.error('Error fetching wine list:', error);
    }
  };

  useEffect(() => {
    fetchBestSellingWines(criteria);
  }, [criteria]);

  const updateCriteria = (newCriteria: Criteria) => {
    setCriteria(newCriteria)
    const params = new URLSearchParams(window.location.search);
    params.set('criteria', newCriteria);
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
  };

  const updateSearchTerm = (term: string) => {
    setSearchTerm(term);
    const params = new URLSearchParams(window.location.search);
    params.set('search', term);
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
  };

  const filteredWines = useMemo(() => wines.map((wine, idx) => ({ idx, wine })).filter(({ wine }) =>
    !searchTerm || searchTerm.length < 1 
  || wine.name.toLowerCase().includes(searchTerm.toLowerCase()) 
  || wine.vintage.toString().includes(searchTerm)
  ), [wines, searchTerm]);

  return <main>
    <h1>Best selling wine</h1>
    <div>
      <label>
        <input
          type="radio"
          value="revenue"
          checked={criteria === 'revenue'}
          onChange={() => updateCriteria('revenue')}
        />
        By revenue
      </label>
      <label>
        <input
          type="radio"
          value="quantity"
          checked={criteria === 'quantity'}
          onChange={() => updateCriteria('quantity')}
        />
        By # bottles sold
      </label>
      <label>
        <input
          type="radio"
          value="orders"
          checked={criteria === 'orders'}
          onChange={() => updateCriteria('orders')}
        />
        By # orders
      </label>
    </div>
    <div>
      <input
        type="search"
        value={searchTerm}
        onChange={(e) => updateSearchTerm(e.target.value)}
        placeholder="Search by name or vintage"
      />
    </div>
    <ol>
      {
        filteredWines.map(({ idx, wine }) => (
          <li
            key={wine.name + idx} // Added key for list items
            style={{
              color: wine?.highlight !== "none" ? wine.highlight : undefined,
              listStyleType: "none"
            }}
          >{idx + 1}. {wine.name} - £{wine.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</li>
        ))
      }
    </ol>
  </main>;
}

export default App;
