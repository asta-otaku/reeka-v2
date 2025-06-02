import { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import Spinner from "./Spinner";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = { lat: 6.5244, lng: 3.3792 }; // Default to Lagos, Nigeria

interface Location {
  lat: number;
  lng: number;
}

interface MapComponentProps {
  selectedLocation: Location;
}

const MapComponent = ({ selectedLocation }: MapComponentProps) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  const [position, setPosition] = useState(defaultCenter);

  useEffect(() => {
    if (selectedLocation) {
      setPosition({
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      });
    }
  }, [selectedLocation]);

  if (!isLoaded) return <Spinner />;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={position}
      zoom={14}
      options={{ mapTypeControl: false }}
    >
      <Marker
        position={position}
        draggable
        onDragEnd={async (e) => {
          const lat = e.latLng!.lat();
          const lng = e.latLng!.lng();
          setPosition({ lat, lng });
        }}
      />
    </GoogleMap>
  );
};

export default MapComponent;
