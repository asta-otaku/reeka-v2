import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import apiClient from "../helpers/apiClient";
import BookingModal from "./BookingModal";
import Spinner from "./Spinner";
import { localToUTCDate, utcToLocalDate } from "./ViewProperty/AirBnbModal";

function EditBookingModal({
  booking,
  setModal,
  currency,
}: {
  booking: any;
  setModal: any;
  currency: string;
}) {
  const [startDate, setStartDate] = useState<Date>(new Date(booking.startDate));
  const [endDate, setEndDate] = useState<Date>(new Date(booking.endDate));
  const [loading, setLoading] = useState(false);

  const handleProceed = async () => {
    const payload = {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };

    try {
      setLoading(true);
      await apiClient.put(`/booking/${booking._id}`, payload);
      toast.success("Booking updated successfully");
      setTimeout(() => window.location.reload(), 2000);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      if (error.response) {
        toast.error(error.response.data.error || "An error occurred");
      }
    }
  };

  const handleCancel = () => {
    setModal(
      <BookingModal booking={booking} setModal={setModal} currency={currency} />
    );
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white rounded-xl p-6 w-full max-w-md"
    >
      <h2 className="text-xl font-semibold mb-4">Edit Booking Dates</h2>
      <div className="flex gap-2 items-center mb-6">
        <DatePicker
          selected={utcToLocalDate(startDate)}
          onChange={(date: Date | null) => {
            if (date) {
              const utcDate = localToUTCDate(date);
              setStartDate(utcDate);
              if (utcDate > endDate) setEndDate(utcDate);
            }
          }}
          className="border p-2 rounded w-full"
          dateFormat="dd/MM/yyyy"
          minDate={utcToLocalDate(
            new Date(
              Date.UTC(
                new Date().getUTCFullYear(),
                new Date().getUTCMonth(),
                new Date().getUTCDate()
              )
            )
          )}
        />
        <span className="self-center">–</span>
        <DatePicker
          selected={utcToLocalDate(endDate)}
          onChange={(date: Date | null) => {
            if (date) setEndDate(localToUTCDate(date));
          }}
          className="border p-2 rounded w-full"
          dateFormat="dd/MM/yyyy"
          minDate={utcToLocalDate(startDate)}
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
        <button
          onClick={handleProceed}
          disabled={loading}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/70"
        >
          {loading ? <Spinner /> : "Proceed"}
        </button>
      </div>
    </div>
  );
}

export default EditBookingModal;
