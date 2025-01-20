import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

interface Store {
  id: number;
  name: string;
  position: [number, number];
  address: string;
  phone: string;
}

const storesData: Store[] = [
  {
    id: 1,
    name: "Women's Health Clinic",
    position: [40.7128, -74.0060],
    address: "123 Healthcare Ave, New York",
    phone: "(555) 123-4567"
  },
  {
    id: 2,
    name: "Family Planning Center",
    position: [40.7282, -73.9942],
    address: "456 Wellness St, New York",
    phone: "(555) 987-6543"
  },
  {
    id: 3,
    name: "Women's Wellness Center",
    position: [40.7112, -74.0123],
    address: "789 Medical Blvd, New York",
    phone: "(555) 456-7890"
  }
];

export default function StoreLocator({ darkMode }: { darkMode: boolean }) {
  const [stores, setStores] = useState<Store[]>(storesData);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setStores(
      storesData.filter((store) =>
        store.name.toLowerCase().includes(query) ||
        store.address.toLowerCase().includes(query)
      )
    );
  };

  const locateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          alert('Unable to retrieve location.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div
      className={`w-full max-w-4xl mx-auto rounded-xl overflow-hidden ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg p-6`}
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">🗺️ Healthcare Facilities Near You</h3>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Find women's healthcare facilities in your area.
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row mb-4 gap-4">
        <input
          type="text"
          placeholder="Search facilities..."
          value={searchQuery}
          onChange={handleSearch}
          className={`p-2 border rounded-lg ${
            darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
        <button
          onClick={locateUser}
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
        >
          📍 Use My Location
        </button>
      </div>

      {/* Map Display */}
      <div className="h-[400px] rounded-lg overflow-hidden mb-6">
        <MapContainer
          center={userLocation || [40.7128, -74.0060]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url={
              darkMode
                ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            }
          />
          {stores.map((store) => (
            <Marker key={store.id} position={store.position} icon={defaultIcon}>
              <Popup>
                <div className="p-2">
                  <h4 className="font-semibold">{store.name}</h4>
                  <p className="text-sm text-gray-600">{store.address}</p>
                  <p className="text-sm text-gray-600">{store.phone}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {userLocation && (
            <Marker position={userLocation} icon={defaultIcon}>
              <Popup>You are here</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Store Details */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stores.map((store) => (
          <div
            key={store.id}
            className={`p-4 rounded-lg ${
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}
          >
            <h4 className="font-semibold mb-2">{store.name}</h4>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {store.address}
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {store.phone}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
