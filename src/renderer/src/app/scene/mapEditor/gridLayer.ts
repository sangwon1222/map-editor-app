import * as PIXI from 'pixi.js';
import { getOneTilePoints } from '@/util/editorFc';
import { canvasInfo } from '@/util/config';
import MapEditor from './mapEditor';
const { tileScale } = canvasInfo;

export default class GridLayer extends PIXI.Container {
  private mGridLayer: PIXI.Container;
  private mTileAry: null | any[][];
  constructor() {
    super();
    this.mGridLayer = new PIXI.Container();
    this.addChild(this.mGridLayer);

    this.mTileAry = [[], [], [], [], [], [], [], [], [], [], [], [], [], []];
  }
  async drawIsometric() {
    this.mGridLayer.removeChildren();
    const end = canvasInfo.width / canvasInfo.tileScale;

    for (let i = 0; i <= end; i += 2) {
      const startX = i * canvasInfo.tileScale;
      for (let j = 0; j <= end; j += 1) {
        const startY = j * canvasInfo.tileScale;
        const grid = new PIXI.Graphics();
        grid.lineStyle(2, 0x00ff00, 0.2);
        grid.moveTo(startX, startY);
        grid.lineTo(startX + canvasInfo.tileScale * 2, startY + canvasInfo.tileScale);
        grid.moveTo(startX + canvasInfo.tileScale * 2, startY);
        grid.lineTo(startX, startY + canvasInfo.tileScale);
        grid.closePath();
        grid.endFill();

        this.mGridLayer.addChild(grid);
      }
    }

    
    this.mGridLayer.pivot.set(this.mGridLayer.width / 2, this.mGridLayer.height / 2);
    this.mGridLayer.position.set(this.mGridLayer.width / 2, this.mGridLayer.height / 2);
  }

  moveMap(x: number, y: number) {
    const container = (this.parent as MapEditor).mapLayer;
    container.x += x;
    container.y += y;
  }
}
