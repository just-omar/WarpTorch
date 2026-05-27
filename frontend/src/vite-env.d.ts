/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FRONTEND_PORT: string
  readonly VITE_BACKEND_PORT: string
  readonly VITE_JUPYTER_PORT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
