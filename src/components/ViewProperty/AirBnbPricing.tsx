import { useEffect, useState } from "react";
import useStore from "../../store";
import AirBnbModal, { Rate } from "./AirBnbModal";
import PricingCalendar from "./RenderRates";
import apiClient from "../../helpers/apiClient";

function AirBnbPricing({ id, loading }: { id: string; loading: boolean }) {
  const setModal = useStore((state: any) => state.setModal);
  const [rates, setRates] = useState<Rate>({});
  const todayStr = new Date().toISOString().split("T")[0];
  const currentAirbnbRate = rates[todayStr]?.rate;
  const handleSetRates = (newRates: Rate) => {
    setRates(newRates);
  };

  useEffect(() => {
    if (id) {
      apiClient
        .get(`/properties/${id}/airbnb-price`)
        .then((response) => {
          setRates(response.data.rates);
        })
        .catch((error) => {
          console.error("Failed to fetch rates:", error);
        });
    }
  }, [id, loading]);

  return (
    <div>
      <div className="flex flex-col gap-2 w-full">
        <h4 className="text-[#3A3A3A] text-sm font-medium">AirBnB Price</h4>
        <div
          onClick={() =>
            setModal(
              <AirBnbModal
                setModal={setModal}
                setRates={handleSetRates}
                currentRates={rates}
                id={id}
              />
            )
          }
          className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-md p-2 w-full cursor-pointer"
        >
          <span className="text-black">
            {currentAirbnbRate !== undefined
              ? `$${currentAirbnbRate} (Click to edit)`
              : "Set AirBnB price (Click to set)"}
          </span>
        </div>
      </div>
      <PricingCalendar rates={rates} />
    </div>
  );
}

export default AirBnbPricing;
