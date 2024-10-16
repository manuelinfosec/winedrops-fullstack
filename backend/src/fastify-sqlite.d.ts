import "fastify";

declare module "fastify" {
  interface FastifyInstance {
    sqlite: {
      all: (sql: string, params?: any[]) => Promise<any[]>;
      run: (sql: string, params?: any[]) => Promise<any>;
    };
  }
}
