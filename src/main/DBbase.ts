const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')
interface TypeDBResponse {
  ok: boolean
  msg?: string
  data?: any | undefined
  tileData?: any | undefined
  user?: any | undefined
  json?: any | undefined
}
const createTableSQL =
  'CREATE TABLE IF NOT EXISTS mapData (' +
  'idx INTEGER NOT NULL UNIQUE, ' +
  'mapName TEXT NOT NULL,' +
  'tileData TEXT NOT NULL,' +
  'time TEXT,' +
  'password TEXT DEFAULT "000000",' +
  'PRIMARY KEY(idx AUTOINCREMENT)' +
  ')'

const createTileTableSQL =
  'CREATE TABLE IF NOT EXISTS tileTable (' +
  'idx INTEGER NOT NULL UNIQUE, ' +
  'tileName TEXT NOT NULL,' +
  'sceneName TEXT NOT NULL,' +
  'zIndex TEXT NOT NULL DEFAULT "0",' +
  'PRIMARY KEY(idx AUTOINCREMENT)' +
  ')'

const dataFilePath = './db/editor-data.db'

const path = "C:/Users/sonid/Desktop/lsw/private_server/mainpage/api/public/rsc/"
class DBbase {
  private mDB: any

  async _check() {
    return this.mDB
  }

  async _reConnect() {
    const { ok, msg } = await this.connectDB()
    if (!ok) console.error(msg)
    return { ok, msg }
  }

  async disconnectDB() {
    this.mDB?.close()
  }

  async connectDB(): Promise<TypeDBResponse> {
    try {
      const createMapDB = await this.createMapDataTable()
      console.log('createMapDB')
      const createTileTable = await this.createTileDataTable()
      

      if (createMapDB.ok) {
        const read = await this.read()
        return { ok: read.ok, data: read.data, tileData: createTileTable.data,  msg: `${read.msg}+ ${createTileTable.msg}` }
      } else {
        return { ok: false, data: createMapDB.msg  }
      }
    } catch (e: any) {
      this.mDB = null
      return { ok: false, data: [], msg: e.message }
    }
  }

   async createMapDataTable(): Promise<TypeDBResponse> {
    return new Promise((resolve, _reject) => {
      const bindDB = () => {
        this.mDB = new sqlite3.Database(dataFilePath, (e) => {
          if(e) console.log('DB ERROR', e)
        })
        this.mDB.run(createTableSQL, () => {
          resolve({ ok: true, data: [], msg: 'Map Data DB 생성 완료' })
        })
      }

      try {
        if (!fs.existsSync('./db')) {
          fs.mkdirSync('./db')
        }
        fs.writeFileSync(dataFilePath, '', { flag: 'wx' })

        bindDB()
      } catch (e) {
        const error = e as any

        switch (error.code) {
          case 'EEXIST':
            bindDB()
            break
          default:
            this.mDB = null
            resolve({ ok: false, msg: error.message })
            break
        }
      }
    })
  }

  async createTileDataTable(): Promise<TypeDBResponse> {
    return new Promise((resolve, _reject) => {
      const bindDB = () => {
        this.mDB = new sqlite3.Database(dataFilePath, (e) => e ? console.log('DB ERROR', e) : null )

        this.mDB.run(createTileTableSQL, async () => {
          const rscList = {common:[],'map-editor':[]} as {[key: string]: string[]}
          
          await fs.readdir(`${path}map-editor/img/`, async (error, filelist) =>{
            if(error) return
            rscList['map-editor'] = filelist
            for(const tileName of rscList['map-editor']) await this.insertTile({tileName,sceneName:'map-editor'})
            await fs.readdir(`${path}common/img/`, async (error, filelist) =>{
              if(error) return
              rscList['common'] = filelist
              for(const tileName of rscList['common']) await this.insertTile({tileName,sceneName:'common'})
              const { data } = await this.getTile()
      
                resolve({ ok: true, data, msg: 'Tile Data DB 생성 완료' })
            });
          });
        })
      }

      try {
        if (!fs.existsSync('./db')) {
          fs.mkdirSync('./db')
        }
        fs.writeFileSync(dataFilePath, '', { flag: 'wx' })

        bindDB()
      } catch (e) {
        const error = e as any

        switch (error.code) {
          case 'EEXIST':
            bindDB()
            break
          default:
            this.mDB = null
            resolve({ ok: false, msg: error.message })
            break
        }
      }
    })
  }

  async dropTable(): Promise<TypeDBResponse> {
    return new Promise((resolve, _reject) => {
      try {
        const sql = 'DROP TABLE mapData'
        this.mDB.run(sql)
        resolve({ ok: true, msg: '테이블 삭제 성공' })
      } catch (e: any) {
        resolve({ ok: false, msg: e.message })
      }
    })
  }

  async read(): Promise<TypeDBResponse> {
    return new Promise((resolve, _reject) => {
      // const sql = 'SELECT * FROM mapData ORDER BY idx ASC'
      const sql = 'SELECT * FROM mapData'
      const data = []
      try {
        this.mDB.all(sql, [], (err: any, rows: []) => {
          if (err) {
            console.log(err)
            return resolve({ ok: false, data, msg: err })
          }

          rows.forEach((row) => {
            data.push(row)
          })
          resolve({ ok: true, data, msg: 'DB조회 성공' })
        })
      } catch (e: any) {
        const msg = this.mDB ? e.message : 'DB연결이 안되어 있습니다.'
        resolve({ ok: false, msg, data: [] })
      }
    })
  }

  async insert({mapName,tileData,time}:{mapName: string,tileData: string,time:string}) :Promise<TypeDBResponse> {
    return new Promise((resolve, _reject) => {
      try {

        const sql = `SELECT * FROM mapData WHERE mapName = "${mapName}"`
        this.mDB.all(sql, [], (err: any, rows: []) => {
          if (err) {
            resolve({ ok: false, msg: err })
            return
          }
          if(rows&&rows.length>0){
            resolve({ ok: false, data: rows, msg: '중복된 이름이 있습니다.' })
            return
          }
        })

        const insertSQL = `
          INSERT INTO mapData
          ( mapName,tileData , time )
          VALUES
          ( "${mapName}","${tileData}" ,"${time}" )
        `
        this.mDB.run(insertSQL, (err) => {
          if (err) {
            console.error(err.message)
            resolve({ ok: false, msg: err.message })
          } else {
            resolve({ ok: true, msg: '데이터 추가 성공' })
          }
        })
      } catch (e: any) {
        resolve({ ok: false, msg: `저장 실패` })
      }
    })
  }

  async update({mapId,tileData,time}:{mapId:number,tileData: string,time:string}) :Promise<TypeDBResponse> {
    return new Promise((resolve, _reject) => {
      try {
        const updateSQL = `
        UPDATE mapData
        SET
          tileData = "${tileData}",
          time = "${time}"
        WHERE
          idx = "${mapId}"
        `
        this.mDB.run(updateSQL, (err) => {
          if (err) {
            console.error(err.message)
            resolve({ ok: false, msg: err.message })
          } else {
            resolve({ ok: true, msg: '데이터 UPDATE 성공' })
          }
        })
      } catch (e: any) {
        resolve({ ok: false, msg: `저장 실패` })
      }
    })
  }

  async deleteAll() {
    try {
      const sql = 'DELETE FROM mapData'
      this.mDB.run(sql)

      return { ok: true, msg: '데이터 삭제 성공' }
    } catch (e: any) {
      return { ok: false, msg: e.message }
    }
  }

  async getTile(): Promise<TypeDBResponse> {
    return new Promise((resolve, _reject) => {
      const sql = 'SELECT * FROM tileTable ORDER BY idx ASC'
      const data = []
      try {
        this.mDB.all(sql, [], (err: any, rows: []) => {
          if (err) {
            return resolve({ ok: false, data, msg: err })
          }

          rows.forEach((row) => {
            data.push(row)
          })
          resolve({ ok: true, data, msg: 'DB조회 성공' })
        })
      } catch (e: any) {
        const msg = this.mDB ? e.message : 'DB연결이 안되어 있습니다.'
        resolve({ ok: false, msg, data: [] })
      }
    })
  }

  async insertTile({tileName, sceneName}:{tileName: string,sceneName: string}) :Promise<TypeDBResponse> {
    return new Promise((resolve, _reject) => {
      try {

        const sql = `SELECT * FROM tileTable WHERE tileName = "${tileName}"`
        this.mDB.all(sql, [], (err: any, rows: []) => {
          if (err) {
            resolve({ ok: false, msg: err })
            return
          }
          if( rows && rows.length>0 ){
            resolve({ ok: false, data: rows, msg: '중복된 이름이 있습니다.' })
            return
          }

          const insertSQL = `
            INSERT INTO tileTable
            ( tileName, sceneName )
            VALUES
            ( "${tileName}","${sceneName}" )
          `
          this.mDB.run(insertSQL, (err) => {
            if (err) {
              console.error(err.message)
              resolve({ ok: false, msg: err.message })
            } else {
              console.log(`타일 [ ${tileName},${sceneName} ] 추가 성공`)
              resolve({ ok: true, msg: '타일 데이터 추가 성공' })
            }
          })
        })
        

       
      } catch (e: any) {
        resolve({ ok: false, msg: `저장 실패` })
      }
    })
  }
}

export default new DBbase()
