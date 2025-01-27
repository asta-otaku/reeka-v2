import redcancel from "@/assets/cancel-red.svg";
import { Bookings } from "@/lib/types";
import { useGetReport } from "@/lib/api/queries";
import { useState } from "react";
import Spinner from "@/components/Spinner";
import { usePostCancelBooking } from "@/lib/api/mutations";

export function Modal({
  booking,
  currency,
}: {
  booking: Bookings;
  currency: string;
}) {
  const [reportDetails, setReportDetails] = useState<{
    url: string;
    title: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const { mutate } = usePostCancelBooking();
  const { refetch } = useGetReport(
    reportDetails?.url || "",
    reportDetails?.title || ""
  );
  const handleDelete = () => {
    mutate(booking._id);
  };
  const handleShareInvoice = () => {
    setLoading(true);
    setReportDetails({
      url: `/invoice/${booking.id}/pdf`,
      title: booking.guestEmail,
    });
    setTimeout(() => {
      refetch();
      setLoading(false);
    }, 500);
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="border border-[#C0C0C0] rounded-2xl p-1.5 bg-[#FAFAFA] max-w-xl w-full relative"
    >
      <div className="border border-[#C0C0C0] rounded-xl p-4 bg-white">
        <h5 className="text-[#808080] font-light text-xs">Apartment</h5>
        <div className="flex w-full justify-between items-center my-3">
          <div>
            <h2 className="text-[#121212] font-semibold text-xs">
              {booking.propertyId.propertyName}
            </h2>
            <p className="text-[#3A3A3A] font-light text-[10px]">
              {booking.propertyId.address}
            </p>
          </div>
        </div>
        <div className="w-full h-40">
          <img
            className="w-full h-full object-cover rounded-xl"
            src={booking.propertyId.images[0]}
          />
        </div>
      </div>
      <div className="border border-[#C0C0C0] rounded-xl p-4 bg-white mt-1">
        <div className="flex w-full justify-between items-center">
          <h3 className="text-[#808080] text-xs">Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-3 my-2">
          <div>
            <h2 className="text-[#808080] text-xs">First Name</h2>
            <h4 className="text-[#121212] text-xs mt-0.5">
              {booking.guestFirstName}
            </h4>
          </div>
          <div>
            <h2 className="text-[#808080] text-xs">Last Name</h2>
            <h4 className="text-[#121212] text-xs mt-0.5">
              {booking.guestLastName}
            </h4>
          </div>
          <div>
            <h2 className="text-[#808080] text-xs">Phone no</h2>
            <h4 className="text-[#121212] text-xs mt-0.5">
              {booking.guestPhone}
            </h4>
          </div>
          <div>
            <h2 className="text-[#808080] text-xs">Email</h2>
            <h4 className="text-[#121212] text-xs mt-0.5">
              {booking.guestEmail}
            </h4>
          </div>
          <div>
            <h2 className="text-[#808080] text-xs">Price per night</h2>
            <h4 className="text-[#121212] text-xs mt-0.5">
              {currency}
              {(booking.totalBookingValue / booking.nightsBooked)
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </h4>
          </div>
          <div>
            <h2 className="text-[#808080] text-xs">Number of guest</h2>
            <h4 className="text-[#121212] text-xs mt-0.5">
              {booking.numberOfGuests}
            </h4>
          </div>
          <div>
            <h2 className="text-[#808080] text-xs">Check-in</h2>
            <h4 className="text-[#121212] text-xs mt-0.5">
              {booking.startDate.split("T")[0]}
            </h4>
          </div>
          <div>
            <h2 className="text-[#808080] text-xs">Check-out</h2>
            <h4 className="text-[#121212] text-xs mt-0.5">
              {booking.endDate.split("T")[0]}
            </h4>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={handleShareInvoice}
          disabled={loading}
          className="text-white bg-primary/90 px-3 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2"
        >
          {loading ? <Spinner /> : "Share invoice"}
        </button>
        <button
          onClick={handleDelete}
          className="text-[#F94144] font-medium text-sm flex items-center gap-2"
        >
          <img src={redcancel} />
          Cancel booking
        </button>
      </div>
    </div>
  );
}
