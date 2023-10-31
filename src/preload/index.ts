import { contextBridge, ipcRenderer } from 'electron'
import { ElectronAPI, electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  sendGmail: async (stringData: string) => {
    return new Promise((resolve, _reject) => {
      ipcRenderer.invoke('sendGmail',stringData).then((result) => resolve(result) )
    })
  },
  connectDB: async () => {
    return new Promise((resolve, _reject) => {
      ipcRenderer.invoke('connectDB').then((result) => resolve(result) )
    })
  },
  readDB: async () => {
    return new Promise((resolve, _reject) => {
      ipcRenderer.invoke('readDB').then((result) => resolve(result) )
    })
  },
  insertDB: async (stringData: string,mapName:string) => {
    return new Promise((resolve, _reject) => {
      const date = new Date();
      const month = `0${date.getMonth() + 1}`.slice(-2);
      const day = `0${date.getDate()}`.slice(-2);
      const hour = `0${date.getHours()}`.slice(-2);
      const minute = `0${date.getMinutes()}`.slice(-2);
      const seconds = `0${date.getSeconds()}`.slice(-2);
      const time =  `${date.getFullYear()}-${month}-${day}/${hour}:${minute}:${seconds}`;
      
      ipcRenderer.invoke('insertDB',{tileData:stringData.replaceAll(`"`,'`'),mapName,time})
      .then((result) => resolve(result) )
    })
  },
  updateDB: async (mapId:number,stringData: string) => {
    return new Promise((resolve, _reject) => {
      const date = new Date();
      const month = `0${date.getMonth() + 1}`.slice(-2);
      const day = `0${date.getDate()}`.slice(-2);
      const hour = `0${date.getHours()}`.slice(-2);
      const minute = `0${date.getMinutes()}`.slice(-2);
      const seconds = `0${date.getSeconds()}`.slice(-2);
      const time =  `${date.getFullYear()}-${month}-${day}/${hour}:${minute}:${seconds}`;
      
      ipcRenderer.invoke('updateDB',{mapId,tileData:stringData.replaceAll(`"`,'`'),time})
      .then((result) => resolve(result) )
    })
  },
  deleteAllDB: async () => {
    return new Promise((resolve, _reject) => {
      ipcRenderer.invoke('deleteAllDB').then((result) => resolve(result) )
    })
  },
  recreateDB: async () => {
    return new Promise((resolve, _reject) => {
      ipcRenderer.invoke('recreateDB').then((result) => resolve(result) )
    })
  },

  getTile: async () => {
    return new Promise((resolve, _reject) => {
      ipcRenderer.invoke('getTile').then((result) => resolve(result) )
    })
  },
  insertTile: async (tileName: string,sceneName: string) => {
    return new Promise((resolve, _reject) => {
      ipcRenderer.invoke('insertTile',{tileName,sceneName }).then((result) => resolve(result) )
    })
  },
  
  
  updateRsc: async (rscObj: string, sceneName:string)=>{
    return new Promise((resolve, _reject) => {
      ipcRenderer.invoke('updateRsc',{ rscObj, sceneName }).then((result) => resolve(result) )
    })
  },

}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api as TypeApi
}

interface TypeApi {
  sendGmail: any
  connectDB: any
  readDB: any
  insertDB: any
  deleteAllDB: any
  recreateDB: any
  updateDB: any
  updateRsc: any
  insertTile:any
  getTile:any
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: TypeApi
  }
}