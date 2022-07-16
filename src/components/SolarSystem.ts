import { autorun, IReactionDisposer } from "mobx";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { planetStore } from "../stores/PlanetStore";
import Orbit from "./Orbit";
import Planet, { IPlanetProps } from "./Planet";

class SolarSystem {
  public canvas: HTMLCanvasElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private clock: THREE.Clock;
  private controls: OrbitControls;
  private renderer: THREE.WebGLRenderer;
  private ambientLight: THREE.AmbientLight;
  private planetGroup: THREE.Group;
  private orbitGroup: THREE.Group;
  private focussedPlanet?: Planet;

  private disposePlanetEffect: IReactionDisposer | undefined;

  private get planets(): Planet[] {
    return this.planetGroup.children as Planet[];
  }

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.5,
      5_000_000_000
    );
    this.camera.position.set(0, 8_000_000, 8_000_000);
    this.camera.lookAt(0, 0, 0);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      logarithmicDepthBuffer: true,
    });
    this.canvas = this.renderer.domElement;

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
        await import("../textures/mercury.jpeg").then(({ default: url }) => url)
      ),
      venus: textureLoader.load(
        await import("../textures/venus.jpeg").then(({ default: url }) => url)
      ),
      earth: textureLoader.load(
        await import("../textures/earth.jpeg").then(({ default: url }) => url)
      ),
      mars: textureLoader.load(
        await import("../textures/mars.jpeg").then(({ default: url }) => url)
      ),
      jupiter: textureLoader.load(
        await import("../textures/jupiter.jpeg").then(({ default: url }) => url)
      ),
      saturn: textureLoader.load(
        await import("../textures/saturn.jpeg").then(({ default: url }) => url)
      ),
      uranus: textureLoader.load(
        await import("../textures/uranus.jpeg").then(({ default: url }) => url)
      ),
      neptune: textureLoader.load(
        await import("../textures/neptune.jpeg").then(({ default: url }) => url)
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
    return planet;
  }

  public unFocus() {
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
        .copy(this.focussedPlanet.position)
        .add(new THREE.Vector3(offset, offset, offset));
      this.camera.lookAt(this.focussedPlanet.position);
      this.controls.target.copy(this.focussedPlanet.position);
      this.controls.enabled = false;
      this.canvas.style.pointerEvents = "none";
    }
  };

  private initScene = async () => {
    console.log("init scene!");
    const textures = await this.loadTextures();

    // If a new value is added to planetMap - add a new planet to the scene
    // N.B. currently planetMap is not deeply observable
    // TODO: only add new planets / dispose and replace existing planets
    this.disposePlanetEffect = autorun(() => {
      planetStore.planetMap.forEach((props, planetName) => {
        const orbit = new Orbit(props.distanceFromSun, 90, planetName);
        this.orbitGroup.add(orbit);

        const planet = new Planet(
          props,
          planetName,
          orbit,
          textures[planetName as keyof typeof textures]
        );

        this.planetGroup.add(planet);
      });
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
    this.disposePlanetEffect && this.disposePlanetEffect();
    this.renderer.dispose();
  };
}

const solarSystem = new SolarSystem();

export default solarSystem;
