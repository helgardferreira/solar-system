import * as THREE from "three";

export default class Orbit {
  radius: number;
  name: string;
  curve: THREE.CatmullRomCurve3;
  object: THREE.Line<THREE.TubeGeometry, THREE.LineBasicMaterial>;

  constructor(orbitRadius: number, segments: number = 90, name: string) {
    this.radius = orbitRadius;

    const orbitLine = new THREE.EllipseCurve(
      0, // ax
      0, // ay
      orbitRadius, // xRadius
      orbitRadius, // yRadius
      0, // aStartAngle
      2 * Math.PI, //  aEndAngle
      false, // aClockwise
      0, // aRotation
    );

    this.curve = new THREE.CatmullRomCurve3(
      orbitLine
        .getPoints(1000)
        .map((point) => new THREE.Vector3(point.x, 0, point.y)),
    );

    this.object = new THREE.Line(
      new THREE.TubeGeometry(this.curve, segments, 0.01, 90),
      new THREE.LineBasicMaterial({
        color: 0xffffff,
      }),
    );
    this.object.name = name;
    this.name = name;
  }
}
