import { useMemo } from "react";
import { MapPin } from "lucide-react";
import countryList from "react-select-country-list";
import Select from "react-select";
import MapPicker from "../ResponsiveMapComponent";
import useStore from "../../store";

function PropertyDetails({
  edit,
  property,
  setEdit,
  setProperty,
}: {
  edit: boolean;
  property: any;
  setEdit: any;
  setProperty: any;
}) {
  const options = useMemo(() => countryList().getData(), []);
  const setModal = useStore((state: any) => state.setModal);

  const changeHandler = (value: any) => {
    setProperty({ ...property, country: value.label });
  };

  const handleLocationSelect = (
    address: string,
    city: string,
    country: string,
    lat: number,
    lng: number
  ) => {
    setProperty({
      ...property,
      address,
      city,
      country,
      latitude: lat.toString(),
      longitude: lng.toString(),
    });
    setModal(null);
  };

  return (
    <form className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-[#121212] font-medium text-lg">Property Details</h3>
        <button
          type="button"
          onClick={() => setEdit(!edit)}
          className="text-[#808080] text-xs font-medium"
        >
          {edit ? "Cancel" : "Edit"}
        </button>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <h4 className="text-[#3A3A3A] text-sm font-medium">Property Name</h4>
        <input
          name="name"
          value={property?.propertyName}
          onChange={(e) =>
            setProperty({ ...property, propertyName: e.target.value })
          }
          placeholder="Name"
          disabled={!edit}
          className={`px-4 py-2 border border-[#D0D5DD] rounded-lg outline-none placeholder:text-[#808080] text-[#3A3A3A] ${
            edit
              ? "focus-within:border-primary bg-white"
              : "bg-gray-100 text-gray-500 cursor-not-allowed"
          }`}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2 w-full">
          <h4 className="text-[#3A3A3A] text-sm font-medium">Country</h4>
          <Select
            className="z-20"
            options={options}
            value={options.find(
              (option: any) => option.label === property?.country
            )}
            onChange={changeHandler}
            isDisabled={!edit} // Disable the Select when not in edit mode
            classNamePrefix={!edit ? "react-select-disabled" : ""}
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <h4 className="text-[#3A3A3A] text-sm font-medium">Address</h4>
          <div className="relative">
            <input
              name="address"
              placeholder="Address"
              value={property?.address}
              onChange={(e) =>
                setProperty({ ...property, address: e.target.value })
              }
              disabled={!edit}
              className={`px-4 py-2 border border-[#D0D5DD] rounded-lg outline-none placeholder:text-[#808080] text-[#3A3A3A] w-full ${
                edit ? "pr-10" : ""
              } ${
                edit
                  ? "focus-within:border-primary bg-white"
                  : "bg-gray-100 text-gray-500 cursor-not-allowed"
              }`}
            />
            {edit && (
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setModal(
                    <MapModal
                      property={property}
                      setModal={setModal}
                      handleLocationSelect={handleLocationSelect}
                    />
                  );
                }}
              >
                <MapPin className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

function MapModal({
  property,
  setModal,
  handleLocationSelect,
}: {
  property: any;
  setModal: (value: any) => void;
  handleLocationSelect: (
    address: string,
    city: string,
    country: string,
    lat: number,
    lng: number
  ) => void;
}) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Select Location</h3>
          <button
            onClick={() => setModal(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <MapPicker
            onLocationSelect={handleLocationSelect}
            initialLocation={
              property.latitude && property.longitude
                ? {
                    lat: parseFloat(property.latitude),
                    lng: parseFloat(property.longitude),
                  }
                : null
            }
          />
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;
