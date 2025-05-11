import { useEffect, useState } from "react";
import graycancel from "../assets/graycancel.svg";
import redcancel from "../assets/cancel-red.svg";
import toast from "react-hot-toast";
import apiClient from "../helpers/apiClient";
import EditBookingModal from "./EditBookingModal";
function BookingModal({
  booking,
  setModal,
  currency,
}: {
  booking: any;
  setModal: any;
  currency: string;
}) {
  const [incident, setIncident] = useState<any>(null);

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const res = await apiClient.get(
          `/booking/${booking?._id}/incident-report`
        );
        setIncident(res.data);
      } catch (error: any) {
        if (error.response?.status === 404) {
          setIncident(null);
        }
      }
    };

    if (booking?._id) {
      fetchIncident();
    }
  }, [booking?._id]);

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/booking/${booking._id}`);
      toast.success("Booking deleted successfully");
      setModal(null);
      window.location.reload();
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.error || "An error occurred");
      }
    }
  };

  const handleShareInvoice = async () => {
    await apiClient
      .get(`/invoice/${booking._id}/pdf`, { responseType: "blob" })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `invoice-${booking._id}.pdf`);
        document.body.appendChild(link);
        link.click();
        toast.success("Invoice sent successfully");
        setModal(null);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.error || "An error occurred");
      });
  };

  return (
    <div className="max-h-[90vh] overflow-auto no-scrollbar">
      <div
        onClick={(e) => e.stopPropagation()}
        className="border border-[#C0C0C0] rounded-2xl p-1.5 bg-[#FAFAFA] max-w-xl w-full relative"
      >
        <img
          src={graycancel}
          alt=""
          onClick={() => setModal(null)}
          className="absolute top-2 right-2 cursor-pointer"
        />
        <div className="border border-[#C0C0C0] rounded-xl p-4 bg-white">
          <h5 className="text-[#808080] font-light text-xs">Apartment</h5>
          <div className="flex w-full justify-between items-center my-3">
            <div>
              <h2 className="text-[#121212] font-semibold text-xs">
                {booking?.propertyId?.propertyName}
              </h2>
              <p className="text-[#3A3A3A] font-light text-[10px]">
                {booking?.propertyId?.address}
              </p>
            </div>
            {incident ? (
              <div className="bg-yellow-100 text-yellow-700 text-[10px] font-medium px-2.5 py-1 rounded-full">
                Incident Recorded – {incident.title}
              </div>
            ) : booking?.cautionFee ? (
              <div className="bg-green-100 text-green-700 text-[10px] font-medium px-2.5 py-1 rounded-full">
                No incidents
              </div>
            ) : (
              <div className="bg-gray-200 text-gray-600 text-[10px] font-medium px-2.5 py-1 rounded-full">
                No Caution Fee Assigned
              </div>
            )}
          </div>
          <div className="w-full h-40">
            <img
              className="w-full h-full object-cover rounded-xl"
              src={booking?.propertyId?.images[0]}
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
                {booking?.guestFirstName}
              </h4>
            </div>
            <div>
              <h2 className="text-[#808080] text-xs">Last Name</h2>
              <h4 className="text-[#121212] text-xs mt-0.5">
                {booking?.guestLastName}
              </h4>
            </div>
            <div>
              <h2 className="text-[#808080] text-xs">Phone no</h2>
              <h4 className="text-[#121212] text-xs mt-0.5">
                {booking?.guestPhone}
              </h4>
            </div>
            <div>
              <h2 className="text-[#808080] text-xs">Email</h2>
              <h4 className="text-[#121212] text-xs mt-0.5 max-w-[180px] truncate">
                {booking?.guestEmail}
              </h4>
            </div>
            <div>
              <h2 className="text-[#808080] text-xs">Price per night</h2>
              <h4 className="text-[#121212] text-xs mt-0.5">
                {currency}
                {(booking?.totalBookingValue / booking?.nightsBooked)
                  ?.toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </h4>
            </div>
            <div>
              <h2 className="text-[#808080] text-xs">Number of guest</h2>
              <h4 className="text-[#121212] text-xs mt-0.5">
                {booking?.numberOfGuests}
              </h4>
            </div>
            <div>
              <h2 className="text-[#808080] text-xs">Check-in</h2>
              <h4 className="text-[#121212] text-xs mt-0.5">
                {booking?.startDate?.split("T")[0]}
              </h4>
            </div>
            <div>
              <h2 className="text-[#808080] text-xs">Check-out</h2>
              <h4 className="text-[#121212] text-xs mt-0.5">
                {booking?.endDate?.split("T")[0]}
              </h4>
            </div>
          </div>
        </div>
        <div className="flex justify-center flex-wrap gap-4 mt-4">
          <button
            onClick={handleShareInvoice}
            className="text-white bg-primary/90 px-3 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2"
          >
            Share invoice
          </button>
          <button
            onClick={handleDelete}
            className="text-[#F94144] font-medium text-sm flex items-center gap-2"
          >
            <img src={redcancel} alt="cancel booking" />
            Cancel booking
          </button>
          {/* New Edit Booking button */}
          <button
            onClick={() =>
              setModal(
                <EditBookingModal
                  setModal={setModal}
                  booking={booking}
                  currency={currency}
                />
              )
            }
            className="text-white bg-secondary/90 px-3 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2"
          >
            Edit Booking
          </button>
        </div>
      </div>
    </div>
  );
}
export default BookingModal;
