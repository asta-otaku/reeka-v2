import editIcon from "../../assets/edit-01.svg";
import prop from "../../assets/prop1.svg";
import toast from "react-hot-toast";
import { useState } from "react";
import Spinner from "../Spinner";
import apiClient from "../../helpers/apiClient";
import { useCurrency } from "../../helpers/getCurrency";
import moment from "moment";
import { PricePreview } from "../ViewProperty/FeeSection";

function StepTwo({
  formDetails,
  hideFeatures,
  setStep,
  property,
  setInvoiceId,
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
    rateId: string;
    countryCode: string;
  };
  hideFeatures?: boolean;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  property: any;
  setInvoiceId: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const currency = useCurrency();

  function formatTimestamp(date: string) {
    return moment(date).tz("Africa/Lagos").format("YYYY-MM-DD");
  }

  const handleReserve = async () => {
    const payload: any = {
      countryCode: formDetails.countryCode,
      endDate: formatTimestamp(formDetails.checkOut),
      guestEmail: formDetails.email,
      guestFirstName: formDetails.firstName,
      guestLastName: formDetails.lastName,
      guestPhone: `(${formDetails.countryCode})${formDetails.phoneNumber}`,
      numberOfGuests: formDetails.noOfGuests,
      propertyId: property._id,
      startDate: formatTimestamp(formDetails.checkIn),
    };

    if (formDetails.rateId) {
      payload.rateId = formDetails.rateId;
    } else {
      payload.customPrice = formDetails.price;
    }

    setLoading(true);

    try {
      const res = await apiClient.post(`/booking`, payload);
      toast.success("Reservation successful");
      setInvoiceId(res.data.invoices[res.data.invoices.length - 1]);
      setStep(3);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const days = moment(formDetails.checkOut).diff(
    moment(formDetails.checkIn),
    "days"
  );

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
              {property?.propertyName}
            </h2>
            <p className="text-[#3A3A3A] font-light text-[10px]">
              {property?.address}
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
              ({formDetails.countryCode}) {formDetails.phoneNumber}
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
            cautionFee={property.price.cautionFee || 0}
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
