import { useState } from "react";
import info from "../../assets/alert-circle.svg";

function DropdownForm() {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const countries = [
    {
      name: "Nigeria",
      locations: ["Nigeria Area 1", "Nigeria Area 2", "Nigeria Area 3"],
    },
    {
      name: "Kenya",
      locations: ["Kenya Area 1", "Kenya Area 2", "Kenya Area 3"],
    },
    {
      name: "Rwanda",
      locations: ["Rwanda Area 1", "Rwanda Area 2", "Rwanda Area 3"],
    },
    {
      name: "Ghana",
      locations: ["Ghana Area 1", "Ghana Area 2", "Ghana Area 3"],
    },
  ];

  const handleCountrySelect = (countryName: string) => {
    if (selectedCountries.includes(countryName)) {
      // Deselect the country and its locations
      setSelectedCountries(selectedCountries.filter((c) => c !== countryName));
      setSelectedLocations(
        selectedLocations.filter(
          (location) =>
            !countries
              .find((c) => c.name === countryName)
              ?.locations.includes(location)
        )
      );
    } else {
      // Select the country and all its locations
      setSelectedCountries([...selectedCountries, countryName]);
      setSelectedLocations([
        ...selectedLocations,
        ...(countries.find((c) => c.name === countryName)?.locations || []),
      ]);
    }
  };

  const handleLocationSelect = (location: string, countryName: string) => {
    const countryLocations =
      countries.find((c) => c.name === countryName)?.locations || [];

    if (selectedLocations.includes(location)) {
      // Deselect the location
      setSelectedLocations(selectedLocations.filter((l) => l !== location));

      // If no locations are selected for the country, deselect the country
      if (
        selectedLocations.filter(
          (l) => countryLocations.includes(l) && l !== location
        ).length === 0
      ) {
        setSelectedCountries(
          selectedCountries.filter((c) => c !== countryName)
        );
      }
    } else {
      // Select the location
      setSelectedLocations([...selectedLocations, location]);

      // If all locations are selected for the country, select the country
      if (
        countryLocations.every((loc) =>
          [...selectedLocations, location].includes(loc)
        )
      ) {
        setSelectedCountries([...selectedCountries, countryName]);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full mt-2">
      <h3 className="text-deepBlue font-medium">Property Details</h3>
      <p className="text-secondary text-xs">
        Properties are categorised based on locations. You can either select the
        locations or use the drop downs to select specific properties in that
        location.
      </p>
      <div className="flex items-center gap-4 bg-[#FFF9E5] px-4 py-2 rounded-lg">
        <span>
          <img src={info} alt="info" className="w-5" />
        </span>
        <p className="font-medium text-[#EEB300] text-xs">
          Personnels with the administrator role would automatically have all
          the properties selected.
        </p>
      </div>

      <div className="mt-5 text-secondary">
        <div className="flex flex-col gap-4">
          {countries.map((country, index) => (
            <div key={index} className="py-2 border-0 border-b border-solid">
              <div className="flex gap-4 items-center">
                <input
                  type="checkbox"
                  checked={selectedCountries.includes(country.name)}
                  onChange={() => handleCountrySelect(country.name)}
                />
                <label>{country.name}</label>
              </div>
              {selectedCountries.includes(country.name) && (
                <div className="mt-2 pl-6">
                  {country.locations.map((location, locationIndex) => (
                    <div
                      key={locationIndex}
                      className="flex gap-4 items-center"
                    >
                      <input
                        type="checkbox"
                        checked={selectedLocations.includes(location)}
                        onChange={() =>
                          handleLocationSelect(location, country.name)
                        }
                      />
                      <label className="text-[#828282] text-xs">
                        {location}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DropdownForm;
