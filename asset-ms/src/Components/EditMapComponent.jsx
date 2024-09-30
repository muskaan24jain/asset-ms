
import React, { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./MapComponent.css"; 

// Fix for missing marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const MapComponent = ({ setAddressField, initialAddress }) => {
  const [position, setPosition] = useState([20.5937, 78.9629]); 
  const [clickedPosition, setClickedPosition] = useState(null);
  const [search, setSearch] = useState("");
  const [address, setAddress] = useState(initialAddress || "");
  const [zoom, setZoom] = useState(12);
  const mapRef = useRef(null);

  useEffect(() => {
    if (initialAddress) {
      
      fetchCoordinates(initialAddress);
    }
  }, [initialAddress]);

  useEffect(() => {
    if (address) {
      // Extract latitude and longitude from the address
      const match = address.match(
        /Latitude: (\d+\.\d+), Longitude: (-?\d+\.\d+)/
      );
      if (match) {
        const lat = parseFloat(match[1]);
        const lon = parseFloat(match[2]);
        setPosition([lat, lon]);
        setClickedPosition([lat, lon]);
        setZoom(15); 
      }
    }
  }, [address]);

  const LocationMarker = () => {
    const map = useMap(); 
    useMapEvents({
      click(e) {
        const { latlng } = e;
        setClickedPosition(latlng);
        fetchAddress(latlng.lat, latlng.lng);
       
        map.setView(latlng, 15); 
      },
    });

    return clickedPosition ? (
      <Marker position={clickedPosition}>
        <Popup>
          Latitude: {clickedPosition.lat?.toFixed(4)}, Longitude:{" "}
          {clickedPosition.lng?.toFixed(4)}
          <br />
          Address: {address}
        </Popup>
      </Marker>
    ) : null;
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${search}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const newPosition = [parseFloat(lat), parseFloat(lon)];
        const fullAddress = `${display_name} (Latitude: ${lat}, Longitude: ${lon})`;
        setPosition(newPosition);
        setClickedPosition(newPosition);
        setAddress(fullAddress);
        setAddressField(fullAddress); 
        setZoom(15); 
      } else {
        alert("Location not found");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      alert("An error occurred while searching for the location.");
    }
  };

  const fetchAddress = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      if (data.display_name) {
        const fullAddress = `${data.display_name} (Latitude: ${lat.toFixed(
          4
        )}, Longitude: ${lon.toFixed(4)})`;
        setAddress(fullAddress);
        setAddressField(fullAddress); 
      } else {
        const coords = `Latitude: ${lat.toFixed(4)}, Longitude: ${lon.toFixed(
          4
        )}`;
        setAddress(coords);
        setAddressField(coords); 
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("An error occurred while fetching the address.");
    }
  };

  const fetchCoordinates = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${address}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        const newPosition = [parseFloat(lat), parseFloat(lon)];
        setPosition(newPosition);
        setClickedPosition(newPosition);
        setZoom(15); 
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  const handleOpenInGoogleMaps = () => {
    if (address) {
      
      const match = address.match(
        /Latitude: (\d+\.\d+), Longitude: (-?\d+\.\d+)/
      );
      if (match) {
        const lat = parseFloat(match[1]);
        const lon = parseFloat(match[2]);
        const url = `https://www.google.com/maps?q=${lat},${lon}`;
        window.open(url, "_blank");
      } else {
        alert("Latitude and Longitude not found in the address field.");
      }
    } else {
      alert("Please select or search for a location first.");
    }
  };

  const handleFetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          setClickedPosition([latitude, longitude]);
          fetchAddress(latitude, longitude);
          setZoom(15); 
        },
        (error) => {
          console.error("Error fetching current location:", error);
          alert("An error occurred while fetching your current location.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const MapSetView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(center, zoom);
    }, [center, zoom, map]); 
    return null;
  };

  return (
    <div className="map-container">
      <div className="controls">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for a city or street"
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
        <button
          onClick={handleOpenInGoogleMaps}
          className="open-google-maps-button"
        >
          Open in Google Maps
        </button>
        <button
          onClick={handleFetchCurrentLocation}
          className="current-location-button"
        >
         Spot
        </button>
      </div>
      <MapContainer
        center={position}
        zoom={zoom}
        style={{ height: "500px", width: "100%" }}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        className="map"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapSetView center={position} zoom={zoom} />
        <LocationMarker />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
