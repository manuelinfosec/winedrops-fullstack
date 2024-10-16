import Fastify from "fastify";
import { registerDatabase } from "./db/database";
import { wineRoutes } from "./routes/wineRoutes";

const fastify = Fastify({ logger: true });

// Register the database with the Fastify instance
registerDatabase(fastify);

// Register routes
fastify.register(wineRoutes);

// Default route: If it works, don't touch it
fastify.get("/hello", async () => {
  return { hello: "world" };
});

// Start the server
(async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log("Server is listening on http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();

export default fastify;
