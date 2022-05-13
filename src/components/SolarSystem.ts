import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Orbit from "./Orbit";
import Planet, { IPlanetProps } from "./Planet";

export default class SolarSystem {
  private canvas: HTMLCanvasElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private clock: THREE.Clock;
  private controls: OrbitControls;
  private renderer: THREE.WebGLRenderer;
  private ambientLight: THREE.AmbientLight;
  private planetGroup: THREE.Group;
  private orbitGroup: THREE.Group;
  private planets: Planet[] = [];
  private focussedPlanet?: Planet;

  private static instance: SolarSystem;

  // Unit of measurement is Megameters
  public planetMap = new Map<string, IPlanetProps>([
    [
      "mercury",
      {
        distanceFromSun: 58000,
        radius: 2.44 * 3000,
        orbitalVelocity: 47.4,
        rotationPeriod: 1407.6,
      },
    ],
    [
      "venus",
      {
        distanceFromSun: 108200,
        radius: 6.052 * 3000,
        orbitalVelocity: 35.0,
        rotationPeriod: -5832.5,
      },
    ],
    [
      "earth",
      {
        distanceFromSun: 149600,
        radius: 6.378 * 3000,
        orbitalVelocity: 29.8,
        rotationPeriod: 23.9,
      },
    ],
    [
      "mars",
      {
        distanceFromSun: 228000,
        radius: 3.396 * 3000,
        orbitalVelocity: 24.1,
        rotationPeriod: 24.6,
      },
    ],
    [
      "jupiter",
      {
        distanceFromSun: 778500,
        radius: 71.492 * 3000,
        orbitalVelocity: 13.1,
        rotationPeriod: 9.9,
      },
    ],
    [
      "saturn",
      {
        distanceFromSun: 1432000,
        radius: 60.268 * 3000,
        orbitalVelocity: 9.7,
        rotationPeriod: 10.7,
      },
    ],
    [
      "uranus",
      {
        distanceFromSun: 2867000,
        radius: 25.559 * 3000,
        orbitalVelocity: 6.8,
        rotationPeriod: -17.2,
      },
    ],
    [
      "neptune",
      {
        distanceFromSun: 4515000,
        radius: 24.764 * 3000,
        orbitalVelocity: 5.4,
        rotationPeriod: 16.1,
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
      5_000_000_000,
    );
    this.camera.position.set(0, 8_000_000, 8_000_000);
    this.camera.lookAt(0, 0, 0);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.canvas,
      logarithmicDepthBuffer: true,
    });

    this.controls = new OrbitControls(this.camera, this.canvas);

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(this.ambientLight);

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.planetGroup = new THREE.Group();
    this.orbitGroup = new THREE.Group();

    this.clock = new THREE.Clock();

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
      earth: textureLoader.load(
        await import("../textures/earth.jpeg").then(({ default: url }) => url),
      ),
      mars: textureLoader.load(
        await import("../textures/mars.jpeg").then(({ default: url }) => url),
      ),
      jupiter: textureLoader.load(
        await import("../textures/jupiter.jpeg").then(
          ({ default: url }) => url,
        ),
      ),
      saturn: textureLoader.load(
        await import("../textures/saturn.jpeg").then(({ default: url }) => url),
      ),
      uranus: textureLoader.load(
        await import("../textures/uranus.jpeg").then(({ default: url }) => url),
      ),
      neptune: textureLoader.load(
        await import("../textures/neptune.jpeg").then(
          ({ default: url }) => url,
        ),
      ),
    };
  };

  private findPlanet = (planetName: string): Planet | undefined => {
    return this.planets.find((planet) => planet.name === planetName);
  };

  private findOrbit = (planetName: string) => {
    return this.findPlanet(planetName)?.orbit;
  };

  public setOrbitActive = (planetName: string) => {
    this.findOrbit(planetName)?.setActive();
  };

  public setOrbitInactive = (planetName: string) => {
    this.findOrbit(planetName)?.setInactive();
  };

  public focusPlanet(planetName: string) {
    const planet = this.planets.find((planet) => planet.name === planetName);
    this.focussedPlanet = planet;
  }

  public unfocus() {
    this.focussedPlanet = undefined;

    this.camera.position.set(0, 8_000_000, 8_000_000);
    this.camera.lookAt(0, 0, 0);
    this.controls.target.set(0, 0, 0);
    this.controls.enabled = true;
    this.canvas.style.pointerEvents = "auto";
  }

  private goToPlanet = () => {
    if (this.focussedPlanet) {
      const offset = (this.focussedPlanet.props.radius ?? 1) * 5;
      this.camera.position
        .copy(this.focussedPlanet.object.position)
        .add(new THREE.Vector3(offset, offset, offset));
      this.camera.lookAt(this.focussedPlanet.object.position);
      this.controls.target.copy(this.focussedPlanet.object.position);
      this.controls.enabled = false;
      this.canvas.style.pointerEvents = "none";
    }
  };

  private initScene = async () => {
    const textures = await this.loadTextures();
    this.planetMap.forEach((props, planetName) => {
      const orbit = new Orbit(props.distanceFromSun, 90, planetName);
      this.orbitGroup.add(orbit.object);

      const planet = new Planet(
        props,
        planetName,
        orbit,
        textures[planetName as keyof typeof textures],
      );

      this.planets.push(planet);
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
    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.elapsedTime;

    this.goToPlanet();
    this.controls.update();

    this.planets.forEach((planet) => {
      planet.animate(elapsedTime, delta);
    });

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.renderScene);
  };

  public dispose = () => {
    console.log("disposing!");
    window.removeEventListener("resize", this.handleResize);
    this.renderer.dispose();
  };
}
