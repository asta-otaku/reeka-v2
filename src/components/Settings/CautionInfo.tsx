"use client";

import { useState } from "react";
import toast from "react-hot-toast";
function CautionInfo() {
  const [subscribed, setSubscribed] = useState(false);

  const handleToggle = async () => {
    try {
      // Simulate API call here
      // await apiClient.post("/settings/caution-fee", { subscribed: !subscribed });
      setSubscribed(!subscribed);
      toast.success(
        `Caution Fee ${!subscribed ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update Caution Fee preference.");
    }
  };

  return (
    <div className="max-w-lg w-full mx-auto bg-white border rounded-lg p-6 mt-12">
      <h2 className="md:text-xl font-semibold text-gray-800 mb-4">
        Caution Fee Information
      </h2>

      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
        The Caution Fee is a refundable amount collected from guests to cover
        potential damages during their stay. It ensures trust, reduces risks,
        and provides added security for property owners. Caution Fees are fully
        refunded within 72 hours after checkout if no incident is reported.
      </p>

      <div className="flex items-center justify-between mb-6">
        <label className="block text-sm font-medium text-gray-700">
          Enable Caution Fee
        </label>
        <button
          type="button"
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
            subscribed ? "bg-primary" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              subscribed ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

export default CautionInfo;
