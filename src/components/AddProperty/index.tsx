import { useState } from "react";
import { ArrowLongLeftIcon, NotificationIcon } from "../../assets/icons";
import useStore from "../../store";
import SuccessModal from "./SuccessModal";
import Amenities from "./Amenities";
import Properties from "./Properties";
import Pricing from "./Pricing";
import ImageUpload from "./ImageUpload";
// import NotificationModal from "../NotificationModal";
import { CONSTANT } from "../../util";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

function AddProperty({ setStep }: { setStep: any }) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const setModal = useStore((state: any) => state.setModal);
  const [openModal, setOpenModal] = useState(false);

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const [formDetails, setFormDetails] = useState<{
    propertyName: string;
    address: string;
    city: string;
    country: string;
    baseCurrency: string;
    owner: string;
    employees: string[];
    price: {
      basePrice: number;
      discountPercentage: number;
      boostPercentage: number;
    };
    pricingState: string;
    bedroomCount: number;
    bathroomCount: number;
    amenities: {
      [key: string]: number;
    };
    images: string[];
  }>({
    propertyName: "",
    address: "",
    city: "",
    country: "",
    baseCurrency: "USD",
    owner: CONSTANT.USER_ID,
    employees: [],
    price: {
      basePrice: 0,
      discountPercentage: 0,
      boostPercentage: 0,
    },
    pricingState: "base",
    bedroomCount: 0,
    bathroomCount: 0,
    amenities: {},
    images: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormDetails({
      ...formDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(formDetails);
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
      const formData = new FormData();
      formData.append("propertyName", formDetails.propertyName);
      formData.append("address", formDetails.address);
      formData.append("city", formDetails.city);
      formData.append("country", formDetails.country);
      formData.append("baseCurrency", formDetails.baseCurrency);
      formData.append("owner", formDetails.owner);
      formData.append("employees", JSON.stringify(formDetails.employees));
      formData.append("bedroomCount", formDetails.bedroomCount.toString());
      formData.append("bathroomCount", formDetails.bathroomCount.toString());
      formData.append("amenities", JSON.stringify(formDetails.amenities));
      formData.append("price", JSON.stringify(formDetails.price));
      formDetails.images.forEach((image) => {
        formData.append("images", image);
      });

      axios
        .post(`${CONSTANT.BASE_URL}/properties`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          toast.success("Property added successfully");
          setModal(<SuccessModal setModal={setModal} />);
        })
        .catch(() => {
          toast.error("An error occurred");
        });
    }
  };

  return (
    <div>
      <Toaster />
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
            setModal={setModal}
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
