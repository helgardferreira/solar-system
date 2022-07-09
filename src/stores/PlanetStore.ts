import {
  flow,
  makeAutoObservable,
  observable,
  reaction,
  runInAction,
} from "mobx";
import Planet, { IPlanetProps } from "../components/Planet";
import solarSystem from "../components/SolarSystem";

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

export class PlanetStore {
  public focussedPlanet: Planet | undefined;
  public planetImages: Map<string, string[]> = new Map();
  public planetMap: Map<string, IPlanetProps>;

  constructor() {
    makeAutoObservable(this, {
      focussedPlanet: observable.ref,
      planetImages: observable,
      fetchPlanetImages: flow,
    });
    this.planetMap = solarSystem.planetMap;

    reaction(
      () => this.focussedPlanet,
      (planet) => {
        if (planet) {
          this.fetchPlanetImages(planet.name);
        }
      }
    );
  }

  public focusPlanet(planetName: string) {
    const planet = solarSystem.focusPlanet(planetName);
    this.focussedPlanet = planet;
  }

  public unFocus() {
    solarSystem.unFocus();
    this.focussedPlanet = undefined;
  }

  public *fetchPlanetImages(planetName: string) {
    if (!this.planetImages.get(planetName)) {
      // replace with backend call later
      const result: Response = yield fetch(
        `https://images-api.nasa.gov/search?q=${planetName}&media_type=image`
      );
      const data: INasaImagesPayload = yield result.json();

      const urls = data.collection.items
        .slice(0, 10)
        .map((item) => item.links[0].href);

      runInAction(() => {
        this.planetImages.set(planetName, urls);
      });
    }
  }

  public setOrbitActive(planetName: string) {
    solarSystem.setOrbitActive(planetName);
  }

  public setOrbitInactive(planetName: string) {
    solarSystem.setOrbitInactive(planetName);
  }
}

export const planetStore = new PlanetStore();
