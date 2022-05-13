import { Component, createRef, ReactNode } from "react";
import SolarSystem from "./components/SolarSystem";

import Box from "./components/Box";
import List from "./components/List";
import PlanetListItem from "./components/PlanetListItem";

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
              Array.from(this.state.solarSystem.planetMap.keys()).map(
                (planetName) => (
                  <PlanetListItem
                    key={planetName}
                    planetName={planetName}
                    handleClick={() =>
                      this.state.solarSystem?.focusPlanet(planetName)
                    }
                    handleMouseEnter={() =>
                      this.state.solarSystem?.setOrbitActive(planetName)
                    }
                    handleMouseLeave={() =>
                      this.state.solarSystem?.setOrbitInactive(planetName)
                    }
                  />
                ),
              )}
          </List>
        </Box>
        <canvas ref={this.canvasRef} />
      </Box>
    );
  };
}
