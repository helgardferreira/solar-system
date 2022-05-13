import * as THREE from "three";
import Orbit from "./Orbit";

export default class Planet {
  public name: string;
  public props: any;
  public orbit: Orbit;
  public object: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>;
  private material: THREE.MeshStandardMaterial;
  private geometry: THREE.SphereGeometry;

  constructor(
    props: any,
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
  }

  public animate = (elapsedTime: number) => {
    const moveFactor = elapsedTime % 1;
    this.object.position.copy(this.orbit.curve.getPoint(moveFactor));
  };

  public dispose = () => {
    this.material.dispose();
    this.geometry.dispose();
  };
}
