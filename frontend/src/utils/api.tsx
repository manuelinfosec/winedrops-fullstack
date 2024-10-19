import { Wine } from "../types";

export const fetchBestSellingWines = async (
  criteria: string
): Promise<Wine[]> => {
  try {
    const apiUrl =
      import.meta.env.NODE_ENV === "production"
        ? import.meta.env.VITE_PRODUCTION_API_URL
        : "http://localhost:3000";

    console.log("debugggggingg");
    console.log(process.env);
    console.log(process.env.NODE_ENV);
    console.log(process.env.VITE_PRODUCTION_API_URL);
    const response = await fetch(`${apiUrl}/best-selling?criteria=${criteria}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching wine list:", error);
    return [];
  }
};
