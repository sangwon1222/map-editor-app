import * as PIXI from 'pixi.js';
import { getOneTilePoints } from '@/util/editorFc';

/**
 * @description x,y => 2차배열의 x,y 좌표
 */
export default class EventTile extends PIXI.Container {
  private mPos: [x: number, y: number];
  private mTileGraphic: PIXI.Graphics;
  private mLineGraphic: PIXI.Graphics;

  constructor(x: number, y: number) {
    super();
    this.mPos = [x, y];
  }

  async drawTile() {
    this.removeChildren();

    this.mTileGraphic = new PIXI.Graphics();
    this.mTileGraphic.beginFill(0xffffff, 0.6);
    this.mTileGraphic.drawPolygon(getOneTilePoints());
    this.mTileGraphic.endFill();
    this.mTileGraphic.alpha = 0;
    this.mTileGraphic.zIndex = 2;

    this.mLineGraphic = new PIXI.Graphics();
    this.mLineGraphic.lineStyle(6, 0xfff000, 0.6);
    this.mLineGraphic.drawPolygon(getOneTilePoints());
    this.mLineGraphic.endFill();
    this.mLineGraphic.alpha = 0;
    this.mLineGraphic.zIndex = 1;

    this.addChild(this.mTileGraphic, this.mLineGraphic);
    this.sortableChildren = true

    this.mTileGraphic.eventMode = 'static';
    this.mTileGraphic.cursor = 'pointer';
    this.mTileGraphic.on('pointerenter', (e: PIXI.FederatedPointerEvent) => {
      if (e.altKey) return;
      e.preventDefault();
      e.stopPropagation();
      e.defaultPrevented = true;
      const [x, y]=this.mPos;

      this.mTileGraphic.alpha = 1;
      this.mLineGraphic.alpha = 1;
      this.onPointerEnter(x,y)
    });

    this.mTileGraphic.on('pointerout', (e: PIXI.FederatedPointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.defaultPrevented = true;
      const [x, y]=this.mPos;
      this.onPointerOut(x,y)

      this.mTileGraphic.alpha = 0;
      this.mLineGraphic.alpha = 0;
    });

    this.mTileGraphic.on('pointerdown', (e: PIXI.FederatedPointerEvent) => {
      if (e.altKey) return;
      const [x,y] = this.mPos
      // 우클릭
      if (e.pointerType === 'mouse' && e.button == 2) {
        this.onBlur(x,y)
        return;
      }
      //좌클릭
      e.preventDefault();
      e.stopPropagation();
      e.defaultPrevented = true;
      this.onPointerDown(x,y)
    });

    this.mTileGraphic.on('pointermove', (e: PIXI.FederatedPointerEvent) => {
      if (e.altKey) return;
      e.preventDefault();
      e.stopPropagation();
      e.defaultPrevented = true;
      const [x,y] = this.mPos
      this.onPointerMove(e.ctrlKey,x,y)
    });
  }


  focus() {
    this.mTileGraphic.alpha = 1;
    this.mLineGraphic.alpha = 1;
  }

  blur() {
    this.mTileGraphic.alpha = 0;
    this.mLineGraphic.alpha = 0;
  }

  onBlur(x:number,y:number){
    //
  }
  onPointerDown(x:number,y:number){
    //
  }
  onPointerMove(ctrlKey:boolean,x:number,y:number){
    //
  }
  onPointerEnter(x:number,y:number){
    //
  }
  onPointerOut(x:number,y:number){
    //
  }



}
