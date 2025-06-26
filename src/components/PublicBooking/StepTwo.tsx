import editIcon from "../../assets/edit-01.svg";
import prop from "../../assets/prop1.svg";
import { useState } from "react";
import Spinner from "../Spinner";
import { Link } from "react-router-dom";
import { useCurrency } from "../../helpers/getCurrency";
import moment from "moment";
import { PricePreview } from "../ViewProperty/FeeSection";
import axios from "axios";
import { CONSTANT } from "../../util";

export function formatTimestamp(dateString: string) {
  const [day, month, year] = dateString.split("/");

  // Combine to get the desired format
  return `${year}-${month}-${day}`;
}

function StepTwo({
  formDetails,
  hideFeatures,
  property,
  paymentLink,
  bookingId,
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
    rateName?: string;
    rateId?: string;
    note?: string;
    includeNote?: boolean;
    userId?: string;
    countryCode: string;
    propertyName?: string;
    propertyAddress?: string;
    property?: string;
    cautionFee?: number;
    paymentStatus?: string;
  };
  hideFeatures?: boolean;
  property?: any;
  paymentLink?: string;
  bookingId?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const currency = useCurrency();

  const handleInvoiceDownload = async () => {
    setLoading(true);
    axios
      .get(`${CONSTANT.BASE_URL}/invoice/${bookingId}/pdf`, {
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `invoice-${bookingId}.pdf`);
        document.body.appendChild(link);
        link.click();
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const calculateDays = (checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut) return 0;
    const start = moment(checkIn, "DD/MM/YYYY");
    const end = moment(checkOut, "DD/MM/YYYY");
    return end.diff(start, "days");
  };

  function daysBetween(startISO: string, endISO: string) {
    const start = new Date(startISO);
    const end = new Date(endISO);
    const diffMs = end.getTime() - start.getTime();
    return diffMs / (1000 * 60 * 60 * 24);
  }

  const days = hideFeatures
    ? daysBetween(formDetails.checkIn, formDetails.checkOut)
    : calculateDays(formDetails.checkIn, formDetails.checkOut);

  function getTotalPrice() {
    const totalBase = Number(formDetails.price) * days;
    const totalPrice = totalBase;
    return totalPrice;
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
              {property?.propertyDetails?.propertyName ||
                formDetails.propertyName}
            </h2>
            <p className="text-[#3A3A3A] font-light text-[10px]">
              {property?.address?.propertyDetails ||
                formDetails.propertyAddress}
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
            src={property?.propertyDetails?.images[0] ?? prop}
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
            <h2 className="text-[#808080] text-xs">Total Price</h2>
            <h4 className="text-[#121212] text-xs mt-0.5 capitalize">
              {formDetails.price === "airbnb" ? "$" : currency}
              {getTotalPrice()
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

      <div className="-mt-4">
        {showPreview && (
          <PricePreview
            basePrice={Number(formDetails.price)}
            cautionFee={
              formDetails?.cautionFee ?? property?.price?.cautionFee ?? 0
            }
            days={days}
          />
        )}
      </div>
      <button
        onClick={() => setShowPreview(!showPreview)}
        className={`${
          showPreview ? "mt-2" : "mt-6"
        } text-primary underline text-xs`}
      >
        {showPreview ? "Hide Price Preview" : "Show Price Preview"}
      </button>

      <div
        className={`my-3 w-full flex gap-4 justify-center ${
          hideFeatures && "hidden"
        }`}
      >
        <button
          onClick={handleInvoiceDownload}
          className="w-[130px] rounded-lg bg-[#6D6D6D] text-white font-medium text-sm py-2"
        >
          {loading ? <Spinner /> : "Download Invoice"}
        </button>
        <Link
          to={paymentLink || "#"}
          className={`w-[130px] rounded-lg bg-primary text-white text-center font-medium text-sm py-2 ${
            formDetails.paymentStatus === "paid" ? "hidden" : ""
          }`}
        >
          Pay Now
        </Link>
      </div>
    </>
  );
}

export default StepTwo;
