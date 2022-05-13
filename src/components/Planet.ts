import * as THREE from "three";
import Orbit from "./Orbit";

export interface IPlanetProps {
  distanceFromSun: number;
  radius: number;
  orbitalVelocity: number;
  rotationPeriod: number;
}

export default class Planet {
  public rotationSpeed: number;
  public name: string;
  public props: IPlanetProps;
  public orbit: Orbit;
  public object: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>;
  private material: THREE.MeshStandardMaterial;
  private geometry: THREE.SphereGeometry;

  constructor(
    props: IPlanetProps,
    planetName: string,
    orbit: Orbit,
    texture: THREE.Texture,
  ) {
    this.name = planetName;
    this.props = props;
    this.orbit = orbit;
    this.geometry = new THREE.SphereGeometry(props.radius, 100, 100);
    this.material = new THREE.MeshStandardMaterial({
      map: texture,
    });
    this.material.side = THREE.DoubleSide;

    this.object = new THREE.Mesh(this.geometry, this.material);
    this.object.name = planetName;

    this.object.position.copy(this.orbit.curve.getPoint(0));

    this.rotationSpeed = 1 / this.props.rotationPeriod;
  }

  public animate = (elapsedTime: number, delta: number) => {
    const moveFactor = ((elapsedTime / 500) * this.props.orbitalVelocity) % 1;
    this.object.position.copy(this.orbit.curve.getPoint(moveFactor));
    const rotateFactor = delta * this.rotationSpeed * 10;
    this.object.rotateY(rotateFactor);
  };

  public dispose = () => {
    this.material.dispose();
    this.geometry.dispose();
  };
}
