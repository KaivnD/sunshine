import { BaseScene } from "./BaseScene";
import { Mesh, BoxGeometry, MeshStandardMaterial } from "three";

export class Scene extends BaseScene {
  onCreated(): void {
    const geo = new BoxGeometry(100, 100, 100);
    const mat = new MeshStandardMaterial();
    const mesh = new Mesh(geo, mat);
    this.scene.add(mesh);
  }
}
