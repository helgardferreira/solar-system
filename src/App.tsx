import { Component, createRef, ReactNode } from "react";
import SolarSystem from "./components/SolarSystem";

import Box from "./components/Box";
import List from "./components/List";

interface IAppState {
  solarSystem?: SolarSystem;
}

export default class App extends Component<any, IAppState> {
  canvasRef: React.RefObject<HTMLCanvasElement>;

  constructor(props: any) {
    super(props);
    this.canvasRef = createRef<HTMLCanvasElement>();

    this.state = {
      solarSystem: undefined,
    };
  }

  // Using a singleton here to prevent scene from being instantiating
  // multiple times - this is especially important due to React 18
  // causing multiple calls for componentDidMount and useEffect during
  // development
  componentDidMount = () => {
    if (this.canvasRef.current) {
      const solarSystem = SolarSystem.create(this.canvasRef.current);
      this.setState({
        solarSystem,
      });
    }
  };

  componentDidUpdate() {}

  render = (): ReactNode => {
    return (
      <Box position="relative">
        <Box
          padding={12}
          backgroundColor="#1B262C"
          borderRadius={8}
          position="absolute"
          top={10}
          left={10}
        >
          <List color="white">
            {this.state.solarSystem &&
              Array.from(this.state.solarSystem.planets.keys()).map(
                (planetName) => (
                  <li
                    key={planetName}
                    onClick={() => this.state.solarSystem?.goTo(planetName)}
                  >
                    {planetName}
                  </li>
                ),
              )}
          </List>
        </Box>
        <canvas ref={this.canvasRef} />
      </Box>
    );
  };
}
