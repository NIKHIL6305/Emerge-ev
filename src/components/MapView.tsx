import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/2.0.2/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const zoneIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/2.0.2/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function LocationMarker({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker position={position} icon={customIcon}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

export function MapView() {
  const [position, setPosition] = useState<[number, number] | null>(null);

  const mockZones = [
    { id: 1, latOffset: 0.015, lngOffset: 0.012, name: "North Hub", distance: "1.2 km", tech: "2 Available", eta: "15 min" },
    { id: 2, latOffset: -0.01, lngOffset: 0.02, name: "East District", distance: "2.5 km", tech: "Busy (1 waiting)", eta: "35 min" },
    { id: 3, latOffset: 0.005, lngOffset: -0.015, name: "West Center", distance: "0.8 km", tech: "1 Available", eta: "10 min" },
  ];

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.error("Error getting location", err);
          // Default to New Delhi
          setPosition([28.6315, 77.2167]);
        },
        { timeout: 3000 }
      );
    } else {
      setPosition([28.6315, 77.2167]);
    }
    
    // Fallback if it hangs
    const timer = setTimeout(() => {
      setPosition(p => p || [28.6315, 77.2167]);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  if (!position) {
    return <div className="w-full h-full bg-emerge-dark/50 flex items-center justify-center text-emerge-green animate-pulse">Locating...</div>;
  }

  return (
    <div className="absolute inset-0 w-full h-full">
      <MapContainer center={position} zoom={13} scrollWheelZoom={false} className="w-full h-full z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} />
        {mockZones.map((zone) => (
          <Marker key={zone.id} position={[position[0] + zone.latOffset, position[1] + zone.lngOffset]} icon={zoneIcon}>
            <Tooltip direction="top" offset={[0, -40]} opacity={1}>
              <div className="font-sans text-sm min-w-[180px]">
                <strong className="block mb-2 text-base border-b border-gray-100 pb-1">{zone.name}</strong>
                <div className="flex justify-between gap-4 mb-1">
                  <span className="text-gray-500">Distance:</span>
                  <span className="font-medium text-gray-900">{zone.distance}</span>
                </div>
                <div className="flex justify-between gap-4 mb-1">
                  <span className="text-gray-500">Technicians:</span>
                  <span className="font-medium text-gray-900">{zone.tech}</span>
                </div>
                <div className="flex justify-between gap-4 mt-2 pt-1 border-t border-gray-100">
                  <span className="text-gray-500">Est. Arrival:</span>
                  <span className="font-bold text-green-600">{zone.eta}</span>
                </div>
              </div>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
