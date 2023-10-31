import Application from "@app/app";
import * as PIXI from 'pixi.js'
import { productLink, devLink } from "@/util/config";

export class rscManager {
  private static handle: rscManager;
  private mRscObject: TypeObjectAny;

  static get getHandle(): rscManager {
    const handle = rscManager.handle ? rscManager.handle : new rscManager();
    return handle;
  }

  get getRscList() {
    return this.mRscObject;
  }

  constructor() {
    rscManager.handle = this;
    this.mRscObject = {};
  }

  /**
   * @param src 리소스
   * @param common 여러 씬에서 공동으로 쓰일 경우 true, 아니면 안넣어줘도 된다.
   */
  public async loadRsc(src: string, sceneName: string, rscGroup: 'img'|'sound'|'json') {
    const currentSceneName = Application.getHandle.getScene?.info?.name;
    const scene = sceneName ? sceneName : currentSceneName;

    if (this.mRscObject[`${scene}/${src}`]) return;

    const url = `${productLink}rsc/${sceneName}/${rscGroup}/${src}`;
    console.log(url)
    
    try {
      PIXI.Assets.add({loadParesr:`${scene}/${src}`,src});
      this.mRscObject[`${scene}/${src}`] = await PIXI.Assets.load(url);
    } catch (e) {
      console.error(e, url);
    }
  }

  /** @description 배열로 리소스 리스트를 보내주면 모든 리소스 로드하는 함수 */
  public async loadAllRsc(rscInfoAry: TypeObjectStringAry) {
    const sceneName = Application.getHandle.getScene?.info?.name;
    for (const src of rscInfoAry.img) {
      await this.loadRsc(src, sceneName,'img');
    }
  }

  public async loadCommonRsc(rscInfoAry: TypeObjectStringAry) {
    for (const src of rscInfoAry.img) {
      await this.loadRsc(src, "common",'img');
    }
  }

  /**
   * @param srcKey 리소스 이름 ex) bomb.png, bomb.gif
   * @param common 공동으로 쓰이고 있으면 true, 없으면 안넣어줘도 된다.
   * @returns
   */
  public getRsc(srcKey: string, common?: boolean) {
    const sceneName = common ? "common" : Application.getHandle.getScene?.info?.name;
    const key = `${sceneName}/${srcKey}`;
    if (this.mRscObject[key]) return this.mRscObject[key];
    else {
      console.error(`[${key}] 이미지 없다.`);
      return null;
    }
  }
}
