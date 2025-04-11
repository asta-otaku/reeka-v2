import { FC } from "react";

interface FeeSectionProps {
  cautionFee: number;
  setCautionFee: (val: number) => void;
  edit: boolean;
}

const FeeSection: FC<FeeSectionProps> = ({
  cautionFee,
  setCautionFee,
  edit,
}) => {
  return (
    <div className="border p-6 rounded-xl shadow-sm bg-white my-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Additional Fees
      </h3>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm font-medium text-gray-600 w-full">
            Fee Type
          </label>
          <select
            disabled
            className="border px-3 py-2 rounded-md bg-gray-100 text-sm text-gray-500 w-full cursor-not-allowed"
          >
            <option>Caution Fee</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label
            htmlFor="cautionFee"
            className="text-sm font-medium text-gray-600 "
          >
            Amount
          </label>
          <div className="w-full flex gap-2 items-center">
            <input
              id="cautionFee"
              type="number"
              value={cautionFee || ""}
              onChange={(e) => setCautionFee(Number(e.target.value))}
              placeholder="e.g. 50000"
              className={`border px-4 py-2 rounded-md text-sm w-full outline-none transition-all duration-200 ${
                edit
                  ? "bg-white"
                  : "bg-gray-100 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!edit}
            />
            {edit && (
              <button
                type="button"
                onClick={() => setCautionFee(0)}
                className="text-red-500 text-xl px-2 hover:text-red-700"
                title="Remove fee"
              >
                &minus;
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 bg-gray-50 px-5 py-4 rounded-md text-sm text-gray-800">
        <p className="font-medium mb-2">Fee Breakdown</p>
        {cautionFee > 0 && (
          <p>
            <span className="font-semibold">Caution Fee:</span> ₦
            {cautionFee?.toLocaleString()}
          </p>
        )}
        <p className="text-gray-500 italic text-xs mt-2">
          This fee is fully refundable within 72 hours after checkout if no
          incident is reported.
        </p>
      </div>
    </div>
  );
};

export const PricePreview = ({
  basePrice,
  cautionFee,
}: {
  basePrice: number;
  cautionFee: number;
}) => {
  const days = 5;
  const totalBase = basePrice * days;
  const paymentFee = 0.01 * totalBase;
  const total = totalBase + paymentFee + cautionFee;

  return (
    <div className="bg-white mt-6 p-6 rounded-xl border border-gray-200 shadow-sm text-sm text-gray-800 space-y-2">
      <h4 className="text-md font-semibold mb-3">
        📊 Price Preview (5 nights)
      </h4>
      <p>
        <span className="font-medium">Base Price:</span> ₦
        {totalBase?.toLocaleString()}
      </p>
      <p>
        <span className="font-medium">Online Payment Fee (1%):</span> ₦
        {paymentFee?.toLocaleString()}
      </p>
      <p>
        <span className="font-medium">Caution Fee:</span> ₦
        {cautionFee?.toLocaleString()}
      </p>
      <p className="font-bold text-gray-900 pt-2">
        Total: ₦{total.toLocaleString()}
      </p>
      <p className="italic text-xs text-gray-500 pt-1">
        Note: Caution Fee will be automatically refunded 72 hours after checkout
        if no incident is reported.
      </p>
    </div>
  );
};

export default FeeSection;
