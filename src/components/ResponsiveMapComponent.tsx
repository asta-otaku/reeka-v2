// MapPicker.tsx
"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Search, LocateFixed, X } from "lucide-react";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 9.082,
  lng: 8.6753, // Nigeria coordinates
};

interface Location {
  lat: number;
  lng: number;
}

interface AddressDetails {
  address: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
}

interface MapPickerProps {
  onLocationSelect: (
    address: string,
    city: string,
    country: string,
    lat: number,
    lng: number
  ) => void;
  initialLocation: Location | null;
}

const MapPicker = ({ onLocationSelect, initialLocation }: MapPickerProps) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  const [position, setPosition] = useState(defaultCenter);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const searchTimeout = useRef<number | null>(null);

  // Initialize position
  useEffect(() => {
    if (initialLocation) {
      setPosition(initialLocation);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => console.log("Geolocation permission denied")
      );
    }
  }, [initialLocation]);

  // Initialize services when map loads
  useEffect(() => {
    if (isLoaded) {
      autocompleteService.current =
        new google.maps.places.AutocompleteService();
    }
  }, [isLoaded]);

  // Handle search with debounce
  useEffect(() => {
    if (
      !isLoaded ||
      !autocompleteService.current ||
      searchQuery.trim() === ""
    ) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      autocompleteService.current!.getPlacePredictions(
        {
          input: searchQuery,
          componentRestrictions: { country: "ng" },
        },
        (predictions, status) => {
          setIsSearching(false);
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            setSearchResults(predictions);
          } else {
            setSearchResults([]);
          }
        }
      );
    }, 300);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery, isLoaded]);

  const extractAddressDetails = useCallback(
    (results: google.maps.GeocoderResult[]) => {
      if (!results || results.length === 0) return null;

      const result = results[0];
      let city = "";
      let country = "";

      // Parse address components
      for (const component of result.address_components) {
        if (component.types.includes("locality")) {
          city = component.long_name;
        } else if (component.types.includes("country")) {
          country = component.long_name;
        }
      }

      return {
        address: result.formatted_address,
        city,
        country,
        lat: result.geometry.location.lat(),
        lng: result.geometry.location.lng(),
      };
    },
    []
  );

  const getAddressDetailsFromLatLng = useCallback(
    async (lat: number, lng: number): Promise<AddressDetails | null> => {
      return new Promise((resolve, reject) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results?.[0]) {
            const details = extractAddressDetails(results);
            if (details) {
              resolve(details);
            } else {
              reject("Could not extract address details");
            }
          } else {
            reject("Address not found");
          }
        });
      });
    },
    [extractAddressDetails]
  );

  const handleMapClick = useCallback(
    async (e: google.maps.MapMouseEvent) => {
      const lat = e.latLng!.lat();
      const lng = e.latLng!.lng();
      setPosition({ lat, lng });

      try {
        const details = await getAddressDetailsFromLatLng(lat, lng);
        if (details) {
          onLocationSelect(
            details.address,
            details.city,
            details.country,
            lat,
            lng
          );
        }
      } catch (error) {
        console.error("Geocoding error:", error);
      }
    },
    [getAddressDetailsFromLatLng, onLocationSelect]
  );

  const handlePlaceSelect = useCallback(
    (placeId: string) => {
      if (!isLoaded || !mapRef.current) return;

      if (!placesService.current) {
        placesService.current = new google.maps.places.PlacesService(
          mapRef.current
        );
      }

      placesService.current.getDetails(
        {
          placeId,
          fields: ["geometry", "formatted_address", "address_components"],
        },
        (place, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            place?.geometry?.location
          ) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            setPosition({ lat, lng });
            setSearchQuery("");
            setSearchResults([]);

            // Extract city and country from place details
            let city = "";
            let country = "";

            if (place.address_components) {
              for (const component of place.address_components) {
                if (component.types.includes("locality")) {
                  city = component.long_name;
                } else if (component.types.includes("country")) {
                  country = component.long_name;
                }
              }
            }

            onLocationSelect(
              place.formatted_address || "",
              city,
              country,
              lat,
              lng
            );
          }
        }
      );
    },
    [isLoaded, onLocationSelect]
  );

  const getCurrentLocation = useCallback(async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setPosition({ lat, lng });

          try {
            const details = await getAddressDetailsFromLatLng(lat, lng);
            if (details) {
              onLocationSelect(
                details.address,
                details.city,
                details.country,
                lat,
                lng
              );
            }
          } catch (error) {
            console.error("Geocoding error:", error);
          }
        },
        (error) => console.error("Geolocation error:", error)
      );
    }
  }, [getAddressDetailsFromLatLng, onLocationSelect]);

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded)
    return (
      <div className="flex items-center justify-center h-[400px]">
        Loading map...
      </div>
    );

  return (
    <div className="relative">
      <div className="mb-4 relative">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for address"
            className="w-full px-10 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {isSearching && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md p-2 flex justify-center">
            <span className="text-sm">Searching...</span>
          </div>
        )}

        {!isSearching && searchResults.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto border border-gray-200">
            {searchResults.map((result) => (
              <div
                key={result.place_id}
                onClick={() => handlePlaceSelect(result.place_id)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                <div className="font-medium">
                  {result.structured_formatting.main_text}
                </div>
                <div className="text-xs text-gray-500">
                  {result.structured_formatting.secondary_text}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-lg overflow-hidden shadow-md relative">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={position}
          zoom={15}
          onClick={handleMapClick}
          onLoad={handleMapLoad}
        >
          <Marker position={position} draggable onDragEnd={handleMapClick} />
        </GoogleMap>

        <button
          onClick={getCurrentLocation}
          className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Get current location"
        >
          <LocateFixed className="h-5 w-5 text-blue-600" />
        </button>
      </div>
    </div>
  );
};

export default MapPicker;
