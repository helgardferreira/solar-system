import * as THREE from "three";

export default class Orbit extends THREE.Group {
  public radius: number;
  public name: string;
  public curve: THREE.CatmullRomCurve3;
  public circumference: number;
  private geometry: THREE.TubeGeometry;
  private material: THREE.LineBasicMaterial;

  constructor(orbitRadius: number, segments: number = 90, name: string) {
    super();
    this.radius = orbitRadius;

    const orbitLine = new THREE.EllipseCurve(
      0, // ax
      0, // ay
      orbitRadius, // xRadius
      orbitRadius, // yRadius
      0, // aStartAngle
      2 * Math.PI, //  aEndAngle
      false, // aClockwise
      0 // aRotation
    );

    this.circumference = 2 * Math.PI * this.radius;

    this.curve = new THREE.CatmullRomCurve3(
      orbitLine
        .getPoints(1000)
        .map((point) => new THREE.Vector3(point.x, 0, point.y))
    );

    this.geometry = new THREE.TubeGeometry(this.curve, segments, 0.01, 90);
    this.material = new THREE.LineBasicMaterial({
      color: 0xffffff,
    });

    this.add(new THREE.Line(this.geometry, this.material));
    this.name = name;
  }

  public setActive = () => {
    this.material.color.set(0x30e3ca);
  };

  public setInactive = () => {
    this.material.color.set(0xffffff);
  };

  public dispose = () => {
    this.material.dispose();
    this.geometry.dispose();
  };
}
