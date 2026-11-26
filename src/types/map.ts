import { UIMessage } from "ai";

export type MapLocation = {
  id: number;
  name: string;
  lat: number;
  lon: number;
};

export type LocationSearchResult = {
  query: string;
  locations: MapLocation[];
};

export type MapTools = {
  searchLocations: {
    input: { query: string };
    output: LocationSearchResult;
  };
};

export type MapMessage = UIMessage<never, never, MapTools>;
