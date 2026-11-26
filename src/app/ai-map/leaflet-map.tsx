"use client";

import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { MapLocation } from "@/types/map";

const locationIcon = L.divIcon({
  className: "",
  html: '<span class="ai-map-marker"></span>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function MapUpdater({ locations }: { locations: MapLocation[] }) {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
    if (locations.length === 1) {
      map.flyTo([locations[0].lat, locations[0].lon], 13);
    } else if (locations.length > 1) {
      const bounds = L.latLngBounds(
        locations.map(({ lat, lon }) => L.latLng(lat, lon)),
      );
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    }
  }, [locations, map]);

  return null;
}

export default function LeafletMap({ locations }: { locations: MapLocation[] }) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      scrollWheelZoom
      className="h-full min-h-96 w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.lat, location.lon]}
          icon={locationIcon}
        >
          <Popup>{location.name}</Popup>
        </Marker>
      ))}
      <MapUpdater locations={locations} />
    </MapContainer>
  );
}
