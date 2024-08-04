import { useState, useMemo } from "react";
import {
  ArrowLongLeftIcon,
  ChevronDownIcon,
  NotificationIcon,
} from "../assets/icons";
import propertyIcon from "../assets/property.svg";
import pricetag from "../assets/pricetag.svg";
import amenity from "../assets/amenity.svg";
import imageIcon from "../assets/image.svg";
// import plusIcon from "../assets/plus-sign-square.svg";
// import cloud from "../assets/cloud-upload.svg";
// import graycancel from "../assets/graycancel.svg";
import blackcancel from "../assets/blackcancel.svg";
import success from "../assets/success.svg";

import Select from "react-select";
import countryList from "react-select-country-list";
import useStore from "../store";

function AddProperty({ setStep }: { setStep: any }) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const [formDetails, setFormDetails] = useState<any>({});
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormDetails({
      ...formDetails,
      [e.target.name]: e.target.value,
    });
  };

  const setModal = useStore((state: any) => state.setModal);
  const [value, setValue] = useState("");
  const options = useMemo(() => countryList().getData(), []);

  const changeHandler = (value: any) => {
    setValue(value);
  };

  return (
    <div>
      <div className="w-full flex justify-between items-center py-4 px-6">
        <div className="flex items-center gap-5">
          <span className="p-2 rounded-full border border-[#DCDCDC]">
            <ArrowLongLeftIcon
              className="w-4 text-secondary cursor-pointer"
              onClick={() => setStep(1)}
            />
          </span>
          <h3 className="text-[#808080] font-light text-xs">
            Listing Management /{" "}
            <span className="text-[#121212]">Add Property</span>
          </h3>
        </div>
        <NotificationIcon className="w-5 h-5 cursor-pointer" />
      </div>

      <div className="my-4 px-6">
        <h3 className="text-deepBlue font-medium text-2xl">Add Property</h3>
        <p className="text-xs text-[#808080]">
          Manage your bookings with ease.
        </p>
      </div>

      <div className="px-4">
        <div className="max-w-lg mx-auto w-full border bg-[#F8F8F8] flex flex-col gap-2 rounded-2xl py-2">
          {/* Properties */}
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
                <div className="flex flex-col gap-2 w-full">
                  <h4 className="text-[#3A3A3A] text-sm font-medium">
                    Property Type
                  </h4>
                  <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-md p-2 w-full">
                    <select
                      name="type"
                      className="outline-none text-secondary text-xs md:text-sm w-full font-medium appearance-none border-none bg-transparent"
                    >
                      <option value="Apartment">Apartment</option>
                      <option value="Condo">Condo</option>
                      <option value="House">House</option>
                      <option value="Villa">Villa</option>
                      <option value="Bungalow">Bungalow</option>
                    </select>
                    <ChevronDownIcon width={16} />
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2 w-full">
                    <h4 className="text-[#3A3A3A] text-sm font-medium">
                      Country
                    </h4>
                    <Select
                      options={options}
                      value={value}
                      onChange={changeHandler}
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <h4 className="text-[#3A3A3A] text-sm font-medium">
                      Address
                    </h4>
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

          {/* Amenities */}
          <div
            onClick={() => toggleSection("amenities")}
            className="rounded-xl bg-[#FAFAFA] border flex flex-col gap-4 cursor-pointer mx-2 p-4"
          >
            <div className="flex gap-2 items-center">
              <img src={amenity} />
              <h3 className="text-[#219653] font-medium">
                Rooms and Amenities
              </h3>
            </div>
            {openSection === "amenities" && (
              <h4 className="text-[#3A3A3A] text-sm font-medium">
                Add Amenities
              </h4>
            )}
          </div>

          {/* Images */}
          <div
            onClick={() => toggleSection("images")}
            className="rounded-xl bg-[#FAFAFA] border flex flex-col gap-4 cursor-pointer mx-2 p-4"
          >
            <div className="flex gap-2 items-center">
              <img src={imageIcon} />
              <h3 className="text-primary font-medium">Images</h3>
            </div>
            {openSection === "images" && (
              <h4 className="text-[#3A3A3A] text-sm font-medium">
                Upload Images
              </h4>
            )}
          </div>

          {/* Pricing */}
          <div
            onClick={() => toggleSection("pricing")}
            className="rounded-xl bg-[#FAFAFA] border flex flex-col gap-4 cursor-pointer mx-2 p-4"
          >
            <div className="flex gap-2 items-center">
              <img src={pricetag} />
              <h3 className="text-[#0A2EE6] font-medium">Pricing</h3>
            </div>
            {openSection === "pricing" && (
              <form
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col gap-2"
              >
                <div className="flex flex-col gap-2 w-full">
                  <h4 className="text-[#3A3A3A] text-sm font-medium">
                    Base Price
                  </h4>
                  <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-md p-2 w-full">
                    <input
                      name="basePrice"
                      placeholder="$"
                      className="w-full outline-none bg-transparent"
                      onChange={handleChange}
                    />
                    <h4 className="text-[#808080]">/Night</h4>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2 w-full">
                    <h4 className="text-[#3A3A3A] text-sm font-medium">
                      Min Price
                    </h4>
                    <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-md p-2 w-full">
                      <input
                        name="minPrice"
                        placeholder="$"
                        className="w-full outline-none bg-transparent"
                        onChange={handleChange}
                      />
                      <h4 className="text-[#808080]">/Night</h4>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <h4 className="text-[#3A3A3A] text-sm font-medium">
                      Max Price
                    </h4>
                    <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-md p-2 w-full">
                      <input
                        name="maxPrice"
                        placeholder="$"
                        className="w-full outline-none bg-transparent"
                        onChange={handleChange}
                      />
                      <h4 className="text-[#808080]">/Night</h4>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>

          <div className="flex items-center justify-between w-full border-0 border-t px-4 py-2">
            <button className="text-[#808080] font-semibold text-sm">
              Save as draft
            </button>
            <button
              onClick={() => setModal(<Success setModal={setModal} />)}
              className="bg-primary border border-solid border-primary shadow-sm shadow-primary/40 font-semibold text-xs text-white p-2 rounded-md"
            >
              Add Property
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProperty;

function Success({ setModal }: { setModal: any }) {
  return (
    <div className="relative bg-[#FAFAFA] max-w-xl w-full rounded-2xl">
      <img
        src={blackcancel}
        className="absolute -top-2 z-10 right-0 cursor-pointer"
        onClick={() => setModal(null)}
      />

      <div className="w-full">
        <img src={success} className="w-full rounded-2xl" />
      </div>
      <div className="p-6 flex justify-between gap-2 items-center">
        <div>
          <h2 className="font-medium text-[#25A545] text-2xl mb-1">
            Successful!
          </h2>
          <p className="text-[#808080] text-xs md:text-sm">
            Your property has been successfully added
          </p>
        </div>
        <button className="bg-primary whitespace-nowrap border border-solid border-primary shadow-sm shadow-primary/40 font-semibold text-xs text-white p-2 rounded-md">
          View Property
        </button>
      </div>
    </div>
  );
}
