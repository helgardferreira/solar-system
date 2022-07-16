import {
  flow,
  makeAutoObservable,
  observable,
  ObservableMap,
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

  // Unit of measurement is Megameters
  public planetMap = observable.map(
    [
      [
        "mercury",
        {
          distanceFromSun: 58000,
          radius: 2.44 * 3000,
          orbitalVelocity: 47.4,
          rotationPeriod: 1407.6,
        },
      ],
      [
        "venus",
        {
          distanceFromSun: 108200,
          radius: 6.052 * 3000,
          orbitalVelocity: 35.0,
          rotationPeriod: -5832.5,
        },
      ],
      [
        "earth",
        {
          distanceFromSun: 149600,
          radius: 6.378 * 3000,
          orbitalVelocity: 29.8,
          rotationPeriod: 23.9,
        },
      ],
      [
        "mars",
        {
          distanceFromSun: 228000,
          radius: 3.396 * 3000,
          orbitalVelocity: 24.1,
          rotationPeriod: 24.6,
        },
      ],
      [
        "jupiter",
        {
          distanceFromSun: 778500,
          radius: 71.492 * 3000,
          orbitalVelocity: 13.1,
          rotationPeriod: 9.9,
        },
      ],
      [
        "saturn",
        {
          distanceFromSun: 1432000,
          radius: 60.268 * 3000,
          orbitalVelocity: 9.7,
          rotationPeriod: 10.7,
        },
      ],
      [
        "uranus",
        {
          distanceFromSun: 2867000,
          radius: 25.559 * 3000,
          orbitalVelocity: 6.8,
          rotationPeriod: -17.2,
        },
      ],
      [
        "neptune",
        {
          distanceFromSun: 4515000,
          radius: 24.764 * 3000,
          orbitalVelocity: 5.4,
          rotationPeriod: 16.1,
        },
      ],
    ],
    { deep: false }
  );

  constructor() {
    makeAutoObservable(this, {
      focussedPlanet: observable.ref,
      planetImages: observable,
      fetchPlanetImages: flow,
    });

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
