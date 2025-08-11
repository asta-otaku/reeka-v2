import { useEffect, useState, useRef, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import Spinner from "./Spinner";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: 6.5244,
  lng: 3.3792,
}; // Lagos, Nigeria (consistent with MapPicker)

interface Location {
  lat: number;
  lng: number;
}

interface MapComponentProps {
  selectedLocation: Location;
  onLocationChange?: (location: Location) => void;
  interactive?: boolean;
}

const MapComponent = ({
  selectedLocation,
  onLocationChange,
  interactive = false,
}: MapComponentProps) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  // Initialize position with selectedLocation or defaultCenter
  const [position, setPosition] = useState<Location>(
    selectedLocation || defaultCenter
  );
  const mapRef = useRef<google.maps.Map | null>(null);

  // Update position when selectedLocation changes
  useEffect(() => {
    if (
      selectedLocation &&
      (selectedLocation.lat !== position.lat ||
        selectedLocation.lng !== position.lng)
    ) {
      const newPosition = {
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      };
      setPosition(newPosition);

      // Update map center if map is loaded
      if (mapRef.current) {
        mapRef.current.panTo(newPosition);
      }
    }
  }, [selectedLocation, position.lat, position.lng]);

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!interactive || !e.latLng) return;

      const newPosition = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };

      setPosition(newPosition);

      if (onLocationChange) {
        onLocationChange(newPosition);
      }
    },
    [interactive, onLocationChange]
  );

  const handleMarkerDrag = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;

      const newPosition = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };

      setPosition(newPosition);

      if (onLocationChange) {
        onLocationChange(newPosition);
      }
    },
    [onLocationChange]
  );

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  if (!isLoaded) return <Spinner />;
  if (loadError) return <div>Error loading maps</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={position}
      zoom={14}
      onClick={interactive ? handleMapClick : undefined}
      onLoad={handleMapLoad}
      options={{
        mapTypeControl: false,
        streetViewControl: interactive,
        fullscreenControl: interactive,
      }}
    >
      <Marker
        position={position}
        draggable={interactive}
        onDragEnd={interactive ? handleMarkerDrag : undefined}
      />
    </GoogleMap>
  );
};

export default MapComponent;
