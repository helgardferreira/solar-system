import * as THREE from "three";

export default class SolarSystem {
  canvas: HTMLCanvasElement;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.5,
      5_000_000,
    );
    this.camera.position.set(0, 5, 5);
    this.camera.lookAt(0, 0, 0);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.canvas,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.initScene();
  }

  initScene = () => {
    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(1, 100, 100),
      new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    );
    this.scene.add(planet);

    this.renderScene();
  };

  renderScene = () => {
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.renderScene);
  };
}
