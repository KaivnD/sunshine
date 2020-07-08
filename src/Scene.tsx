import { BaseScene } from "./BaseScene";
import { Mesh, BoxGeometry, MeshStandardMaterial } from "three";

export class Scene extends BaseScene {
  onCreated(): void {
    const geo = new BoxGeometry(100, 100, 100);
    geo.translate(0, 50, 0)
    const mat = new MeshStandardMaterial({
      roughness: 0.5,
      metalness: 0.5,
      side: 0
    });
    const mesh = new Mesh(geo, mat);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    this.scene.add(mesh);
  }
}
