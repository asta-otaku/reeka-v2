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
    } catch (error: any) {
      toast.error(error.response.data.error);
      console.error("Failed to update rate:", error);
    }
  };

  useEffect(() => {
    if (property._id) {
      fetchRates();
    }
  }, [property._id]);

  const generatePublicUrlForRate = async (rateId: string) => {
    try {
      const { data: url } = await apiClient.get(
        `/public/url/${property._id}/${rateId}`
      );
      await navigator.clipboard.writeText(url);
      toast.success("Copied public link for this rate!");
    } catch (err) {
      console.error(err);
      toast.error("Could not generate public link");
    }
  };

  const handleSaveRate = async () => {
    if (!newRate.name || !newRate.rate) return;

    try {
      const res = await apiClient.post(`/properties/${property._id}/rate`, {
        rateName: newRate.name,
        ratePrice: newRate.rate,
      });
      setNewRate({ name: "", rate: 0 });
      toast.success(res.data.message);
      setShowForm(false);
      await fetchRates();
    } catch (error: any) {
      toast.error(error.response.data.error);
      console.error("Failed to update rate:", error);
    }
  };

  const handleRateChange = (
    rateId: string,
    field: keyof Rate,
    value: string
  ) => {
    setRates((prevRates) =>
      prevRates.map((rate) =>
        rate._id === rateId
          ? {
              ...rate,
              [field]: field === "ratePrice" ? Number(value) : value,
            }
          : rate
      )
    );
  };

  const handleUpdateRate = async (
    rateId: string,
    rateName: string,
    ratePrice: number
  ) => {
    try {
      const res = await apiClient.put(
        `/properties/${property._id}/rate/${rateId}`,
        {
          rateName,
          ratePrice,
        }
      );
      await fetchRates();
      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error.response.data.error);
      console.error("Failed to update rate:", error);
    }
  };

  const handleSetDefaultRate = async (rateId: string) => {
    try {
      const res = await apiClient.patch(
        `/properties/${property._id}/rate/${rateId}/default`
      );
      toast.success(res.data.message);
      await fetchRates();
    } catch (error: any) {
      toast.error(error.response.data.error);
      console.error("Failed to update rate:", error);
    }
  };

  const handleRemoveRate = async (rateId: string) => {
    try {
      const res = await apiClient.delete(
        `/properties/${property._id}/rate/${rateId}`
      );
      await fetchRates();
      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error.response.data.error);
      console.error("Failed to update rate:", error);
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
            <h2 className="text-[#121212] font-medium text-lg max-w-[200px] md:max-w-full truncate">
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
          {[...rates]
            .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0))
            .map((rate) => {
              const actualIndex = rates.findIndex((r) => r._id === rate._id);
              return (
                <div
                  key={rate._id}
                  className="grid grid-cols-7 lg:grid-cols-12 gap-2 items-end"
                >
                  <div className="col-span-1 flex justify-center self-center mt-5">
                    <input
                      type="radio"
                      checked={defaultRateIndex === actualIndex}
                      onChange={() => handleSetDefaultRate(rate._id)}
                      className="accent-black"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="text-[#344054] font-medium text-sm">
                      Rate Name
                    </label>
                    <input
                      type="text"
                      value={rate.rateName}
                      onChange={(e) =>
                        handleRateChange(rate._id, "rateName", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="text-[#344054] font-medium text-sm">
                      Rate
                    </label>
                    <input
                      type="number"
                      value={rate.ratePrice}
                      onChange={(e) =>
                        handleRateChange(rate._id, "ratePrice", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="col-span-8 lg:col-span-5 flex justify-center lg:justify-end gap-2">
                    <button
                      onClick={() =>
                        handleUpdateRate(
                          rate._id,
                          rate.rateName,
                          rate.ratePrice
                        )
                      }
                      className="bg-[#219653] hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => generatePublicUrlForRate(rate._id)}
                      className="bg-[#3B82F6] hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap"
                    >
                      Public Link
                    </button>
                    <button
                      onClick={() => handleRemoveRate(rate._id)}
                      className="bg-[#FF3B30] hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
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
