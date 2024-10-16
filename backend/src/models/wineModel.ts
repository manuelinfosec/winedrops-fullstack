import fastify from "../index";

// **Covers Requirement**: Display a list of the best-selling wines; Ability to select what the best-selling means.
export const fetchBestSellingWines = async (criteria: string) => {
  // Define the valid criteria for sorting the wines.
  const validCriteria = ["revenue", "quantity", "orders"];

  // **Covers Requirement**: Ensure valid criteria for determining best-selling wines.
  if (!validCriteria.includes(criteria)) {
    throw new Error(
      "Invalid criteria. Use 'revenue', 'quantity', or 'orders'."
    );
  }

  // - Aggregates total quantity, revenue, and orders for each wine.
  // - Groups by the master wine (`mw.id`) to roll up all prices for the same wine (ignoring price differences).
  // - Only includes orders with statuses 'paid' or 'dispatched'.
  // **Covers Requirement**: Show the best selling wine; Important note about selling the same wine at different prices.
  const query = `
  SELECT mw.name, mw.vintage,
         SUM(co.quantity) as total_quantity,
         SUM(co.total_amount) as total_revenue,
         COUNT(co.id) as total_orders
  FROM master_wine mw
  JOIN wine_product wp ON mw.id = wp.master_wine_id
  JOIN customer_order co ON wp.id = co.wine_product_id
  WHERE co.status IN ('paid', 'dispatched')
  GROUP BY mw.id
  ORDER BY ${
    criteria === "revenue"
      ? "total_revenue"
      : criteria === "quantity"
      ? "total_quantity"
      : "total_orders"
  } DESC
  `;

  const rows = await fastify.sqlite.all(query);

  const wines = rows.map((row) => ({
    name: row.name,
    vintage: row.vintage,
    total_quantity: row.total_quantity,
    total_revenue: row.total_revenue,
    total_orders: row.total_orders,
  }));

  // Sort the wines based on the selected criteria (e.g., 'revenue', 'quantity', or 'orders') in descending order
  // TODO: Move sorting to the data layer
  // const sortedWines = [...wines].sort((a, b) => b[criteria] - a[criteria]);

  // Calculate the index for the top 10% and bottom 10% thresholds.
  // **Covers Requirement**: Top 10% and bottom 10% wines highlighting.
  const topThresholdIndex = Math.floor(wines.length * 0.1);
  const bottomThresholdIndex = Math.floor(wines.length * 0.9);

  // For each wine, determine if it should be highlighted in green (top 10%) or red (bottom 10%),
  // otherwise no highlight (default).
  return wines.map((wine) => {
    const isTop10Percent = wines.indexOf(wine) < topThresholdIndex;
    const isBottom10Percent = wines.indexOf(wine) >= bottomThresholdIndex;

    return {
      ...wine,
      highlight: isTop10Percent ? "green" : isBottom10Percent ? "red" : "none",
    };
  });
};

// Function to search for wines by name or vintage. The search is case-insensitive and allows partial matches.
// **Covers Requirement**: Search functionality; The search should be case insensitive; Search should be done on name and vintage fields.
export const searchWines = async (query: string) => {
  // Prepare the search query for a case-insensitive partial match using SQLite's `LIKE` operator.
  const searchQuery = `%${query}%`;

  // SQL query to search wines based on their name or vintage. Similar to the fetch query, it:
  // - Aggregates total quantity, revenue, and orders for each matching wine.
  // - Includes only orders with statuses 'paid' or 'dispatched'.
  // **Covers Requirement**: Search functionality; Only includes paid or dispatched orders.
  const searchSql = `
    SELECT mw.name, mw.vintage,
           SUM(co.quantity) as total_quantity,
           SUM(co.total_amount) as total_revenue,
           COUNT(co.id) as total_orders
    FROM master_wine mw
    JOIN wine_product wp ON mw.id = wp.master_wine_id
    JOIN customer_order co ON wp.id = co.wine_product_id
    WHERE (mw.name LIKE ? OR mw.vintage LIKE ?) AND co.status IN ('paid', 'dispatched')
    GROUP BY mw.id
  `;

  // Execute the search query with the provided search terms.
  const rows = await fastify.sqlite.all(searchSql, [searchQuery, searchQuery]);

  // Map each row into a structured object representing the matching wine's name, vintage, and sales data.
  return rows.map((row) => ({
    name: row.name,
    vintage: row.vintage,
    total_quantity: row.total_quantity,
    total_revenue: row.total_revenue,
    total_orders: row.total_orders,
  }));
};
