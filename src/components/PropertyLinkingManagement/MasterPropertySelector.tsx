import { Property } from "./types";

interface MasterPropertySelectorProps {
  properties: Property[];
  masterPropertyId: string;
  setMasterPropertyId: (id: string) => void;
}

function MasterPropertySelector({
  properties,
  masterPropertyId,
  setMasterPropertyId,
}: MasterPropertySelectorProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <span className="text-blue-600 font-bold text-lg">1</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Select Master Property
          </h3>
          <p className="text-gray-500 text-sm">
            Choose the primary property for this group
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {properties.map((property) => (
          <div
            key={property._id}
            className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
              masterPropertyId === property._id
                ? "border-primary bg-primary/5 shadow-md"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setMasterPropertyId(property._id)}
          >
            <div className="flex items-center gap-4">
              <input
                type="radio"
                checked={masterPropertyId === property._id}
                onChange={(e) => {
                  e.stopPropagation();
                  setMasterPropertyId(property._id);
                }}
                onClick={(e) => e.stopPropagation()}
                className="text-primary focus:ring-primary w-5 h-5"
              />
              <div className="relative">
                <img
                  src={property.images[0]}
                  alt={property.propertyName}
                  className="w-20 h-16 object-cover rounded-xl shadow-sm"
                />
                {masterPropertyId === property._id && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
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
        ))}
      </div>
    </div>
  );
}

export default MasterPropertySelector;
