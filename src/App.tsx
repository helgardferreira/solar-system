import { Component, createRef, ReactNode } from "react";

import Box from "./components/Box";
import List from "./components/List";
import PlanetListItem from "./components/PlanetListItem";
import Planet, { IPlanetProps } from "./components/Planet";
import solarSystem from "./components/SolarSystem";

interface INasaImagesPayload {
  collection: {
    href: string;
    items: {
      data: any;
      href: string;
      links: {
        href: string;
        rel: string;
        render: string;
      }[];
    }[];
  };
}

interface IAppState {
  focussedPlanet?: Planet;
  planetImages: Map<string, string[]>;
}

export default class App extends Component<any, IAppState> {
  containerRef: React.RefObject<HTMLDivElement>;

  constructor(props: any) {
    super(props);
    this.containerRef = createRef<HTMLDivElement>();

    this.state = {
      planetImages: new Map(),
    };
  }

  componentDidMount = () => {
    if (this.containerRef.current) {
      this.containerRef.current.appendChild(solarSystem.canvas);
    }
  };

  componentWillUnmount = () => {
    if (this.containerRef.current) {
      this.containerRef.current.removeChild(solarSystem.canvas);
    }
  }

  handleFocusPlanet = (planetName: string) => {
    this.setState({
      focussedPlanet: solarSystem.focusPlanet(planetName),
    });
    this.fetchPlanetImages(planetName);
  };

  handleUnFocusPlanet = () => {
    solarSystem.unFocus();
    this.setState({ focussedPlanet: undefined });
  };

  fetchPlanetImages = async (planetName: string) => {
    if (!this.state.planetImages.get(planetName)) {
      const data: INasaImagesPayload = await (
        await fetch(
          `https://images-api.nasa.gov/search?q=${planetName}&media_type=image`,
        )
      ).json();

      const urls = data.collection.items
        .slice(0, 10)
        .map((item) => item.links[0].href);

      this.setState({
        planetImages: new Map([
          ...this.state.planetImages.entries(),
          [planetName, urls],
        ]),
      });
    }
  };

  render = (): ReactNode => {
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
              {Array.from(solarSystem.planetMap.keys()).map(
                  (planetName) => (
                    <PlanetListItem
                      key={planetName}
                      isActive={planetName === this.state.focussedPlanet?.name}
                      planetName={planetName}
                      handleClick={() => this.handleFocusPlanet(planetName)}
                      handleMouseEnter={() =>
                        solarSystem.setOrbitActive(planetName)
                      }
                      handleMouseLeave={() =>
                        solarSystem.setOrbitInactive(planetName)
                      }
                    />
                  ),
                )}
            </List>
          </Box>

          {this.state.focussedPlanet && (
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

                {this.state.planetImages
                  .get(this.state.focussedPlanet.name)
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
  };
}
