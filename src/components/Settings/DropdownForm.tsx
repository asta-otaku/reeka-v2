import { useState, useEffect } from "react";
import info from "../../assets/alert-circle.svg";
import apiClient from "../../helpers/apiClient";

function DropdownForm({
  selectedProperties,
  setSelectedProperties,
  role,
}: {
  selectedProperties: string[];
  setSelectedProperties: React.Dispatch<React.SetStateAction<string[]>>;
  role: string;
}) {
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    if (role === "Administrator") {
      setSelectedProperties([...properties.map((property) => property._id)]);
    }
  }, [role]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await apiClient.get(`/properties`);
        setProperties(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProperties();
  }, []);

  const handlePropertySelect = (propertyId: string) => {
    if (selectedProperties.includes(propertyId)) {
      setSelectedProperties(
        selectedProperties.filter((id) => id !== propertyId)
      );
    } else {
      // Select the property
      setSelectedProperties([...selectedProperties, propertyId]);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full mt-2">
      <h3 className="text-deepBlue font-medium">Property Details</h3>
      <p className="text-secondary text-xs">
        Properties are categorized based on locations. Select specific
        properties from the list below.
      </p>
      <div className="flex items-center gap-4 bg-[#FFF9E5] px-4 py-2 rounded-lg">
        <span>
          <img src={info} alt="info" className="w-5" />
        </span>
        <p className="font-medium text-[#EEB300] text-xs">
          Personnels with the administrator role will automatically have all
          properties selected.
        </p>
      </div>

      <div className="mt-5 text-secondary">
        <div className="flex flex-col gap-4">
          {properties.map((property) => (
            <div
              key={property._id}
              className="py-2 px-4 border-b border-solid border-gray-300 flex items-center gap-4"
            >
              <input
                type="checkbox"
                checked={selectedProperties.includes(property._id)}
                onChange={() => handlePropertySelect(property._id)}
                id={`property-${property._id}`}
                className="accent-primary"
              />
              <label
                htmlFor={`property-${property._id}`}
                className="text-sm text-gray-600 cursor-pointer"
              >
                {property.propertyName}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DropdownForm;
