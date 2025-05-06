import { useState, useEffect } from "react";
import apiClient from "../../../helpers/apiClient";
import toast from "react-hot-toast";

interface Rate {
  _id: string;
  rateName: string;
  ratePrice: number;
  isDefault: boolean;
}

function RateCardsTab({ property }: { property: any }) {
  const [rates, setRates] = useState<Rate[]>([]);
  const [newRate, setNewRate] = useState({ name: "", rate: 0 });
  const [defaultRateIndex, setDefaultRateIndex] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchRates = async () => {
    try {
      const response = await apiClient.get(`/properties/${property._id}/rates`);
      setRates(response.data.rateCards);
      const defaultIndex = response.data.rateCards.findIndex(
        (rate: Rate) => rate.isDefault
      );
      setDefaultRateIndex(defaultIndex);
    } catch (error) {
      console.error("Failed to fetch rates:", error);
    }
  };

  useEffect(() => {
    if (property._id) {
      fetchRates();
    }
  }, [property._id]);

  const handleSaveRate = async () => {
    if (!newRate.name || !newRate.rate) return;

    try {
      await apiClient.post(`/properties/${property._id}/rate`, {
        rateName: newRate.name,
        ratePrice: newRate.rate,
      });
      toast.success("Rate set successfully");
      setShowForm(false);
      await fetchRates();
    } catch (error) {
      toast.error("Failed to save rate");
    }
  };

  const handleRateChange = (
    index: number,
    field: keyof Rate,
    value: string
  ) => {
    const updated = [...rates];
    (updated[index] as any)[field] =
      field === "ratePrice" ? Number(value) : value;
    setRates(updated);
  };

  const handleUpdateRate = async (
    rateId: string,
    rateName: string,
    ratePrice: number
  ) => {
    try {
      await apiClient.put(`/properties/${property._id}/rate/${rateId}`, {
        rateName,
        ratePrice,
      });
      await fetchRates();
      toast.success("Rate has been updated");
    } catch (error) {
      console.error("Failed to update rate:", error);
    }
  };

  const handleSetDefaultRate = async (rateId: string) => {
    try {
      await apiClient.patch(
        `/properties/${property._id}/rate/${rateId}/default`
      );
      toast.success("Rate set as default");
      await fetchRates();
    } catch (error) {
      console.error("Failed to set default rate:", error);
    }
  };

  const handleRemoveRate = async (rateId: string) => {
    try {
      await apiClient.delete(`/properties/${property._id}/rate/${rateId}`);
      await fetchRates();
      toast.success("Rate deleted successfully");
    } catch (error) {
      console.error("Failed to delete rate:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full border rounded-3xl p-4">
      {/* Header */}
      <div className="flex w-full justify-between items-center gap-4 border-b pb-3">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="hidden md:block w-16 h-12 bg-[#D9D9D9] rounded-xl">
            <img
              src={property?.images[0]}
              alt="property"
              className="w-full h-full object-cover rounded-xl"
            />
          </span>
          <div>
            <h1 className="text-[#808080] text-xs font-medium">Rate Card</h1>
            <h2 className="text-[#121212] font-medium text-lg max-w-[300px] md:max-w-full truncate">
              {property?.propertyName}
            </h2>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-3 py-1.5 text-white rounded-lg bg-primary text-sm"
        >
          Add Rate
        </button>
      </div>
      <p className="text-xs text-[#808080] font-medium my-3">
        Select your default rate
      </p>

      {/* Add Rate Form */}
      {showForm && (
        <div className="flex flex-col md:flex-row items-end gap-3 mt-4">
          <div className="flex flex-col gap-0.5 w-full">
            <label className="text-[#344054] font-medium text-sm">
              Rate Name*
            </label>
            <input
              type="text"
              placeholder="Name"
              value={newRate.name}
              onChange={(e) =>
                setNewRate((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-0.5 w-full">
            <label className="text-[#344054] font-medium text-sm">Rate*</label>
            <input
              type="number"
              placeholder="Rate"
              value={newRate.rate || ""}
              onChange={(e) =>
                setNewRate((prev) => ({
                  ...prev,
                  rate: Number(e.target.value),
                }))
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={handleSaveRate}
            className="bg-[#219653] hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ml-4"
          >
            Save Rate
          </button>
        </div>
      )}

      {/* Rates List */}
      {rates.length > 0 ? (
        <div className="mt-6 space-y-4">
          {rates.map((rate, index) => (
            <div key={rate._id} className="grid grid-cols-11 gap-2 items-end">
              <div className="col-span-1 flex justify-center self-center mt-5">
                <input
                  type="radio"
                  checked={defaultRateIndex === index}
                  onChange={() => handleSetDefaultRate(rate._id)}
                  className="accent-black"
                />
              </div>
              <div className="col-span-4">
                <label className="text-[#344054] font-medium text-sm">
                  Rate Name
                </label>
                <input
                  type="text"
                  value={rate.rateName}
                  onChange={(e) =>
                    handleRateChange(index, "rateName", e.target.value)
                  }
                  onBlur={() =>
                    handleUpdateRate(rate._id, rate.rateName, rate.ratePrice)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="col-span-4">
                <label className="text-[#344054] font-medium text-sm">
                  Rate
                </label>
                <input
                  type="number"
                  value={rate.ratePrice}
                  onChange={(e) =>
                    handleRateChange(index, "ratePrice", e.target.value)
                  }
                  onBlur={() =>
                    handleUpdateRate(rate._id, rate.rateName, rate.ratePrice)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="col-span-2 flex justify-end">
                <button
                  onClick={() => handleRemoveRate(rate._id)}
                  className="bg-[#FF3B30] hover:bg-red-600 text-white w-full ml-4 py-2 rounded-lg text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="min-h-20 flex items-center flex-col justify-center gap-1">
          <h2 className="text-[#121212] font-medium text-lg">No Rate Card</h2>
          <h1 className="text-[#808080] text-xs font-medium">
            Rate cards are used to set the price of your property.
          </h1>
        </div>
      )}
    </div>
  );
}

export default RateCardsTab;
