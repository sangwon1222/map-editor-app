import * as PIXI from 'pixi.js';
import { rscManager } from '@/app/resource/resourceManager';
import { useItemStore } from '@/store/item';
import { useMapStore } from '@/store/map';
import { find } from 'lodash-es';
import gsap from 'gsap';

/**
 * @description x,y => 2차배열의 x,y 좌표
 */
export default class TileSprite extends PIXI.Container {
  private mPos: [x: number, y: number];
  private mItemId: number;
  private mItemSprite: PIXI.Sprite;

  get itemId(): number{
    return this.mItemId
  }
  get saveInfo(): {x:number,y:number,itemId:number}{
    const [x,y] = this.mPos
    return { x , y , itemId: this.mItemId }
  }
  
  constructor(x: number, y: number) {
    super();
    this.mItemId = -1;
    this.mPos = [x, y];
  }

  async drawTile() {
    this.removeChildren();
    const [x, y] = this.mPos;

    this.mItemSprite = new PIXI.Sprite();
    this.mItemSprite.tint = 0xffffff
    
    if (useMapStore.selectData.idx>0) this.setItem(useMapStore.mapJson[y][x].itemId);

    this.addChild( this.mItemSprite);
  }


  focus() {
    this.mItemSprite.tint = 0xbcbcbc
    this.mItemSprite.y = -20
  }
  blur() {
    this.mItemSprite.tint = 0xffffff
    this.mItemSprite.y = 0
  }


  setItem(itemId: number) {
    if(this.mItemId===itemId) return
    this.mItemId = itemId
    const option = find(useItemStore.itemData, (e) => e.id === this.mItemId);
    this.mItemSprite.texture = option ? rscManager.getHandle.getRsc(option.name) : null;
    this.mItemSprite.alpha=1
    if (option) {
      this.mItemSprite.anchor.set(0.5);
      this.mItemSprite.y = -10
      gsap.to(this.mItemSprite, {
        y: 0,
        duration: 0.25,
        onComplete: () => (this.mItemSprite.y = 0),
      });
}
  }

  resetItemId() {
    this.mItemId = -1;
    gsap.to(this.mItemSprite,{y:-10,alpha:0,duration:0.25,onComplete:()=>{
      this.mItemSprite.texture = null;
      this.mItemSprite.alpha=1
    }})
  }
}
