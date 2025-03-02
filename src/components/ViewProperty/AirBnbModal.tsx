import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export interface Rate {
  [date: string]: {
    rate: number;
  };
}

export default function AirBnbModal({
  setModal,
  setRates,
  currentRates,
}: {
  setModal: any;
  setRates: (rates: Rate) => void;
  currentRates: Rate;
}) {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [rate, setRate] = useState<number | "">("");

  useEffect(() => {
    const dateStr = startDate.toISOString().split("T")[0];
    if (currentRates[dateStr]) {
      setRate(currentRates[dateStr].rate);
    } else {
      setRate("");
    }
  }, [startDate, currentRates]);

  const handleSave = () => {
    if (rate === "") {
      alert("Please enter a rate");
      return;
    }

    const newRates = { ...currentRates };
    const currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split("T")[0];
      newRates[dateStr] = { rate: Number(rate) };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setRates(newRates);
    setModal(null);
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          Edit Price Over a Date Range
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Date Range</label>
          <div className="flex gap-2">
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => {
                if (date) {
                  setStartDate(date);
                  if (date > endDate) setEndDate(date);
                }
              }}
              className="border p-2 rounded w-full"
              minDate={new Date()}
            />
            <span className="self-center">–</span>
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => {
                if (date) setEndDate(date);
              }}
              className="border p-2 rounded w-full"
              minDate={startDate}
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Nightly Rate</label>
          <div className="flex items-center border rounded">
            <span className="px-3">$</span>
            <input
              type="number"
              value={rate}
              onChange={(e) =>
                setRate(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="p-2 w-full outline-none"
              min="0"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setModal(null)}
            className="px-4 py-2 text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/70"
          >
            Save Rates
          </button>
        </div>
      </div>
    </div>
  );
}
