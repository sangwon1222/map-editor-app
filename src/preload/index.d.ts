import { ElectronAPI } from '@electron-toolkit/preload'

interface TypdApi {
  [key: string]: any
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: TypdApi
  }
}
