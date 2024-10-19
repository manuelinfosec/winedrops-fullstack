import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Define config and set NODE_ENV based on the mode
export default defineConfig(({ mode }) => {
  process.env.NODE_ENV = mode === "production" ? "production" : "development";

  return {
    plugins: [react()],
  };
});
