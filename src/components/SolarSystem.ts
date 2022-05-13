import * as THREE from "three";
import { Vector3 } from "three";
import Orbit from "./Orbit";

export default class SolarSystem {
  private canvas: HTMLCanvasElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private ambientLight: THREE.AmbientLight;
  private planetGroup: THREE.Group;
  private orbitGroup: THREE.Group;

  private static isInstantiated: boolean = false;

  // Unit of measurement is Megameters
  public planets = new Map([
    [
      "mercury",
      {
        distanceFromSun: 58000,
        radius: 2.44,
      },
    ],
    [
      "venus",
      {
        distanceFromSun: 108200,
        radius: 6.052,
      },
    ],
  ]);

  // Using a singleton here to prevent scene from being instantiating
  // multiple times - this is especially important due to React 18
  // causing multiple calls for componentDidMount and useEffect during
  // development
  public static create = (canvas: HTMLCanvasElement) => {
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
      1000000,
    );
    this.camera.position.set(0, 500_000, 0);
    this.camera.lookAt(0, 0, 0);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.canvas,
    });

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(this.ambientLight);

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.planetGroup = new THREE.Group();
    this.orbitGroup = new THREE.Group();

    this.addEventListeners();
    this.initScene();
  }

  private loadTextures = async () => {
    const textureLoader = new THREE.TextureLoader();

    return {
      mercury: textureLoader.load(
        await import("../textures/mercury.jpeg").then(
          ({ default: url }) => url,
        ),
      ),
      venus: textureLoader.load(
        await import("../textures/venus.jpeg").then(({ default: url }) => url),
      ),
    };
  };

  private initScene = async () => {
    const textures = await this.loadTextures();
    this.planets.forEach((props, planetName) => {
      const orbit = new Orbit(props.distanceFromSun, 90, planetName);
      this.orbitGroup.add(orbit.object);

      const planetMaterial = new THREE.MeshStandardMaterial({
        map: textures[planetName as keyof typeof textures],
      });
      planetMaterial.side = THREE.DoubleSide;

      const planet = new THREE.Mesh(
        new THREE.SphereGeometry(props.radius, 100, 100),
        planetMaterial,
      );
      planet.name = planetName;

      planet.position.copy(orbit.curve.getPoint(0));

      this.planetGroup.add(planet);

      if (planetName === "mercury") {
        this.camera.position
          .copy(planet.position)
          .add(new Vector3(0, props.radius * 4, 0));
        this.camera.lookAt(planet.position);
        this.camera.updateProjectionMatrix();
      }
    });

    this.scene.add(this.planetGroup);
    this.scene.add(this.orbitGroup);

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
