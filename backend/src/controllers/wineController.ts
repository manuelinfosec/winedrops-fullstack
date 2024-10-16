import { fetchBestSellingWines, searchWines } from "../models/wineModel";

export const getBestSellingWines = async (request, reply) => {
  const { criteria } = request.query;
  try {
    const bestSellingWines = await fetchBestSellingWines(criteria);
    return bestSellingWines;
  } catch (err) {
    reply.status(400).send({ error: err.message });
  }
};

export const getSearchResults = async (request, reply) => {
  const { query } = request.query;
  try {
    const searchResults = await searchWines(query);
    return searchResults;
  } catch (err) {
    reply.status(400).send({ error: err.message });
  }
};
