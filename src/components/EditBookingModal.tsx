import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import apiClient from "../helpers/apiClient";
import BookingModal from "./BookingModal";
import Spinner from "./Spinner";
import { localToUTCDate, utcToLocalDate } from "./ViewProperty/AirBnbModal";
import { ChevronDownIcon } from "../assets/icons";
import CustomPriceModal from "./Reservation/CustomPriceModal";

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
  const [rates, setRates] = useState<any[]>([]);
  const [selectedRateId, setSelectedRateId] = useState(booking.rateId || "");
  const [customPrice, setCustomPrice] = useState(
    booking.customPrice ? booking.customPrice.toString() : ""
  );
  const [customPriceSelected, setCustomPriceSelected] = useState(
    booking.customPrice ? true : false
  );
  const [showCustomPriceModal, setShowCustomPriceModal] = useState(false);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await apiClient.get(
          `/properties/${booking.propertyId}/rates`
        );
        setRates(response.data.rateCards);
      } catch (error) {
        console.error("Failed to fetch rates:", error);
      }
    };
    fetchRates();
  }, [booking.propertyId]);

  const handleProceed = async () => {
    const payload: any = {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };

    // Add rate information if changed
    if (customPriceSelected && customPrice) {
      payload.customPrice = Number(customPrice);
    } else if (selectedRateId) {
      payload.rateId = selectedRateId;
    }

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
      <h2 className="text-xl font-semibold mb-4">Edit Booking</h2>

      {/* Date Selection */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-[#121212] mb-2">
          Booking Dates
        </h3>
        <div className="flex gap-2 items-center">
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
      </div>

      {/* Rate Selection */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-[#121212] mb-2">Rate</h3>
        {!customPriceSelected ? (
          <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-lg p-2 w-full">
            <select
              value={selectedRateId}
              onChange={(e: any) => {
                const selectedId = e.target.value;
                if (selectedId === "custom") {
                  setShowCustomPriceModal(true);
                } else {
                  setSelectedRateId(selectedId);
                  setCustomPriceSelected(false);
                  setCustomPrice("");
                }
              }}
              className="outline-none text-secondary text-xs md:text-sm font-light py-0.5 appearance-none border-none bg-transparent w-full"
            >
              <option value="">Select a rate</option>
              {rates?.map((rate, index) => (
                <option key={index} value={rate._id}>
                  {rate.rateName} - ₦{rate.ratePrice.toLocaleString()}
                </option>
              ))}
              <option value="custom">Enter custom price</option>
            </select>
            <ChevronDownIcon width={12} />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-lg p-2 w-full">
              <input
                type="number"
                placeholder="Enter your custom price"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                className="w-full outline-none bg-transparent text-[#667085]"
              />
            </div>
            <div className="mt-1">
              <button
                type="button"
                onClick={() => {
                  setCustomPriceSelected(false);
                  setCustomPrice("");
                  setSelectedRateId("");
                }}
                className="text-xs text-primary underline hover:text-primary/80 transition"
              >
                Use default rate instead
              </button>
            </div>
          </>
        )}
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

      {/* Custom Price Modal */}
      {showCustomPriceModal && (
        <CustomPriceModal
          defaultValue={customPrice}
          onCancel={() => setShowCustomPriceModal(false)}
          onConfirm={(value) => {
            setCustomPrice(value);
            setCustomPriceSelected(true);
            setSelectedRateId("");
            setShowCustomPriceModal(false);
          }}
        />
      )}
    </div>
  );
}

export default EditBookingModal;
