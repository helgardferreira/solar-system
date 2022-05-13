import { Component, createRef, ReactNode } from "react";
import SolarSystem from "./components/SolarSystem";

export default class App extends Component {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  solarSystem?: SolarSystem;

  constructor(props: any) {
    super(props);
    this.canvasRef = createRef<HTMLCanvasElement>();
  }

  // Using a singleton here to prevent scene from being instantiating
  // multiple times - this is especially important due to React 18
  // causing multiple calls for componentDidMount and useEffect during
  // development
  componentDidMount = () => {
    if (this.canvasRef.current) {
      this.solarSystem = SolarSystem.create(this.canvasRef.current);
    }
  };

  render(): ReactNode {
    return <canvas ref={this.canvasRef} />;
  }
}
