import { Property } from "./types";

interface LinkSummaryProps {
  masterPropertyId: string;
  selectedConstituentIds: string[];
  properties: Property[];
  isLoading: boolean;
  handleLinkProperties: () => void;
}

function LinkSummary({
  masterPropertyId,
  selectedConstituentIds,
  properties,
  isLoading,
  handleLinkProperties,
}: LinkSummaryProps) {
  const masterProperty = properties.find((p) => p._id === masterPropertyId);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 md:p-8 shadow-lg border-2 border-blue-100">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <span className="text-blue-600 font-bold text-base md:text-lg">
            ✨
          </span>
        </div>
        <div>
          <h3 className="text-base md:text-lg font-semibold text-gray-900">
            Link Summary
          </h3>
          <p className="text-gray-600 text-xs md:text-sm">
            Review your property linking configuration
          </p>
        </div>
      </div>

      <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6 mb-6 md:mb-8">
        {/* Master Property Summary */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm md:text-base">
            <span className="w-5 h-5 md:w-6 md:h-6 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-xs md:text-sm">
              👑
            </span>
            Master Property
          </h4>
          <div className="bg-white rounded-xl p-3 md:p-4 border-2 border-blue-200 shadow-sm">
            <div className="flex items-center gap-3 md:gap-4">
              <img
                src={masterProperty?.images[0]}
                alt={masterProperty?.propertyName}
                className="w-12 h-10 md:w-16 md:h-12 object-cover rounded-lg md:rounded-xl flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate text-sm md:text-base">
                  {masterProperty?.propertyName}
                </p>
                <p className="text-xs md:text-sm text-gray-600 truncate">
                  {masterProperty?.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Constituent Properties Summary */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm md:text-base">
            <span className="w-5 h-5 md:w-6 md:h-6 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-xs md:text-sm">
              {selectedConstituentIds.length}
            </span>
            Constituent Properties
          </h4>
          <div className="space-y-2 max-h-32 md:max-h-40 overflow-y-auto">
            {selectedConstituentIds.map((id) => {
              const property = properties.find((p) => p._id === id);
              return (
                <div
                  key={id}
                  className="bg-white rounded-lg md:rounded-xl p-2 md:p-3 border border-green-200 shadow-sm"
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <img
                      src={property?.images[0]}
                      alt={property?.propertyName}
                      className="w-10 h-8 md:w-12 md:h-10 object-cover rounded-md md:rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate text-xs md:text-sm">
                        {property?.propertyName}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {property?.address}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <button
        onClick={handleLinkProperties}
        disabled={isLoading}
        className={`w-full py-2 px-6 rounded-xl font-semibold text-base transition-all duration-200 ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transform hover:-translate-y-0.5 hover:shadow-lg"
        } text-white shadow-md`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Linking Properties...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            🔗 Link Properties Together
          </span>
        )}
      </button>
    </div>
  );
}

export default LinkSummary;
