"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Map() {
  const [isClient, setIsClient] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    setIsClient(true);
    
    setMapKey(prev => prev + 1);
  }, []);

  if (!isClient) {
    return (
      <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-500">
        Loading map...
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <MapContainer
        key={mapKey}
        center={[-1.286389, 36.817223]}
        zoom={12}
        scrollWheelZoom={false}
        className="h-full w-full"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
}
