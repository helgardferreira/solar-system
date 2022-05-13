import * as THREE from "three";
import { Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Orbit from "./Orbit";
import Planet from "./Planet";

export default class SolarSystem {
  private canvas: HTMLCanvasElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private renderer: THREE.WebGLRenderer;
  private ambientLight: THREE.AmbientLight;
  private planetGroup: THREE.Group;
  private orbitGroup: THREE.Group;

  private static instance: SolarSystem;

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
    if (!this.instance) {
      this.instance = new SolarSystem(canvas);
    }

    return this.instance;
  };

  constructor(canvas: HTMLCanvasElement) {
    console.log("instantiating!");
    this.canvas = canvas;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.5,
      500_000_000,
    );
    this.camera.position.set(0, 250_000, 250_000);
    this.camera.lookAt(0, 0, 0);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.canvas,
    });

    this.controls = new OrbitControls(this.camera, this.canvas);

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

  public goTo = (planetName: string) => {
    const planet = this.planetGroup.children.find(
      (planet) => planet.name === planetName,
    );

    if (planet) {
      this.camera.position
        .copy(planet.position)
        .add(
          new THREE.Vector3(
            (this.planets.get(planetName)?.radius ?? 1) * 5,
            0,
            0,
          ),
        );
      this.camera.lookAt(planet.position);
      this.camera.updateProjectionMatrix();
      this.controls.target.copy(planet.position);
      this.controls.update();
    }
  };

  private initScene = async () => {
    const textures = await this.loadTextures();
    this.planets.forEach((props, planetName) => {
      const orbit = new Orbit(props.distanceFromSun, 90, planetName);
      this.orbitGroup.add(orbit.object);

      const planet = new Planet(
        props,
        planetName,
        orbit,
        textures[planetName as keyof typeof textures],
      );

      this.planetGroup.add(planet.object);
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
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.renderScene);
  };

  public dispose = () => {
    console.log("disposing!");
    window.removeEventListener("resize", this.handleResize);
    this.renderer.dispose();
  };
}
