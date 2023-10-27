import * as PIXI from 'pixi.js';
import { canvasInfo } from '@/util/config';
import MapGridLine from './mapGridLine';
import MapEditor from './mapEditor';
import { map } from 'lodash-es';
import Tile from './eventTile';
import TileSprite from './tileSprite';
import EventTile from './eventTile';
import { useMapStore } from '@/store/map';
const { tileScale } = canvasInfo;

const scaleScope = 0.02;
export default class MapLayer extends PIXI.Container {
  private mTileLayer: PIXI.Container;
  private mGridLineLayer: PIXI.Container;
  private mTileSpriteLayer: PIXI.Container;
  private mInitPos: number[];
  private mTileAry: null | Tile[][];
  private mTileSpriteAry: null | TileSprite[][];
  private mGridLine: MapGridLine;
  private mSelectedItemId: number;

  get selectedItemId(): number {
    return this.mSelectedItemId;
  }

  get getInitPos(): number[] {
    return this.mInitPos;
  }

  constructor(x: number, y: number) {
    super();
    this.mSelectedItemId = -1;
    this.mInitPos = [x, y];

    this.mTileLayer = new PIXI.Container();
    this.mTileLayer.zIndex = 3;

    this.mGridLineLayer = new PIXI.Container();
    this.mGridLineLayer.zIndex = 2;

    this.mTileSpriteLayer = new PIXI.Container();
    this.mTileSpriteLayer.zIndex = 1;

    this.sortableChildren = true;
    this.mTileAry = [[], [], [], [], [], [], [], [], [], [], [], [], [], []];
    this.mTileSpriteAry = [[], [], [], [], [], [], [], [], [], [], [], [], [], []]

    this.addChild(this.mTileLayer, this.mGridLineLayer, this.mTileSpriteLayer);
  }

  async init() {
    await this.drawLine();
    await this.drawTile();
  }

  selectItem(itemId: number) {
    this.mSelectedItemId = itemId;
  }

  async drawLine() {
    this.mGridLine = new MapGridLine();
    const { width } = canvasInfo;
    await this.mGridLine.drawGrid([0, 0, width / 2, width / 4, 0, width / 2, -width / 2, width / 4]);
    this.mGridLineLayer.addChild(this.mGridLine);
  }

  async drawTile() {
    for (let x = 0; x < 14; x++) {
      for (let y = 0; y < 14; y++) {
        const startX = x - y;
        const tile = new EventTile(x, y);
        await tile.drawTile();
        tile.position.set(startX * tileScale, (y * tileScale) / 2 + (x * tileScale) / 2);
        this.mTileAry[y][x] = tile;
        tile.onBlur =(x:number,y:number) => this.resetItemId(x,y)
        tile.onPointerDown =(x:number,y:number) => this.tilePointerDown(x,y)
        tile.onPointerEnter =(x:number,y:number) => this.tilePointerEnter(x,y)
        tile.onPointerMove =(ctrlKey:boolean,x:number,y:number) => this.tilePointerMove(ctrlKey,x,y)
        tile.onPointerOut =(x:number,y:number) => this.tilePointerOut(x,y)

        this.mTileLayer.addChild(tile);

        const tileSprite = new TileSprite(x, y);
        await tileSprite.drawTile();
        tileSprite.position.set(startX * tileScale, (y * tileScale) / 2 + (x * tileScale) / 2);
        this.mTileSpriteAry[y][x] = tileSprite;

        this.mTileSpriteLayer.addChild(tileSprite);
      }
    }
  }


  resetItemId(x:number,y:number){
    this.mTileSpriteAry[y][x].resetItemId()
  }

  tilePointerDown(x:number,y:number){
    this.mTileSpriteAry[y][x].setItem(this.mSelectedItemId)
  }

  tilePointerEnter(x:number,y:number){
    this.mTileSpriteAry[y][x].focus()
  }
  tilePointerOut(x:number,y:number){
    this.mTileSpriteAry[y][x].blur()
  }
  tilePointerMove(ctrlKey:boolean,x:number,y:number){
    if(ctrlKey) this.mTileSpriteAry[y][x].setItem(this.mSelectedItemId)
  }

  scaleUp() {
    this.scale.x += scaleScope;
    this.scale.y += scaleScope;
  }
  scaleDown() {
    this.scale.x -= scaleScope;
    this.scale.y -= scaleScope;
  }

  moveMap(x: number, y: number) {
    const container = (this.parent as MapEditor).mapLayer;
    container.x += x;
    container.y += y;
  }

  saveMapData() {
    return  map(this.mTileSpriteAry, (e) => map(e, (i) => (i.saveInfo)));
  }
}
