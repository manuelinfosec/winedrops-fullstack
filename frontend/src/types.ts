export type Wine = {
  name: string;
  vintage: number;
  total_quantity: number;
  total_revenue: number;
  total_orders: number;
  highlight: "green" | "none" | "red";
};

export type Criteria = "revenue" | "orders" | "quantity";
