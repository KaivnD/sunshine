import React, { Component } from "react";
import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  Mesh,
  Color,
  PlaneBufferGeometry,
  AmbientLight,
  GridHelper,
  ShadowMaterial,
  AxesHelper,
  DirectionalLight,
  CameraHelper,
  Fog,
  PCFSoftShadowMap,
  LineBasicMaterial,
} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export abstract class BaseScene<P = {}, S = {}> extends Component<P, S> {
  el!: HTMLDivElement;
  scene!: Scene;
  camera!: PerspectiveCamera;
  renderer!: WebGLRenderer;
  directionalLight1!: DirectionalLight;
  controls!: OrbitControls;

  componentDidMount() {
    this.scene = new Scene();

    this.godSayNeedLights();

    const retio = window.innerWidth / window.innerHeight;

    this.camera = new PerspectiveCamera(70, retio, 1, 10000);
    this.camera.position.set(0, 300, 0);
    this.camera.rotateX(-Math.PI / 2);
    this.scene.add(this.camera);

    this.godSayNeedHelp();

    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.scene.background = new Color(0x021122);
    this.scene.fog = new Fog(0x1a2050, 10000, 10000);

    this.godSayNeedControls();

    const planeGeometry = new PlaneBufferGeometry(2000, 2000);
    planeGeometry.rotateX(-Math.PI / 2);
    const planeMaterial = new ShadowMaterial({
      opacity: 0.2,
    });

    const plane = new Mesh(planeGeometry, planeMaterial);
    plane.name = "ground";
    plane.position.y = 0;
    plane.receiveShadow = true;
    this.scene.add(plane);

    this.el.appendChild(this.renderer.domElement);
    window.addEventListener("resize", () => this.onWindowResize(), false);

    this.onCreated();
    console.log(this.scene);
    this.animate();
  }

  abstract onCreated(): void;

  godSayNeedControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0, 0);
    this.controls.maxDistance = 2000;
    this.controls.minDistance = 100;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.1;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.4;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.15;

    this.controls.update();
  }

  godSayNeedHelp() {
    const grid = new GridHelper(2000, 100);
    grid.name = "grid";
    grid.position.y = 0;
    grid.visible = true;
    grid.material = new LineBasicMaterial({
      opacity: 0.1,
      transparent: true,
    });
    this.scene.add(grid);

    const axes = new AxesHelper(100);
    axes.name = "axes";
    axes.visible = false;
    axes.position.set(0, 0, 0);
    this.scene.add(axes);
  }

  godSayNeedLights() {
    const ambient = new AmbientLight(0xe8ecff, 1.4);
    ambient.name = "ambientLight";
    this.scene.add(ambient);

    this.directionalLight1 = new DirectionalLight(0xfff1f1, 0.7);
    this.directionalLight1.name = "directionalLight1";
    this.directionalLight1.position.set(-1000, 600, 1000);
    this.directionalLight1.castShadow = true;
    this.scene.add(this.directionalLight1);

    this.directionalLight1.shadow.mapSize.width = 2048;
    this.directionalLight1.shadow.mapSize.height = 2048;

    const d = 800;

    this.directionalLight1.shadow.camera.right = d;
    this.directionalLight1.shadow.camera.left = -d;
    this.directionalLight1.shadow.camera.top = d;
    this.directionalLight1.shadow.camera.bottom = -d;
    this.directionalLight1.shadow.camera.near = 0;
    this.directionalLight1.shadow.camera.far = 5000;

    const shadowCameraHelper = new CameraHelper(
      this.directionalLight1.shadow.camera
    );
    shadowCameraHelper.visible = false;
    shadowCameraHelper.name = "directionalLight1Helper";
    this.scene.add(shadowCameraHelper);

    const directionalLight2 = new DirectionalLight(0x87c0ff, 0.2);
    directionalLight2.name = "directionalLight2";
    directionalLight2.position.set(1, 1, -1);
    this.scene.add(directionalLight2);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  };

  componentWillUnmount() {
    if (!this.el) return;
    this.el.removeChild(this.renderer.domElement);
  }

  render() {
    return (
      <div
        ref={(el) => {
          if (!el) return;
          this.el = el;
        }}
      />
    );
  }
}
