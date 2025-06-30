import { FC } from "react";
import { useCurrency } from "../../helpers/getCurrency";
import { useLocation } from "react-router-dom";

interface AgencyFeeSectionProps {
  agencyFee: number;
  setAgencyFee: (fee: number) => void;
  edit: boolean;
}

interface FeeSectionProps {
  cautionFee: number;
  setCautionFee: (val: number) => void;
  edit: boolean;
}

export const AgencyFeeSection: FC<AgencyFeeSectionProps> = ({
  agencyFee,
  setAgencyFee,
  edit,
}) => {
  const currency = useCurrency();

  return (
    <div className="border p-6 rounded-xl shadow-sm bg-white my-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Agent Fee</h3>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Fee Type */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm font-medium text-gray-600 w-full">
            Fee Type
          </label>
          <select
            disabled
            className="border px-3 py-2 rounded-md bg-gray-100 text-sm text-gray-500 w-full cursor-not-allowed"
          >
            <option>Agent Fee</option>
          </select>
        </div>

        {/* Amount */}
        <div className="flex flex-col gap-2 w-full">
          <label
            htmlFor="agencyFee"
            className="text-sm font-medium text-gray-600"
          >
            Amount
          </label>
          <div className="w-full flex gap-2 items-center">
            <input
              id="agencyFee"
              value={agencyFee ? agencyFee.toLocaleString() : ""}
              onChange={(e) => {
                const value = e.target.value.replace(/,/g, "");
                if (!isNaN(Number(value))) {
                  setAgencyFee(Number(value));
                }
              }}
              placeholder="e.g. 2500"
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
                onClick={() => setAgencyFee(0)}
                className="text-red-500 text-xl px-2 hover:text-red-700"
                title="Remove fee"
              >
                &minus;
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Breakdown & Note */}
      <div className="mt-5 bg-gray-50 px-5 py-4 rounded-md text-sm text-gray-800">
        <p className="font-medium mb-2">Fee Breakdown</p>
        {agencyFee > 0 && (
          <p>
            <span className="font-semibold">Agent Fee:</span> {currency}
            {agencyFee.toLocaleString()}
          </p>
        )}
        <p className="text-gray-500 italic text-xs mt-2">
          This fee is for the services provided by the booking agent and is{" "}
          <strong>non‐refundable</strong>.
        </p>
      </div>
    </div>
  );
};

const FeeSection: FC<FeeSectionProps> = ({
  cautionFee,
  setCautionFee,
  edit,
}) => {
  const currency = useCurrency();
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
              value={cautionFee ? cautionFee.toLocaleString() : ""}
              onChange={(e) => {
                const value = e.target.value.replace(/,/g, "");
                if (!isNaN(Number(value))) {
                  setCautionFee(Number(value));
                }
              }}
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
            <span className="font-semibold">Caution Fee:</span> {currency}
            {cautionFee?.toLocaleString()}
          </p>
        )}
        <p className="text-gray-500 italic text-xs mt-2">
          This fee is fully refundable within 24 hours after checkout if no
          incident is reported.
        </p>
      </div>
    </div>
  );
};

export const PricePreview = ({
  basePrice,
  cautionFee,
  days = 5,
  isCustom,
}: {
  basePrice: number;
  cautionFee: number;
  days?: number;
  isCustom?: boolean;
}) => {
  const totalBase = isCustom ? basePrice : basePrice * days;
  const paymentFee = 0.01 * totalBase;
  const total = totalBase + paymentFee + cautionFee;
  const currency = useCurrency();
  const location = useLocation();

  return (
    <div className="bg-white mt-6 p-6 border border-[#C0C0C0]/40 rounded-xl shadow-sm text-sm text-gray-800 space-y-2">
      <h4 className="text-md font-semibold mb-3">
        📊 {location.pathname.includes("listing") && "Example"} Price Preview (
        {days} night{days > 1 ? "s" : ""})
      </h4>
      {!isCustom && (
        <p>
          <span className="font-medium">Price per night:</span> {currency}
          {basePrice?.toLocaleString(undefined, { minimumFractionDigits: 0 })}
        </p>
      )}
      <p>
        <span className="font-medium">
          Total room rate for {days} day{days > 1 ? "s" : ""}:
        </span>{" "}
        {currency}
        {totalBase?.toLocaleString()}
      </p>
      <p>
        <span className="font-medium">Online payment fee (1%):</span> {currency}
        {paymentFee?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>
      <p>
        <span className="font-medium">Caution fee:</span> {currency}
        {cautionFee?.toLocaleString()}
      </p>
      <p className="font-bold text-gray-900 pt-2">
        Total paid by guest: {currency}
        {total.toLocaleString()}
      </p>
      <p className="italic text-xs text-gray-500 py-1">
        Note: Caution fee will be automatically refunded 24 hours after checkout
        if no incident is reported.
      </p>
      <p className="text-xs text-gray-500">
        A 1% fee applies to all direct bookings processed through Reeka. (Paid
        by <span className="font-bold">Guest</span>)
      </p>
    </div>
  );
};

export default FeeSection;
