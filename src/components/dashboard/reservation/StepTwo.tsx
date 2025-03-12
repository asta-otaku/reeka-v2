import editIcon from "@/assets/edit-01.svg";
import prop from "@/assets/prop1.svg";
import { useState } from "react";
import Spinner from "@/components/Spinner";
import { useCurrency } from "@/hooks/use-get-currency";
import { Property, ReservationForm } from "@/lib/types";
import { usePostReservation } from "@/lib/api/mutations";
import moment from "moment";

function StepTwo({
  formDetails,
  hideFeatures,
  setStep,
  property,
  setInvoiceId,
}: {
  formDetails: ReservationForm;
  hideFeatures?: boolean;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  property: Property;
  setInvoiceId: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [formData, setFormData] = useState({
    countryCode: formDetails.countryCode,
    endDate: formDetails.checkOut,
    guestEmail: formDetails.email,
    guestFirstName: formDetails.firstName,
    guestLastName: formDetails.lastName,
    guestPhone: `(${formDetails.countryCode})${formDetails.phoneNumber}`,
    numberOfChildren: 0,
    numberOfGuests: formDetails.noOfGuests,
    priceState: formDetails.price,
    propertyId: property._id,
    startDate: formDetails.checkIn,
    status: "Upcoming",
    totalBookingValue: 0,
  });
  const currency = useCurrency();
  const { mutateAsync: reserveBooking, isPending: loading } =
    usePostReservation();
  function formatDate(date: string) {
    return moment(date).tz("Africa/Lagos").format("YYYY-MM-DD");
  }

  const handleReserve = async () => {
    const updatedFormData = {
      ...formData,
      startDate: formatDate(formDetails.checkIn),
      endDate: formatDate(formDetails.checkOut),
    };

    const response = await reserveBooking(updatedFormData);
    setInvoiceId(response.invoices[response.invoices.length - 1]);
    setStep(3);
    setFormData(updatedFormData);
  };

  function getPrice(price: string) {
    if (!property || !property.price) {
      return 0;
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
        return property.price.basePrice;
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
          className="w-[160px] rounded-lg bg-primary text-white font-medium text-sm py-2 min-w-[100px]"
        >
          {loading ? <Spinner /> : "Reserve"}
        </button>
      </div>
    </>
  );
}

export default StepTwo;
