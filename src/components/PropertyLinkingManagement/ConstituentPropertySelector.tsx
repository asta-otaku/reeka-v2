import { Property } from "./types";

interface ConstituentPropertySelectorProps {
  properties: Property[];
  masterPropertyId: string;
  selectedConstituentIds: string[];
  handleConstituentToggle: (propertyId: string) => void;
}

function ConstituentPropertySelector({
  properties,
  masterPropertyId,
  selectedConstituentIds,
  handleConstituentToggle,
}: ConstituentPropertySelectorProps) {
  // Filter out master property from constituent options
  const availableProperties = properties.filter(
    (property) =>
      !property.isLinkedProperty && property._id !== masterPropertyId
  );

  return (
    <div className="bg-white rounded-2xl md:p-8 p-4 shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
          <span className="text-green-600 font-bold text-lg">2</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Select Constituent Properties
          </h3>
          <p className="text-gray-500 text-sm">
            Add properties to link under the master
          </p>
        </div>
      </div>

      {!masterPropertyId ? (
        <div className="text-center py-12 text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-gray-400 text-2xl">←</span>
          </div>
          <p className="font-normal">Please select a master property first</p>
          <p className="text-sm">
            Choose a master property to see available constituents
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {availableProperties.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-400 text-2xl">⚠</span>
              </div>
              <p className="font-normal">No other properties available</p>
              <p className="text-sm">
                All properties are either already linked or selected as master
              </p>
            </div>
          ) : (
            availableProperties.map((property) => (
              <div
                key={property._id}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedConstituentIds.includes(property._id)
                    ? "border-green-500 bg-green-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleConstituentToggle(property._id)}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedConstituentIds.includes(property._id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleConstituentToggle(property._id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="text-green-500 focus:ring-green-500 rounded w-5 h-5"
                  />
                  <div className="relative">
                    <img
                      src={property.images[0]}
                      alt={property.propertyName}
                      className="w-20 h-16 object-cover rounded-xl shadow-sm"
                    />
                    {selectedConstituentIds.includes(property._id) && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {property.propertyName}
                    </h4>
                    <p className="text-sm text-gray-600 truncate">
                      {property.address}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default ConstituentPropertySelector;
