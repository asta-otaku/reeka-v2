import { useState } from "react";

interface Rate {
  name: string;
  rate: number;
}

function RateCardsTab({ property }: { property: any }) {
  const [rates, setRates] = useState<Rate[]>([]);
  const [newRate, setNewRate] = useState({ name: "", rate: 0 });
  const [defaultRateIndex, setDefaultRateIndex] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSaveRate = () => {
    if (!newRate.name || !newRate.rate) return;

    setRates([...rates, newRate]);
    setNewRate({ name: "", rate: 0 });
    setShowForm(false);
  };

  const handleRateChange = (
    index: number,
    field: keyof Rate,
    value: string
  ) => {
    const updated = [...rates];
    (updated[index] as any)[field] = field === "rate" ? Number(value) : value;
    setRates(updated);
  };

  const handleRemoveRate = (index: number) => {
    const updated = rates.filter((_, i) => i !== index);
    setRates(updated);
    if (defaultRateIndex === index) {
      setDefaultRateIndex(null);
    } else if (defaultRateIndex !== null && defaultRateIndex > index) {
      setDefaultRateIndex(defaultRateIndex - 1);
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
      {/* Rate Form */}
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

      {/* Saved Rates */}
      {rates.length > 0 ? (
        <div className="mt-6 space-y-4">
          {rates.map((rate, index) => (
            <div key={index} className="grid grid-cols-11 gap-2 items-end">
              <div className="col-span-1 flex justify-center self-center mt-5">
                <input
                  type="radio"
                  checked={defaultRateIndex === index}
                  onChange={() => setDefaultRateIndex(index)}
                  className="accent-black"
                />
              </div>
              <div className="col-span-4">
                <label className="text-[#344054] font-medium text-sm">
                  Rate Name
                </label>
                <input
                  type="text"
                  value={rate.name}
                  onChange={(e) =>
                    handleRateChange(index, "name", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="Rate Name"
                />
              </div>
              <div className="col-span-4">
                <label className="text-[#344054] font-medium text-sm">
                  Rate
                </label>
                <input
                  type="number"
                  value={rate.rate}
                  onChange={(e) =>
                    handleRateChange(index, "rate", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="Rate"
                />
              </div>
              <div className="col-span-2 flex justify-end">
                <button
                  onClick={() => handleRemoveRate(index)}
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
          <h2 className="text-[#121212] font-medium text-lg max-w-[300px] md:max-w-full truncate">
            No Rate Card
          </h2>
          <h1 className="text-[#808080] text-xs font-medium">
            Rate cards are used to set the price of your property.
          </h1>
        </div>
      )}
    </div>
  );
}

export default RateCardsTab;
