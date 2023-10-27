import { app } from 'electron'
const { Menu, Tray } = require('electron')

class CustomTray {
  private mTray: any
  private mWin: any
  private mIsQuit = false

  get getTray() {
    return this.mTray
  }
  get quitMode() {
    return this.mIsQuit
  }

  init(window, icon) {
    this.mWin = window
    this.mTray = new Tray(icon)

    this.setMenu()
    this.mTray.on('click', () => {
      const isVisible = this.mWin.isVisible()
      if (!isVisible)  this.mWin.show()
      else this.mWin.hide()
    })
  }

  setMenu() {
    const type = 'normal'
    const myMenu = Menu.buildFromTemplate([
      { label: 'SONID', enabled: false },
      { label: '열기', type, click: () => this.mWin.show() },
      { label: '최소화', type, click: () => this.mWin.minimize() },
      { label: '닫기', type, click: () => this.mWin.hide() },
      { label: '', type: 'separator' },
      {
        label: '종료',
        type,
        click: () => {
          this.mIsQuit = true
          app.exit()
        }
      }
    ])
    this.mTray.setToolTip('SONID TODO')
    this.mTray.setContextMenu(myMenu)
  }

}

export default new CustomTray()
