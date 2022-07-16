import * as THREE from "three";
import Orbit from "./Orbit";

export interface IPlanetProps {
  distanceFromSun: number;
  radius: number;
  orbitalVelocity: number;
  rotationPeriod: number;
}

export default class Planet extends THREE.Group {
  public rotationSpeed: number;
  public name: string;
  public props: IPlanetProps;
  public orbit: Orbit;
  private material: THREE.MeshStandardMaterial;
  private geometry: THREE.SphereGeometry;

  constructor(
    props: IPlanetProps,
    planetName: string,
    orbit: Orbit,
    texture: THREE.Texture
  ) {
    super();
    this.name = planetName;
    this.props = props;
    this.orbit = orbit;
    this.geometry = new THREE.SphereGeometry(props.radius, 100, 100);
    this.material = new THREE.MeshStandardMaterial({
      map: texture,
    });
    this.material.side = THREE.DoubleSide;

    this.add(new THREE.Mesh(this.geometry, this.material));

    this.position.copy(this.orbit.curve.getPoint(0));

    this.rotationSpeed = 1 / this.props.rotationPeriod;
  }

  public animate = (elapsedTime: number, delta: number) => {
    const moveFactor = ((elapsedTime / 500) * this.props.orbitalVelocity) % 1;
    this.position.copy(this.orbit.curve.getPoint(moveFactor));
    const rotateFactor = delta * this.rotationSpeed * 10;
    this.rotateY(rotateFactor);
  };

  public dispose = () => {
    this.material.dispose();
    this.geometry.dispose();
  };
}
