import { rscManager } from '@/app/resource/resourceManager';
import { canvasInfo } from '@/util/config';
import MapEditor from './mapEditor';
import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import EditItem from './editItem';
import Button from './button';
import { map } from 'lodash-es';
import { useTileStore } from '@/store/tile';

const toolWidth = 400;
export default class EditTool extends PIXI.Container {
  private mMapPosBtn: Button;
  private mSpriteList: Array<EditItem>;
  private mSpriteLayer: PIXI.Container;
  private mOpenSpriteLayer: boolean;
  private mChevron: Button
  constructor() {
    super();
    this.mOpenSpriteLayer = false;
  }

  async init() {
    await this.drawLayer();
    await this.drawChevron();
    await this.drawItem();
    await this.drawPosBtn();
  }

  resetSelectEditItem() {
    map(this.mSpriteList, (e) => e.blur());
    this.fold()
  }

  private async drawLayer() {
    /**sprite-layer */
    this.mSpriteLayer = new PIXI.Container();
    this.mSpriteLayer.position.set(canvasInfo.width, 0);
    this.mSpriteLayer.zIndex = 1;
    this.addChild(this.mSpriteLayer);

    /**bg */
    const bg = new PIXI.Graphics();
    bg.beginFill(0xbcbcbc, 1);
    bg.drawRect(0, 0, toolWidth, 800);
    bg.endFill();
    this.mSpriteLayer.addChild(bg);
  }

  async drawItem() {
    this.mSpriteList = [];
    let colId = 0;
    for (let i = 0; i < useTileStore.itemData.length; i++) {
      const gap = 20;
      const rowId = i % 3 ? 1 : 0;
      if (rowId === 0 && i > 0) colId += 1;

      const itemId = useTileStore.itemData[i].id;
      const editItems = new EditItem(itemId, useTileStore.itemData[i].tileName);
      editItems.init();
      this.mSpriteList.push(editItems);
      this.sortableChildren = true;

      const bgWidth = this.mSpriteList[i].width;
      const bgHeight = this.mSpriteList[i].height;
      const x = i % 3 ? rowId * (this.mSpriteList[i - 1].x + bgWidth) : 10;
      const y = colId * bgHeight + 10 ;

      this.mSpriteList[i].position.set(x + gap / 2, y + gap / 2);
      this.mSpriteList[i].zIndex = 2;
      this.mSpriteLayer.addChild(this.mSpriteList[i]);
    }
  }

  async drawChevron() {
    const scrWidth = canvasInfo.width;

    this.mChevron = new Button(rscManager.getHandle.getRsc('chevron.png', true), true);
    this.mChevron.rotation = (90 * Math.PI) / 180;
    this.mChevron.zIndex = 2;
    this.mChevron.position.set(scrWidth -this.mChevron.width, this.mChevron.height);
    this.mChevron.eventMode = 'static';
    this.mChevron.tint = this.mOpenSpriteLayer ? 0x00ff00 : 0xffffff;
    this.mChevron.onDown = () => {
      this.mOpenSpriteLayer = !this.mOpenSpriteLayer;
      if(this.mOpenSpriteLayer){
        this.open()
      }else{
        this.fold()
      }
    };

    this.addChild(this.mChevron);
  }

  open(){
    this.mOpenSpriteLayer = true
    const scrWidth = canvasInfo.width;
    this.mChevron.tint = 0x00ff00;
      const radian =   (-90 * Math.PI) / 180;
      const openPos = scrWidth - toolWidth -this.mChevron.width;
      const x =  scrWidth - toolWidth;

      gsap.to(this.mSpriteLayer, { x, duration: 0.5 });
      gsap.to(this.mChevron, { x: openPos, rotation: radian, duration: 0.5 });
  }

  fold(){
    this.mOpenSpriteLayer = false
    const scrWidth = canvasInfo.width;
    this.mChevron.tint = 0xffffff;
      const radian =  (90 * Math.PI) / 180;
      const openPos = scrWidth - this.mChevron.width;
      const x = scrWidth;

      gsap.to(this.mSpriteLayer, { x, duration: 0.5 });
      gsap.to(this.mChevron, { x: openPos, rotation: radian, duration: 0.5 });
  }

  async drawPosBtn() {
    this.mMapPosBtn = new Button(rscManager.getHandle.getRsc('pos-icon.png', true), true);
    this.mMapPosBtn.zIndex = 2;
    this.mMapPosBtn.position.set(canvasInfo.width - this.mMapPosBtn.width * 2, this.mMapPosBtn.height);
    this.mMapPosBtn.eventMode = 'static';
    this.mMapPosBtn.onDown = () => this.resetMapLayerPos();
  }

  private resetMapLayerPos() {
    const mapLayer = (this.parent as MapEditor).mapLayer;
    const gridLayer = (this.parent as MapEditor).gridLayer;

    const [x, y] = mapLayer.getInitPos;
    const duration = 0.25;
    gsap.to(mapLayer, { x, y, duration, onComplete: () => mapLayer.position.set(x, y) });
    gsap.to(gridLayer, { x, y, duration, onComplete: () => mapLayer.position.set(x, y) });
  }
}
