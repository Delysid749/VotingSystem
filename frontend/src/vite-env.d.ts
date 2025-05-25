/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_WS_URL?: string
  readonly VITE_APP_NAME?: string
  readonly VITE_APP_VERSION?: string
  readonly VITE_DEBUG?: string
  readonly VITE_REQUEST_TIMEOUT?: string
  readonly VITE_WS_RECONNECT_ATTEMPTS?: string
  readonly VITE_WS_RECONNECT_INTERVAL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 