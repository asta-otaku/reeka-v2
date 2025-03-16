import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import apiClient from "../../helpers/apiClient";
import Spinner from "../Spinner";
import toast from "react-hot-toast";

export interface Rate {
  [date: string]: {
    rate: number;
  };
}

const tabs = [
  { name: "Date Range", id: "date_range" },
  { name: "Custom Date Range", id: "custom_date" },
];

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const utcToLocalDate = (utcDate: Date): Date => {
  return new Date(
    utcDate.getUTCFullYear(),
    utcDate.getUTCMonth(),
    utcDate.getUTCDate()
  );
};

const localToUTCDate = (localDate: Date): Date => {
  return new Date(
    Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate())
  );
};

export default function AirBnbModal({
  setModal,
  setRates,
  currentRates,
  id,
}: {
  setModal: any;
  setRates: (rates: Rate) => void;
  currentRates: Rate;
  id: string;
}) {
  const [activeTab, setActiveTab] = useState("date_range");
  const [startDate, setStartDate] = useState<Date>(() => {
    const now = new Date();
    return new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );
  });

  const [endDate, setEndDate] = useState<Date>(() => {
    const now = new Date();
    return new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );
  });
  const [rate, setRate] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  useEffect(() => {
    const dateStr = startDate.toISOString().split("T")[0];
    if (currentRates[dateStr]) {
      setRate(currentRates[dateStr].rate);
    } else {
      setRate("");
    }
  }, [startDate, currentRates]);

  const handleDayToggle = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSave = async () => {
    if (rate === "") {
      toast.error("Please enter a rate");
      return;
    }
    const payload: any = {
      rate: Number(rate),
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };
    if (activeTab === "custom_date") {
      payload.days = selectedDays;
    }

    try {
      setLoading(true);
      const response = await apiClient.post(
        `/properties/${id}/airbnb-price`,
        payload
      );
      setRates(response.data.rates);
      toast.success("Rates updated successfully");
      setModal(null);
    } catch (error) {
      toast.error("Error updating rates");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white rounded-lg p-6 w-full max-w-md"
    >
      {/* Tab Navigation */}
      <div className="flex mb-4 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 focus:outline-none w-full ${
              activeTab === tab.id
                ? "border-b-2 border-primary"
                : "text-gray-500"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Date Range Picker */}
      <div className="mb-4">
        <label className="block text-secondary text-sm mb-2">Date Range</label>
        <div className="flex gap-2">
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
            minDate={utcToLocalDate(startDate)}
          />
        </div>
      </div>
      <p className="text-xs text-secondary mb-4">
        All dates are formatted to UTC
      </p>

      {/* Nightly Rate */}
      <div className="mb-6">
        <label className="block text-sm text-secondary mb-2">
          Nightly Rate
        </label>
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

      {activeTab === "custom_date" && (
        <div className="mb-6">
          <label className="block text-sm text-secondary mb-2">
            Select Weekdays
          </label>
          <div className="grid grid-cols-2 gap-2">
            {weekDays.map((day) => (
              <label
                key={day}
                className={`flex items-center text-xs space-x-2 ${
                  selectedDays.includes(day) ? "text-primary" : "text-secondary"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedDays.includes(day)}
                  onChange={() => handleDayToggle(day)}
                  className="accent-primary"
                />
                <span className="text-sm">{day}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setModal(null)}
          className="px-4 py-2 text-gray-500 hover:text-gray-700 border rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/70 min-w-[120px]"
        >
          {loading ? <Spinner /> : "Save Rates"}
        </button>
      </div>
    </div>
  );
}
