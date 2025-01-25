import editIcon from "../../assets/edit-01.svg";
import prop from "../../assets/prop1.svg";
import toast from "react-hot-toast";
import { useState } from "react";
import Spinner from "../Spinner";
import { CONSTANT } from "../../util";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "@/hooks/use-get-currency";

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);

  // Extract date components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  // Combine to get the desired format
  return `${year}-${month}-${day}`;
}

function StepTwo({
  formDetails,
  hideFeatures,
  property,
}: {
  formDetails: {
    firstName: string;
    lastName: string;
    noOfGuests: string;
    email: string;
    phoneNumber: string;
    checkIn: string;
    checkOut: string;
    price: string;
    countryCode: string;
    propertyName?: string;
    propertyAddress?: string;
    property?: string;
  };
  hideFeatures?: boolean;
  property?: any;
}) {
  const [formData, setFormData] = useState({
    propertyId: property?._id || formDetails.property,
    startDate: formDetails.checkIn,
    endDate: formDetails.checkOut,
    guestFirstName: formDetails.firstName,
    guestLastName: formDetails.lastName,
    guestEmail: formDetails.email,
    guestPhone: `(${formDetails.countryCode})${formDetails.phoneNumber}`,
    countryCode: formDetails.countryCode,
    numberOfChildren: 0,
    numberOfGuests: formDetails.noOfGuests,
    priceState: formDetails.price,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const currency = useCurrency();

  const handleReserve = async () => {
    setFormData({
      ...formData,
      startDate: formatTimestamp(formDetails.checkIn),
      endDate: formatTimestamp(formDetails.checkOut),
    });
    setLoading(true);
    await axios
      .post(`${CONSTANT.BASE_URL}/public/booking`, formData)
      .then((res) => {
        setLoading(false);
        toast.success("Reservation successful");
        navigate(`/invoice/${res.data.invoices[res.data.invoices.length - 1]}`);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error(err.response.data.error || "An error occured");
      });
  };

  function getPrice(price: string) {
    if (!property || !property.price) {
      return formDetails.price;
    }

    switch (price) {
      case "base":
        return property.price.basePrice.toFixed(2);

      case "high":
        return (
          property?.price?.basePrice +
          (property?.price?.boostPercentage / 100) * property?.price?.basePrice
        ).toFixed(2);

      case "low":
        return (
          property?.price?.basePrice -
          (Math.abs(property?.price?.discountPercentage) / 100) *
            property?.price?.basePrice
        ).toFixed(2);

      case "airbnb":
        return property?.price?.airbnbPrice;

      default:
        return property.price.basePrice; // Default to basePrice if the price type is unrecognized
    }
  }

  return (
    <>
      <div
        className={`border border-[#C0C0C0] rounded-xl p-4 bg-white ${
          hideFeatures && "border-x-0 shadow"
        }`}
      >
        <h5 className="text-[#808080] font-light text-xs">Apartment</h5>
        <div className="flex w-full justify-between items-center my-3">
          <div>
            <h2 className="text-[#121212] font-semibold text-xs">
              {property?.propertyName || formDetails.propertyName}
            </h2>
            <p className="text-[#3A3A3A] font-light text-[10px]">
              {property?.address || formDetails.propertyAddress}
            </p>
          </div>
          <img
            src={editIcon}
            alt="edit"
            style={{ display: hideFeatures ? "none" : "block" }}
          />
        </div>
        <div className="w-full h-40">
          <img
            className="w-full h-full object-cover rounded-xl"
            src={property?.images[0] ?? prop}
          />
        </div>
      </div>

      <div
        className={`border border-[#C0C0C0] rounded-xl p-4 bg-white mt-1 ${
          hideFeatures && "border-x-0 shadow"
        }`}
      >
        <div className="flex w-full justify-between items-center">
          <h3 className="text-[#808080] text-xs">Details</h3>
          <img
            src={editIcon}
            alt="edit"
            style={{ display: hideFeatures ? "none" : "block" }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-3 my-2">
          <div>
            <h2 className="text-[#808080] text-xs">First Name</h2>
            <h4 className="text-[#121212] text-xs mt-0.5">
              {formDetails.firstName}
            </h4>
          </div>
          <div>
            <h2 className="text-[#808080] text-xs">Last Name</h2>
            <h4 className="text-[#121212] text-xs mt-0.5">
              {formDetails.lastName}
            </h4>
          </div>
          <div>
            <h2 className="text-[#808080] text-xs">Phone no</h2>
            <h4 className="text-[#121212] text-xs mt-0.5">
              {formDetails.countryCode ? `(${formDetails.countryCode}) ` : ""}
              {formDetails.phoneNumber}
            </h4>
          </div>
          <div>
            <h2 className="text-[#808080] text-xs">Email</h2>
            <h4 className="text-[#121212] text-xs mt-0.5">
              {formDetails.email}
            </h4>
          </div>
          <div>
            <h2 className="text-[#808080] text-xs">Price per night</h2>
            <h4 className="text-[#121212] text-xs mt-0.5 capitalize">
              {formDetails.price === "airbnb" ? "$" : currency}
              {getPrice(formDetails.price)
                ?.toString()
                ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0}
            </h4>
          </div>
          <div>
            <h2 className="text-[#808080] text-xs">Number of guest</h2>
            <h4 className="text-[#121212] text-xs mt-0.5">
              {formDetails.noOfGuests}
            </h4>
          </div>
          <div>
            <h2 className="text-[#808080] text-xs">Check-in</h2>
            <h4 className="text-[#121212] text-xs mt-0.5">
              {formDetails.checkIn}
            </h4>
          </div>
          <div>
            <h2 className="text-[#808080] text-xs">Check-out</h2>
            <h4 className="text-[#121212] text-xs mt-0.5">
              {formDetails.checkOut}
            </h4>
          </div>
        </div>
      </div>
      <div
        className={`my-3 w-full flex justify-center ${
          hideFeatures && "hidden"
        }`}
      >
        <button
          disabled={loading}
          onClick={handleReserve}
          className="w-[160px] rounded-lg bg-primary text-white font-medium text-sm py-2"
        >
          {loading ? <Spinner /> : "Reserve"}
        </button>
      </div>
    </>
  );
}

export default StepTwo;
