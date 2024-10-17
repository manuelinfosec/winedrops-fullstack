import cors from "@fastify/cors";
import FastifySqlite from "fastify-sqlite";

export const registerPlugins = (fastify) => {
  fastify.register(FastifySqlite, {
    dbFile: "db/winedrops.db",
    promiseApi: true,
    // verbose: true,
  });

  fastify.register(cors, {
    origin: true,
    methods: ["GET"],
  });
};
