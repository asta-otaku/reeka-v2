import { useMemo } from "react";
import countryList from "react-select-country-list";
import Select from "react-select";

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

  const changeHandler = (value: any) => {
    setProperty({ ...property, country: value.label });
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
          disabled={!edit} // Disable the input when not in edit mode
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
          <input
            name="address"
            placeholder="Address"
            value={property?.address}
            onChange={(e) =>
              setProperty({ ...property, address: e.target.value })
            }
            disabled={!edit} // Disable the input when not in edit mode
            className={`px-4 py-2 border border-[#D0D5DD] rounded-lg outline-none placeholder:text-[#808080] text-[#3A3A3A] ${
              edit
                ? "focus-within:border-primary bg-white"
                : "bg-gray-100 text-gray-500 cursor-not-allowed"
            }`}
          />
        </div>
      </div>
    </form>
  );
}

export default PropertyDetails;
