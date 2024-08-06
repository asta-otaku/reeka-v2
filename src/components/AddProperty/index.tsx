import { useState } from "react";
import { ArrowLongLeftIcon, NotificationIcon } from "../../assets/icons";
import useStore from "../../store";
import SuccessModal from "./SuccessModal";
import Amenities from "./Amenities";
import Properties from "./Properties";
import Pricing from "./Pricing";
import ImageUpload from "./ImageUpload";

function AddProperty({ setStep }: { setStep: any }) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const setModal = useStore((state: any) => state.setModal);

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
          <Properties
            // formDetails={formDetails}
            // setFormDetails={setFormDetails}
            handleChange={handleChange}
            toggleSection={toggleSection}
            openSection={openSection}
          />

          {/* Amenities */}
          <Amenities
            toggleSection={toggleSection}
            openSection={openSection}
            setModal={setModal}
          />

          {/* Images */}
          <ImageUpload
            toggleSection={toggleSection}
            openSection={openSection}
          />

          {/* Pricing */}
          <Pricing
            handleChange={handleChange}
            openSection={openSection}
            toggleSection={toggleSection}
          />

          <div className="flex items-center justify-between w-full border-0 border-t px-4 py-2">
            <button className="text-[#808080] font-semibold text-sm">
              Save as draft
            </button>
            <button
              onClick={() => setModal(<SuccessModal setModal={setModal} />)}
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
