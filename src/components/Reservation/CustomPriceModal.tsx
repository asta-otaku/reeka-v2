import { useState } from "react";

interface CustomPriceModalProps {
  onConfirm: (value: string) => void;
  onCancel: () => void;
  defaultValue?: string;
  isAgentFee?: boolean;
}

export default function CustomPriceModal({
  onConfirm,
  onCancel,
  defaultValue = "",
  isAgentFee,
}: CustomPriceModalProps) {
  const [price, setPrice] = useState(defaultValue);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md"
      >
        <h3 className="text-lg font-semibold text-[#121212] mb-3">
          {isAgentFee ? "Set Custom Agent Fee" : "Enter Custom Rate"}
        </h3>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-3"
          placeholder="e.g. 50,000"
          value={price.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          onChange={(e) => {
            const rawValue = e.target.value.replace(/,/g, "");
            if (!isNaN(Number(rawValue))) {
              setPrice(rawValue);
            }
          }}
        />
        {!isAgentFee && (
          <p className="text-xs text-[#FF8C00] italic mb-4">
            Custom rate is the total amount for the full duration of the
            booking. It overrides nightly rates for this booking.
          </p>
        )}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="text-sm px-4 py-2 rounded-md border border-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(price)}
            disabled={!price}
            className="text-sm px-4 py-2 rounded-md bg-primary text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
