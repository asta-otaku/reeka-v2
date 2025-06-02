import editIcon from "../../assets/edit-01.svg";
import prop from "../../assets/prop1.svg";
import toast from "react-hot-toast";
import { useState } from "react";
import Spinner from "../Spinner";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCurrency } from "../../helpers/getCurrency";
import apiClient from "../../helpers/apiClient";
import moment from "moment";
import { PricePreview } from "../ViewProperty/FeeSection";

function formatTimestamp(dateString: string) {
  const [day, month, year] = dateString.split("/");

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
  };
  hideFeatures?: boolean;
  property?: any;
}) {
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const navigate = useNavigate();
  const currency = useCurrency();
  const { id } = useParams();
  const location = useLocation();

  const handleReserve = async () => {
    const payload = {
      propertyId: property?._id,
      startDate: formatTimestamp(formDetails.checkIn),
      endDate: formatTimestamp(formDetails.checkOut),
      guestFirstName: formDetails.firstName,
      guestLastName: formDetails.lastName,
      guestEmail: formDetails.email,
      guestPhone: `(${formDetails.countryCode})${formDetails.phoneNumber}`,
      countryCode: formDetails.countryCode,
      numberOfChildren: 0,
      numberOfGuests: formDetails.noOfGuests,
      priceState: Number(formDetails.price) || 0,
      rateId: formDetails.rateId,
      note: formDetails.note,
      // userId: formDetails.userId,
      includeNote: formDetails.includeNote,
    };

    setLoading(true);
    const apiEndpoint = location.pathname.includes("/agent")
      ? `/agents/${id}/booking`
      : `/public/booking`;

    try {
      const res = await apiClient.post(apiEndpoint, payload);
      setLoading(false);
      toast.success("Reservation successful");

      navigate(`/invoice/${res.data.invoices[res.data.invoices.length - 1]}`);
    } catch (err: any) {
      console.error(err);
      setLoading(false);
      toast.error(err.response?.data?.error || "An error occurred");
    }
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
              formDetails?.cautionFee ??
              property?.propertyDetails?.price?.cautionFee ??
              0
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
