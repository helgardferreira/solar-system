import { Component, createRef, ReactNode } from "react";
import SolarSystem from "./components/SolarSystem";

export default class App extends Component {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  solarSystem?: SolarSystem;

  constructor(props: any) {
    super(props);
    this.canvasRef = createRef<HTMLCanvasElement>();
  }

  componentDidMount() {
    if (this.canvasRef.current) {
      this.solarSystem = new SolarSystem(this.canvasRef.current);
    }
  }

  render(): ReactNode {
    return <canvas ref={this.canvasRef} />;
  }
}
