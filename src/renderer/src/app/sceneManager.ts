import * as PIXI from 'pixi.js';
import Scene from '@app/scene/scene';
import { rscManager } from '@app/resource/resourceManager';
import { useLayoutStore } from '@store/layout';
import MapEditor from '@/app/scene/mapEditor/mapEditor';
import { find } from 'lodash-es';
import { useRscStore } from '@/store/rscStore';

export default class SceneManager extends PIXI.Container {
  private mSceneAry: Array<Scene>;
  private mCurrentSceneIdx: number;

  get currentScene(): Scene {
    return this.mSceneAry[this.mCurrentSceneIdx];
  }

  get currentSceneInfo(): TypeSceneInfo {
    return this.mSceneAry[this.mCurrentSceneIdx].info;
  }

  constructor() {
    super();

    this.mSceneAry = [];
    this.mCurrentSceneIdx = 0;
  }

  async init() {
    this.mCurrentSceneIdx = 0;
    this.mSceneAry = [new MapEditor(0, 'map-editor')];
  }

  async start() {
    const { name } = this.mSceneAry[0].info;
    try {
      
      await rscManager.getHandle.loadCommonRsc(useRscStore.common);
    } catch (e) {
      console.log(e);
      // location.replace(location.origin);
    }
    await this.changeScene(name);
  }

  async changeScene(sceneName: string) {
    await rscManager.getHandle.loadAllRsc(useRscStore[sceneName]);
    useLayoutStore.isLoading = true;

    this.removeChildren();
    await this.mSceneAry[this.mCurrentSceneIdx]?.endGame();
    const scene = find(this.mSceneAry, (e) => sceneName === e.info.name);
    await scene.init();
    this.addChild(scene);

    console.log(`--we go [${sceneName}]`);
    useLayoutStore.isLoading = false;
  }
}
