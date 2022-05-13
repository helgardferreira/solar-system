import * as THREE from "three";
import Orbit from "./Orbit";

export default class SolarSystem {
  private canvas: HTMLCanvasElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private static isInstantiated: boolean = false;

  // Using a singleton here to prevent scene from being instantiating
  // multiple times - this is especially important due to React 18
  // causing multiple calls for componentDidMount and useEffect during
  // development
  static create = (canvas: HTMLCanvasElement) => {
    if (!this.isInstantiated) {
      this.isInstantiated = true;
      return new SolarSystem(canvas);
    }
  };

  constructor(canvas: HTMLCanvasElement) {
    console.log("instantiating!");
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
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.addEventListeners();
    this.initScene();
  }

  private initScene = () => {
    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(1, 100, 100),
      new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    );
    const orbit = new Orbit(3, 90, "mercury");
    this.scene.add(orbit.object);
    this.scene.add(planet);

    this.renderScene();
  };

  private handleResize = () => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // Update camera
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    // Update renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  private addEventListeners() {
    window.addEventListener("resize", this.handleResize);
  }

  private renderScene = () => {
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.renderScene);
  };

  public dispose = () => {
    console.log("disposing!");
    window.removeEventListener("resize", this.handleResize);
    this.renderer.dispose();
  };
}
