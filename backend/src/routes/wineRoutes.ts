import {
  getBestSellingWines,
  getSearchResults,
} from "../controllers/wineController";

export const wineRoutes = async (fastify) => {
  fastify.get("/best-selling", getBestSellingWines);
  fastify.get("/search", getSearchResults);
};
