/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string; // Add all your environment variables here
  readonly VITE_PRODUCTION_API_URL: string;
  // add other variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
