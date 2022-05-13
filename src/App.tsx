import { Component, createRef, ReactNode } from "react";
import SolarSystem from "./components/SolarSystem";

import Box from "./components/Box";
import List from "./components/List";
import PlanetListItem from "./components/PlanetListItem";
import Planet, { IPlanetProps } from "./components/Planet";

interface IAppState {
  solarSystem?: SolarSystem;
  focussedPlanet?: Planet;
}

export default class App extends Component<any, IAppState> {
  canvasRef: React.RefObject<HTMLCanvasElement>;

  constructor(props: any) {
    super(props);
    this.canvasRef = createRef<HTMLCanvasElement>();

    this.state = {};
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

  handleFocusPlanet = (planetName: string) => {
    this.setState({
      focussedPlanet: this.state.solarSystem?.focusPlanet(planetName),
    });
  };

  handleUnFocusPlanet = () => {
    this.state.solarSystem?.unFocus();
    this.setState({ focussedPlanet: undefined });
  };

  render = (): ReactNode => {
    return (
      <Box position="relative">
        <Box position="absolute" top={10} left={10}>
          <Box
            padding={12}
            backgroundColor="#1B262C"
            borderRadius={8}
            width="fit-content"
          >
            <List color="#ffffff">
              <li onClick={this.handleUnFocusPlanet}>Back</li>
              {this.state.solarSystem &&
                Array.from(this.state.solarSystem.planetMap.keys()).map(
                  (planetName) => (
                    <PlanetListItem
                      key={planetName}
                      isActive={planetName === this.state.focussedPlanet?.name}
                      planetName={planetName}
                      handleClick={() => this.handleFocusPlanet(planetName)}
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

          {this.state.focussedPlanet && (
            <Box
              padding={12}
              backgroundColor="#1B262C"
              borderRadius={8}
              width="fit-content"
              mt="8px"
            >
              <List color="#ffffff">
                <li onClick={this.handleUnFocusPlanet}>Close</li>

                {Object.keys(this.state.focussedPlanet.props).map((propKey) => (
                  <li key={propKey}>
                    {propKey}:{" "}
                    {
                      this.state.focussedPlanet?.props[
                        propKey as keyof IPlanetProps
                      ]
                    }
                  </li>
                ))}
              </List>
            </Box>
          )}
        </Box>
        <canvas ref={this.canvasRef} />
      </Box>
    );
  };
}
