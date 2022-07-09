import { Component, createRef, ReactNode } from "react";

import Box from "./components/Box";
import List from "./components/List";
import PlanetListItem from "./components/PlanetListItem";
import { IPlanetProps } from "./components/Planet";
import solarSystem from "./components/SolarSystem";
import { planetStore } from "./stores/PlanetStore";
import { observer } from "mobx-react";

class App extends Component<any> {
  containerRef: React.RefObject<HTMLDivElement>;

  constructor(props: any) {
    super(props);
    this.containerRef = createRef<HTMLDivElement>();
  }

  // Could be handled inside of a useEffect of a function component
  componentDidMount = () => {
    if (this.containerRef.current) {
      this.containerRef.current.appendChild(solarSystem.canvas);
    }
  };

  componentWillUnmount = () => {
    if (this.containerRef.current) {
      this.containerRef.current.removeChild(solarSystem.canvas);
    }
  };

  // Could be invoked directly within a function component
  handleFocusPlanet = (planetName: string) => {
    planetStore.focusPlanet(planetName);
  };

  handleUnFocusPlanet = () => {
    planetStore.unFocus();
  };

  render() {
    return (
      <Box position="relative" ref={this.containerRef}>
        <Box position="absolute" top={10} left={10}>
          <Box
            padding={12}
            backgroundColor="#1B262C"
            borderRadius={8}
            width="fit-content"
          >
            <List color="#ffffff">
              <li onClick={this.handleUnFocusPlanet}>Back</li>
              {Array.from(planetStore.planetMap.keys()).map((planetName) => (
                <PlanetListItem
                  key={planetName}
                  isActive={planetName === planetStore.focussedPlanet?.name}
                  planetName={planetName}
                  handleClick={() => this.handleFocusPlanet(planetName)}
                  handleMouseEnter={() =>
                    planetStore.setOrbitActive(planetName)
                  }
                  handleMouseLeave={() =>
                    planetStore.setOrbitInactive(planetName)
                  }
                />
              ))}
            </List>
          </Box>

          {planetStore.focussedPlanet && (
            <Box
              padding="12px 32px 12px 12px"
              backgroundColor="#1B262C"
              borderRadius={8}
              width="fit-content"
              mt="8px"
              maxHeight="calc(100vh - 300px)"
              overflowY="auto"
            >
              <List color="#ffffff">
                <li onClick={this.handleUnFocusPlanet}>Close</li>

                {Object.keys(planetStore.focussedPlanet.props).map(
                  (propKey) => (
                    <li key={propKey}>
                      {propKey}:{" "}
                      {
                        planetStore.focussedPlanet?.props[
                          propKey as keyof IPlanetProps
                        ]
                      }
                    </li>
                  )
                )}

                {planetStore.planetImages
                  .get(planetStore.focussedPlanet.name)
                  ?.map((url) => (
                    <Box
                      key={url}
                      borderRadius={4}
                      width={400}
                      overflow="hidden"
                    >
                      <img width={400} key={url} src={url} alt="" />
                    </Box>
                  ))}
              </List>
            </Box>
          )}
        </Box>
      </Box>
    );
  }
}

export default observer(App);
