import countryList from "react-select-country-list";
import Select from "react-select";
import propertyIcon from "../../assets/property.svg";
import { useMemo, useState } from "react";

function Properties({
  handleChange,
  // formDetails,
  // setFormDetails,
  toggleSection,
  openSection,
}: {
  handleChange: any;
  // formDetails: any;
  // setFormDetails: any;
  toggleSection: any;
  openSection: any;
}) {
  const options = useMemo(() => countryList().getData(), []);
  const [value, setValue] = useState("");

  const changeHandler = (value: any) => {
    setValue(value);
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
              name="name"
              placeholder="Name"
              onChange={handleChange}
              className="px-4 py-2 border border-[#D0D5DD] rounded-lg focus-within:border-primary outline-none placeholder:text-[#808080] text-[#3A3A3A]"
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 w-full">
              <h4 className="text-[#3A3A3A] text-sm font-medium">Country</h4>
              <Select
                options={options}
                value={value}
                onChange={changeHandler}
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <h4 className="text-[#3A3A3A] text-sm font-medium">Address</h4>
              <input
                name="address"
                placeholder="Address"
                onChange={handleChange}
                className="px-4 py-2 border border-[#D0D5DD] rounded-lg focus-within:border-primary outline-none placeholder:text-[#808080] text-[#3A3A3A]"
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default Properties;
