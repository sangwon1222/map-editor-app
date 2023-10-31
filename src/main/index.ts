import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
const fs =  require("fs");
import tray from './tray'
import MailApi from './mail'
import DBbase from './DBbase'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {icon}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      // webSecurity: false,
      // allowRunningInsecureContent: true
    },
  })
  mainWindow.removeMenu()

  MailApi.init(ipcMain)

  tray.init(mainWindow, icon)

  mainWindow.on('close', function (event) {
    event.preventDefault()
    if (tray.quitMode) {
      app.exit()
    } else {
      mainWindow.hide()
    }
  })

  // ipcMain.handle('', (event: Electron.IpcMainInvokeEvent, _res: any) => {
  //   event.sender.send('on-test', { first: 'hello' })
  //   return fs.readdirSync('./')
  // })
  

  ipcMain.handle('connectDB',async (_event: Electron.IpcMainInvokeEvent, _res: any) => {
    return await DBbase.connectDB()
  })
  ipcMain.handle('readDB',async (_event: Electron.IpcMainInvokeEvent, _res: any) => {
    return await DBbase.read()
  })
  ipcMain.handle('insertDB',async (_event: Electron.IpcMainInvokeEvent, res: any) => {
    return await DBbase.insert({...res})
  })
  ipcMain.handle('updateDB',async (_event: Electron.IpcMainInvokeEvent, res: any) => {
    return await DBbase.update({...res})
  })
  ipcMain.handle('deleteAllDB',async (_event: Electron.IpcMainInvokeEvent, _res: any) => {
    return await DBbase.deleteAll()
  })
  ipcMain.handle('recreateDB',async (_event: Electron.IpcMainInvokeEvent, _res: any) => {
    await DBbase.dropTable()
    return await DBbase.connectDB()
  })

  ipcMain.handle('insertTile',async (_event: Electron.IpcMainInvokeEvent, res: any) => {
    return await DBbase.insertTile({...res})
  })

  ipcMain.handle('getTile',async (_event: Electron.IpcMainInvokeEvent, _res: any) => {
    return await DBbase.getTile()
  })

  

  ipcMain.handle('updateRsc',async (_event: Electron.IpcMainInvokeEvent, res: any) => {
    const { rscObj, sceneName } = res
    const result = [] as string[]
    
    const rscObject = JSON.parse(rscObj)

    try{

      for(const rscName in rscObject){
        const rscPath = rscObject[rscName]
        
        console.log({rscName,rscPath})
        fs.readFile(rscPath,(err,data)=>{
          if(err){
            console.log({readError: err})
            return 
          }

          //const serverPath = `C:/Users/sonid/Desktop/lsw/private_server/mainpage/api/public/rsc/${sceneName}/img/${rscName}`
          const serverPath = `http://lsw.kr/rsc/${sceneName}/img/${rscName}`
          const isExist = fs.existsSync(serverPath)
          console.log({isExist})
          
          if(isExist) result.push(rscName)
          if(!isExist) {
            // const buffer = Buffer.from(data).toString('base64');
            const buffer = Buffer.from(data,'base64')
            console.log(buffer)

            fs.writeFile(
              serverPath,
              buffer,
              (err,_data)=>{
                
                if(err){
                  console.log({writeError:err})
                  result.push(rscName)
                }
              }
            );
          }
        })

      }
      return {ok:true, fail: result.length, result};
    } catch(e) {
      return {ok:false, fail: result.length, result,msg: e};
    }

  })



  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
