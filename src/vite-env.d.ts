/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string
  readonly MODE: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly SSR: boolean
  // add other env vars here if needed, e.g. VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
