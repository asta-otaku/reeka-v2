import { useState } from "react";
import { ArrowLongLeftIcon, NotificationIcon } from "../../../assets/icons";
import SuccessModal from "./SuccessModal";
import Amenities from "./Amenities";
import Properties from "./Properties";
import Pricing from "./PricingInputs";
import ImageUpload from "./ImageUpload";
// import NotificationModal from "../NotificationModal";
import Spinner from "../../Spinner";
import toast from "react-hot-toast";
import { usePropertyMutation } from "@/lib/api/mutations";
import { defaultProperty } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

function AddProperty({ setStep }: { setStep: any }) {
  const [openSection, setOpenSection] = useState<string | null>("property");
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = useState(false);
  const { mutateAsync: postProperty, isPending: loading } =
    usePropertyMutation();

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const [formDetails, setFormDetails] = useState({
    ...defaultProperty,
    bathroomCount: 1,
    bedroomCount: 1,
    baseCurrency: "NGN",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormDetails({
      ...formDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (
      !formDetails.propertyName ||
      !formDetails.address ||
      !formDetails.city ||
      !formDetails.country ||
      !formDetails.bedroomCount ||
      !formDetails.bathroomCount ||
      !formDetails.price.basePrice
    ) {
      return toast.error("Please fill all required fields");
    } else {
      const res = await postProperty({ method: "post", data: formDetails });
      if (res) {
        setOpen(true);
        setFormDetails(defaultProperty);
      }
    }
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
        <NotificationIcon
          onClick={() => setOpenModal(!openModal)}
          className="w-5 h-5 cursor-pointer"
        />

        {/* {openModal && <NotificationModal setOpenModal={setOpenModal} />} */}
      </div>

      <div className="my-4 px-6">
        <h3 className="text-deepBlue font-medium text-2xl">Add Property</h3>
        <p className="text-xs text-[#808080]">
          Manage your bookings with ease.
        </p>
      </div>

      <div className="px-4 mb-4">
        <div className="max-w-lg mx-auto w-full border bg-[#F8F8F8] flex flex-col gap-2 rounded-2xl py-2">
          {/* Properties */}
          <Properties
            formDetails={formDetails}
            setFormDetails={setFormDetails}
            handleChange={handleChange}
            toggleSection={toggleSection}
            openSection={openSection}
          />

          {/* Amenities */}
          <Amenities
            toggleSection={toggleSection}
            openSection={openSection}
            formDetails={formDetails}
            setFormDetails={setFormDetails}
          />

          {/* Images */}
          <ImageUpload
            formDetails={formDetails}
            setFormDetails={setFormDetails}
            toggleSection={toggleSection}
            openSection={openSection}
          />

          {/* Pricing */}
          <Pricing
            openSection={openSection}
            toggleSection={toggleSection}
            formDetails={formDetails}
            setFormDetails={setFormDetails}
          />

          <div className="flex items-center justify-between w-full border-0 border-t px-4 py-2">
            <button className="text-[#808080] font-semibold text-sm">
              Save as draft
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-primary border border-solid border-primary shadow-sm shadow-primary/40 font-semibold text-xs text-white p-2 min-w-[150px] rounded-md"
            >
              {loading ? <Spinner /> : "Add Property"}
            </button>
          </div>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[744px]">
          <SuccessModal setOpen={setOpen} propertyId="" />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddProperty;
