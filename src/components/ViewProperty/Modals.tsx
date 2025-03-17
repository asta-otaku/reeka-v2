import { useState, useCallback } from "react";

export function AirbnbModal({
  initialPrice,
  onCancel,
  onProceed,
}: {
  initialPrice: number | undefined;
  onCancel: () => void;
  onProceed: (price: number, weekendPrice: number) => void;
}) {
  const [price, setPrice] = useState<number | string>(initialPrice || 0);
  const [weekendPrice, setWeekendPrice] = useState<number | string>(0);
  const parseNumberInput = useCallback((value: string) => {
    return value.replace(/[^0-9.]/g, ""); // Allow only numbers and a single decimal
  }, []);
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="border border-gray-300 rounded-2xl p-4 bg-white max-w-md w-full flex flex-col gap-4"
    >
      <h3 className="text-lg font-medium">Link with Airbnb</h3>
      <div>
        <p className="text-sm mb-2">Please update or enter the Airbnb price.</p>
        <input
          value={price}
          onChange={(e) => setPrice(parseNumberInput(e.target.value))}
          className="w-full border rounded p-2"
        />
      </div>
      <div>
        <p className="text-sm mb-2">
          Please update or enter the Airbnb weekend price.
        </p>
        <input
          value={weekendPrice}
          onChange={(e) => setWeekendPrice(parseNumberInput(e.target.value))}
          className="w-full border rounded p-2"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-3 py-2 text-sm bg-gray-300 rounded"
        >
          Cancel
        </button>
        <button
          onClick={() => onProceed(Number(price), Number(weekendPrice))}
          className="px-3 py-2 text-sm bg-primary text-white rounded"
        >
          Proceed
        </button>
      </div>
    </div>
  );
}

export function DeleteModal({ handleDelete, setModal }: any) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="border border-[#C0C0C0] rounded-2xl p-1.5 bg-[#FAFAFA] max-w-xs w-full relative"
    >
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <h3 className="text-[#121212] font-medium text-sm">Delete Property</h3>
        <span
          onClick={() => setModal(null)}
          className="cursor-pointer text-[#808080]"
        >
          X
        </span>
      </div>
      <div className="p-4">
        <p className="text-[#808080] text-xs">
          Are you sure you want to delete this property?
        </p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={handleDelete}
            className="px-3 py-1.5 text-white rounded-xl bg-[#FF3B30] text-sm font-medium"
          >
            Yes
          </button>
          <button
            onClick={() => setModal(null)}
            className="px-3 py-1.5 text-white rounded-xl bg-green-500 text-sm font-medium"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
