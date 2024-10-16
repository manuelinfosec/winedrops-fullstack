import FastifySqlite from "fastify-sqlite";

export const registerDatabase = (fastify) => {
  fastify.register(FastifySqlite, {
    dbFile: "db/winedrops.db",
    promiseApi: true,
    // verbose: true,
  });
};
