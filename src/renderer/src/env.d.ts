/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_ACCESS_TIME: number
  readonly VITE_REFRESH_TIME: number
  readonly VITE_BASE_URL: string = 'http://192.168.0.9:1234'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
