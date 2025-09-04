import { Property, LinkedPropertyResponse } from "./types";

interface LinkedPropertiesViewerProps {
  properties: Property[];
  selectedPropertyForView: string;
  setSelectedPropertyForView: (id: string) => void;
  linkedProperties: LinkedPropertyResponse | null;
  loadingLinkedProperties: boolean;
  unlinkingPropertyId: string;
  handleUnlinkAllProperties: (masterPropertyId: string) => void;
  fetchLinkedProperties: (propertyId: string) => void;
}

function LinkedPropertiesViewer({
  properties,
  selectedPropertyForView,
  setSelectedPropertyForView,
  linkedProperties,
  loadingLinkedProperties,
  unlinkingPropertyId,
  handleUnlinkAllProperties,
  fetchLinkedProperties,
}: LinkedPropertiesViewerProps) {
  return (
    <div className="bg-white rounded-2xl md:p-8 p-4 shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-xl flex items-center justify-center">
          <span className="text-purple-600 font-bold text-base md:text-lg">
            👁
          </span>
        </div>
        <div>
          <h3 className="text-base md:text-lg font-semibold text-gray-900">
            View & Manage Linked Properties
          </h3>
          <p className="text-gray-500 text-xs md:text-sm">
            Select a property to view its linked relationships and manage them
          </p>
        </div>
      </div>

      <div className="mb-4 md:mb-6">
        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
          Select Property to View Links
        </label>
        <select
          value={selectedPropertyForView}
          onChange={(e) => {
            setSelectedPropertyForView(e.target.value);
            if (e.target.value) {
              fetchLinkedProperties(e.target.value);
            }
          }}
          className="w-full p-3 md:p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-gray-700 text-sm md:text-base"
        >
          <option value="">
            Choose a property to view its linked properties...
          </option>
          {properties
            .filter((property) => property.isLinkedProperty)
            .map((property) => (
              <option key={property._id} value={property._id}>
                {property.propertyName} - {property.address} (
                {property.propertyLinkType})
              </option>
            ))}
        </select>
      </div>

      {loadingLinkedProperties && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading linked properties...
          </p>
        </div>
      )}

      {linkedProperties && !loadingLinkedProperties && (
        <div className="space-y-6">
          {(() => {
            // Determine if the selected property is a master or constituent
            const selectedProperty = properties.find(
              (p) => p._id === selectedPropertyForView
            );
            const isSelectedPropertyMaster =
              selectedProperty?.propertyLinkType === "master";

            if (isSelectedPropertyMaster) {
              // If master is selected, show its constituents
              const constituentProperties = linkedProperties.filter(
                (prop) => prop.propertyLinkType === "constituent"
              );
              const masterPropertyId = selectedPropertyForView;

              return (
                <>
                  {/* Unlink All Section */}
                  {constituentProperties.length > 0 && (
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-4 md:p-6 border-2 border-red-100">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-red-600 text-lg md:text-xl">
                              🔗
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">
                              Master Property Group
                            </h4>
                            <p className="text-xs md:text-sm text-gray-600">
                              {constituentProperties.length} properties are
                              linked under this master
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleUnlinkAllProperties(masterPropertyId)
                          }
                          disabled={unlinkingPropertyId === masterPropertyId}
                          className={`w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            unlinkingPropertyId === masterPropertyId
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-red-500 hover:bg-red-600 hover:shadow-lg active:scale-95"
                          } text-white shadow-md`}
                        >
                          {unlinkingPropertyId === masterPropertyId
                            ? "Unlinking..."
                            : "🔓 Unlink All Properties"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Constituent Properties */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm md:text-base">
                      <span className="w-5 h-5 md:w-6 md:h-6 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-xs md:text-sm">
                        {constituentProperties.length}
                      </span>
                      Linked Constituent Properties
                    </h4>
                    {constituentProperties.length === 0 ? (
                      <div className="text-center py-8 md:py-12 text-gray-500">
                        <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-gray-400 text-xl md:text-2xl">
                            📭
                          </span>
                        </div>
                        <p className="font-normal text-sm md:text-base">
                          No constituent properties found
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 md:space-y-4">
                        {constituentProperties.map((property, index) => (
                          <div
                            key={property._id}
                            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl md:rounded-2xl p-4 md:p-6 border-2 border-blue-100 transition-all duration-200 hover:shadow-md"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-6">
                              <div className="flex items-center gap-3 md:gap-4">
                                <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-semibold text-xs md:text-sm flex-shrink-0">
                                  {index + 1}
                                </div>
                                <img
                                  src={property.images?.[0] || ""}
                                  alt={property.propertyName}
                                  className="w-16 h-12 md:w-24 md:h-20 object-cover rounded-lg md:rounded-xl shadow-sm flex-shrink-0"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-semibold text-gray-900 text-sm md:text-lg mb-1 truncate">
                                  {property.propertyName}
                                </h5>
                                <p className="text-xs md:text-sm text-gray-600 mb-2 line-clamp-2">
                                  {property.address}
                                </p>
                                <span className="inline-flex items-center px-2 md:px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                  🏠 Constituent Property
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              );
            } else {
              // If constituent is selected, show its master and fellow constituents
              const constituentProperties = linkedProperties.filter(
                (prop) => prop.propertyLinkType === "constituent"
              );
              const masterPropertyId =
                constituentProperties[0]?.masterPropertyId;
              const masterProperty = properties.find(
                (p) => p._id === masterPropertyId
              );

              return (
                <>
                  {/* Master Property Section */}
                  {masterProperty && (
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-4 md:p-6 border-2 border-purple-100">
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-purple-600 text-lg md:text-xl">
                            👑
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">
                            Master Property
                          </h4>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
                            <img
                              src={masterProperty.images?.[0] || ""}
                              alt={masterProperty.propertyName}
                              className="w-16 h-12 md:w-24 md:h-20 object-cover rounded-lg md:rounded-xl shadow-sm flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-semibold text-gray-900 text-sm md:text-lg mb-1 truncate">
                                {masterProperty.propertyName}
                              </h5>
                              <p className="text-xs md:text-sm text-gray-600 mb-2 line-clamp-2">
                                {masterProperty.address}
                              </p>
                              <span className="inline-flex items-center px-2 md:px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                                👑 Master Property
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Unlink All Section */}
                  {masterPropertyId && constituentProperties.length > 0 && (
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-4 md:p-6 border-2 border-red-100">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-red-600 text-lg md:text-xl">
                              🔗
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">
                              Linked Property Group
                            </h4>
                            <p className="text-xs md:text-sm text-gray-600">
                              {constituentProperties.length} properties are
                              linked together in this group
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleUnlinkAllProperties(masterPropertyId)
                          }
                          disabled={unlinkingPropertyId === masterPropertyId}
                          className={`w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            unlinkingPropertyId === masterPropertyId
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-red-500 hover:bg-red-600 hover:shadow-lg active:scale-95"
                          } text-white shadow-md`}
                        >
                          {unlinkingPropertyId === masterPropertyId
                            ? "Unlinking..."
                            : "🔓 Unlink All Properties"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Fellow Constituent Properties */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm md:text-base">
                      <span className="w-5 h-5 md:w-6 md:h-6 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-xs md:text-sm">
                        {constituentProperties.length}
                      </span>
                      Fellow Constituent Properties
                    </h4>
                    {constituentProperties.length === 0 ? (
                      <div className="text-center py-8 md:py-12 text-gray-500">
                        <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-gray-400 text-xl md:text-2xl">
                            📭
                          </span>
                        </div>
                        <p className="font-normal text-sm md:text-base">
                          No fellow constituent properties found
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 md:space-y-4">
                        {constituentProperties.map((property, index) => (
                          <div
                            key={property._id}
                            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl md:rounded-2xl p-4 md:p-6 border-2 border-blue-100 transition-all duration-200 hover:shadow-md"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-6">
                              <div className="flex items-center gap-3 md:gap-4">
                                <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-semibold text-xs md:text-sm flex-shrink-0">
                                  {index + 1}
                                </div>
                                <img
                                  src={property.images?.[0] || ""}
                                  alt={property.propertyName}
                                  className="w-16 h-12 md:w-24 md:h-20 object-cover rounded-lg md:rounded-xl shadow-sm flex-shrink-0"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-semibold text-gray-900 text-sm md:text-lg mb-1 truncate">
                                  {property.propertyName}
                                </h5>
                                <p className="text-xs md:text-sm text-gray-600 mb-2 line-clamp-2">
                                  {property.address}
                                </p>
                                <span className="inline-flex items-center px-2 md:px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                  🏠 Constituent Property
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              );
            }
          })()}
        </div>
      )}

      {selectedPropertyForView &&
        !linkedProperties &&
        !loadingLinkedProperties && (
          <div className="text-center py-8 text-gray-500">
            <p>No linked properties found for the selected property</p>
          </div>
        )}
    </div>
  );
}

export default LinkedPropertiesViewer;
