import { MapPin } from "lucide-react";
import { useMemo } from "react";
import countryList from "react-select-country-list";
import Select from "react-select";
import MapPicker from "../ResponsiveMapComponent";
import propertyIcon from "../../assets/property.svg";
import useStore from "../../store";

function Properties({
  handleChange,
  formDetails,
  setFormDetails,
  toggleSection,
  openSection,
}: {
  handleChange: any;
  formDetails: any;
  setFormDetails: any;
  toggleSection: any;
  openSection: any;
}) {
  const setModal = useStore((state: any) => state.setModal);
  const options = useMemo(() => countryList().getData(), []);

  const handleLocationSelect = (
    address: string,
    city: string,
    country: string,
    lat: number,
    lng: number
  ) => {
    setFormDetails({
      ...formDetails,
      address,
      city,
      country,
      latitude: lat.toString(),
      longitude: lng.toString(),
    });
    setModal(null);
  };

  const changeHandler = (value: any) => {
    setFormDetails({ ...formDetails, country: value.label });
  };

  return (
    <div
      onClick={() => toggleSection("property")}
      className="rounded-xl bg-[#FAFAFA] border flex flex-col gap-4 cursor-pointer mx-2 p-4"
    >
      <div className="flex gap-2 items-center">
        <img src={propertyIcon} alt="property" />
        <h3 className="text-[#007AFF] font-medium">Property</h3>
      </div>
      {openSection === "property" && (
        <form
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col gap-2"
        >
          <div className="flex flex-col gap-2 w-full">
            <h4 className="text-[#3A3A3A] text-sm font-medium">
              Property Name
            </h4>
            <input
              name="propertyName"
              placeholder="Property Name"
              value={formDetails.propertyName || ""}
              onChange={handleChange}
              className="px-4 py-2 border border-[#D0D5DD] rounded-lg focus-within:border-primary outline-none placeholder:text-[#808080] text-[#3A3A3A]"
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <h4 className="text-[#3A3A3A] text-sm font-medium">City</h4>
            <input
              name="city"
              placeholder="City"
              value={formDetails.city || ""}
              onChange={handleChange}
              className="px-4 py-2 border border-[#D0D5DD] rounded-lg focus-within:border-primary outline-none placeholder:text-[#808080] text-[#3A3A3A]"
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <h4 className="text-[#3A3A3A] text-sm font-medium">Country</h4>
            <Select
              className="z-20"
              options={options}
              value={options.find(
                (option: any) => option.label === formDetails.country
              )}
              onChange={changeHandler}
              placeholder="Select Country"
              classNamePrefix="react-select"
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <h4 className="text-[#3A3A3A] text-sm font-medium">Address</h4>
            <div className="relative">
              <input
                name="address"
                placeholder="Address"
                value={formDetails.address || ""}
                onChange={handleChange}
                className="px-4 py-2 border border-[#D0D5DD] rounded-lg focus-within:border-primary outline-none placeholder:text-[#808080] text-[#3A3A3A] w-full pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setModal(
                    <MapModal
                      formDetails={formDetails}
                      setModal={setModal}
                      handleLocationSelect={handleLocationSelect}
                    />
                  );
                }}
              >
                <MapPin className="w-5 h-5" />
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default Properties;

function MapModal({
  formDetails,
  setModal,
  handleLocationSelect,
}: {
  formDetails: any;
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
              formDetails.latitude && formDetails.longitude
                ? {
                    lat: parseFloat(formDetails.latitude),
                    lng: parseFloat(formDetails.longitude),
                  }
                : null
            }
            address={formDetails.address}
          />
        </div>
      </div>
    </div>
  );
}
