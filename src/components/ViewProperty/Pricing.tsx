import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useCurrency } from "../../helpers/getCurrency";
import useStore from "../../store";
import AirBnbModal, { Rate } from "./AirBnbModal";
import PricingCalendar from "./RenderRates";
import apiClient from "../../helpers/apiClient";

function Pricing({
  edit,
  property,
  setProperty,
}: {
  edit: boolean;
  property: any;
  setProperty: any;
}) {
  const setModal = useStore((state: any) => state.setModal);
  const [rates, setRates] = useState<Rate>({});
  const todayStr = new Date().toISOString().split("T")[0];
  const currentAirbnbRate = rates[todayStr]?.rate;
  const handleSetRates = (newRates: Rate) => {
    setRates(newRates);
    setProperty({
      ...property,
      price: {
        ...property.price,
        airbnbPrice: currentAirbnbRate,
      },
    });
  };

  useEffect(() => {
    if (property?._id) {
      apiClient
        .get(`/properties/${property._id}/airbnb-price`)
        .then((response) => {
          setRates(response.data.rates);
        })
        .catch((error) => {
          console.error("Failed to fetch rates:", error);
        });
    }
  }, [property?._id]);

  // Helper function to ensure number input is valid
  const parseNumberInput = useCallback((value: string) => {
    return value.replace(/[^0-9.]/g, ""); // Allow only numbers and a single decimal
  }, []);

  // Calculate prices based on percentages
  const calculatedPrices = useMemo(() => {
    const basePrice = property.price.basePrice || 0;
    const discountPercentage = property.price.discountPercentage || 0;
    const boostPercentage = property.price.boostPercentage || 0;

    // Calculate discounted and boosted prices
    const calculatedDiscountedPrice = Math.min(
      basePrice,
      basePrice * (1 + discountPercentage / 100)
    );
    const calculatedBoostedPrice = basePrice * (1 + boostPercentage / 100);

    return {
      discountedPrice: Math.max(
        0,
        Number(calculatedDiscountedPrice.toFixed(2))
      ),
      boostedPrice: Number(calculatedBoostedPrice.toFixed(2)),
    };
  }, [
    property.price.basePrice,
    property.price.discountPercentage,
    property.price.boostPercentage,
  ]);

  const currency = useCurrency();

  // Handler for base price
  const handleBasePrice = useCallback(
    (value: string) => {
      const numericValue = parseNumberInput(value);
      setProperty((prev: any) => ({
        ...prev,
        price: {
          ...prev.price,
          basePrice: Number(numericValue),
          discountedPrice: undefined,
          boostedPrice: undefined,
        },
      }));
    },
    [parseNumberInput]
  );

  // Handler for discounted price
  const handleDiscountedPrice = useCallback(
    (value: string) => {
      const numericValue = parseNumberInput(value);
      const basePrice = property.price.basePrice;
      let validDiscountedPrice = Number(numericValue);

      if (basePrice <= 0) return;

      if (validDiscountedPrice > basePrice) {
        toast.error("Discounted price cannot exceed base price");
        validDiscountedPrice = Math.min(validDiscountedPrice, basePrice);
      }

      const discountPercentage =
        ((basePrice - validDiscountedPrice) / basePrice) * 100;

      setProperty((prev: any) => ({
        ...prev,
        price: {
          ...prev.price,
          discountedPrice: validDiscountedPrice,
          discountPercentage: -Math.min(
            Math.abs(Number(discountPercentage.toFixed(2))),
            100
          ),
        },
      }));
    },
    [parseNumberInput, property.price.basePrice]
  );

  // Handler for boosted price
  const handleBoostedPrice = useCallback(
    (value: string) => {
      const numericValue = parseNumberInput(value);
      const basePrice = property.price.basePrice;

      if (basePrice <= 0) return;

      const boostPercentage =
        ((Number(numericValue) - basePrice) / basePrice) * 100;

      setProperty((prev: any) => ({
        ...prev,
        price: {
          ...prev.price,
          boostedPrice: Number(numericValue),
          boostPercentage: Math.max(Number(boostPercentage.toFixed(2)), 0),
        },
      }));
    },
    [parseNumberInput, property.price.basePrice]
  );

  // Handler for discount percentage
  const handleDiscountPercentage = useCallback(
    (value: number) => {
      if (!edit) return;
      const clampedValue = Math.max(-100, Math.min(0, -Math.abs(value)));

      setProperty((prev: any) => ({
        ...prev,
        price: {
          ...prev.price,
          discountPercentage: clampedValue,
          discountedPrice: undefined, // Clear manual input
        },
      }));
    },
    [edit]
  );

  // Handler for boost percentage
  const handleBoostPercentage = useCallback(
    (value: number) => {
      if (!edit) return;
      const clampedValue = Math.max(0, value);

      setProperty((prev: any) => ({
        ...prev,
        price: {
          ...prev.price,
          boostPercentage: clampedValue,
          boostedPrice: undefined, // Clear manual input
        },
      }));
    },
    [edit]
  );

  return (
    <div className="my-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[#121212] font-medium text-lg">Price</h3>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 w-full">
          <h4 className="text-[#3A3A3A] text-sm font-medium">Base Price</h4>
          <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-md p-2 w-full">
            <span className={`${edit ? "text-black " : "text-[#808080]"}`}>
              {currency}
            </span>
            <input
              name="basePrice"
              type="number"
              disabled={!edit}
              style={{ color: edit ? "#121212" : "#808080" }}
              onChange={(e) => handleBasePrice(e.target.value)}
              value={property?.price?.basePrice}
              className="w-full outline-none bg-transparent"
            />
            <h4 className="text-[#808080]">/Night</h4>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-[#FAFAFA] border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-2xl p-2 w-full">
            <div className="bg-white rounded-2xl p-2">
              <h4 className="text-[#808080] text-xs">Discounted Price</h4>
              <span
                className="text-[#121212] flex gap-2 py-2 text-2xl"
                style={{ color: edit ? "#121212" : "#808080" }}
              >
                {currency}
                <input
                  className="outline-none w-fit bg-transparent overflow-hidden text-ellipsis whitespace-nowrap"
                  disabled={!edit}
                  style={{ maxWidth: "80%" }}
                  value={
                    property.price.discountedPrice !== undefined
                      ? Number(property.price.discountedPrice).toLocaleString()
                      : calculatedPrices.discountedPrice.toLocaleString()
                  }
                  onChange={(e) => handleDiscountedPrice(e.target.value)}
                />
              </span>
            </div>

            <div className="mt-2 flex justify-center gap-2 items-center">
              <span className="bg-[#ECECEC] w-[30px] h-[30px] flex items-center justify-center rounded-full">
                <button
                  onClick={() =>
                    handleDiscountPercentage(
                      (property?.price?.discountPercentage || 0) + 1
                    )
                  }
                  className={`w-5 h-5 rounded-full ${
                    edit ? "bg-[#FAFAFA] text-xs" : "bg-gray-200 text-gray-400"
                  }`}
                  disabled={!edit}
                >
                  -
                </button>
              </span>

              <span className="text-xs text-[#808080] flex items-center gap-1">
                Discount by
                <input
                  className="w-8 outline-none text-center"
                  disabled={!edit}
                  style={{ color: edit ? "#121212" : "#808080" }}
                  value={property?.price?.discountPercentage || 0}
                  onChange={(e) =>
                    handleDiscountPercentage(Number(e.target.value))
                  }
                />
                %
              </span>

              <span className="bg-[#ECECEC] w-[30px] h-[30px] flex items-center justify-center rounded-full">
                <button
                  onClick={() =>
                    handleDiscountPercentage(
                      (property?.price?.discountPercentage || 0) - 1
                    )
                  }
                  className={`w-5 h-5 rounded-full ${
                    edit ? "bg-[#FAFAFA] text-xs" : "bg-gray-200 text-gray-400"
                  }`}
                  disabled={!edit}
                >
                  +
                </button>
              </span>
            </div>
          </div>

          <div className="bg-[#FAFAFA] border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-2xl p-2 w-full">
            <div className="bg-white rounded-2xl p-2">
              <h4 className="text-[#808080] text-xs">Boosted Price</h4>
              <span
                className="text-[#121212] flex gap-2 py-2 text-2xl"
                style={{ color: edit ? "#121212" : "#808080" }}
              >
                {currency}
                <input
                  className="outline-none w-fit bg-transparent overflow-hidden text-ellipsis whitespace-nowrap"
                  disabled={!edit}
                  style={{ maxWidth: "80%" }}
                  value={
                    property.price.boostedPrice !== undefined
                      ? Number(property.price.boostedPrice).toLocaleString()
                      : calculatedPrices.boostedPrice.toLocaleString()
                  }
                  onChange={(e) => handleBoostedPrice(e.target.value)}
                />
              </span>
            </div>

            <div className="mt-2 flex justify-center gap-2 items-center">
              <span className="bg-[#ECECEC] w-[30px] h-[30px] flex items-center justify-center rounded-full">
                <button
                  onClick={() =>
                    handleBoostPercentage(
                      (property?.price?.boostPercentage || 0) - 1
                    )
                  }
                  className={`w-5 h-5 rounded-full ${
                    edit ? "bg-[#FAFAFA] text-xs" : "bg-gray-200 text-gray-400"
                  }`}
                  disabled={!edit}
                >
                  -
                </button>
              </span>

              <span className="text-xs text-[#808080] flex items-center gap-1">
                Boost by
                <input
                  className="w-8 outline-none text-center"
                  disabled={!edit}
                  style={{ color: edit ? "#121212" : "#808080" }}
                  value={property?.price?.boostPercentage || 0}
                  onChange={(e) =>
                    handleBoostPercentage(Number(e.target.value))
                  }
                />
                %
              </span>

              <span className="bg-[#ECECEC] w-[30px] h-[30px] flex items-center justify-center rounded-full">
                <button
                  onClick={() =>
                    handleBoostPercentage(
                      (property?.price?.boostPercentage || 0) + 1
                    )
                  }
                  className={`w-5 h-5 rounded-full ${
                    edit ? "bg-[#FAFAFA] text-xs" : "bg-gray-200 text-gray-400"
                  }`}
                  disabled={!edit}
                >
                  +
                </button>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <h4 className="text-[#3A3A3A] text-sm font-medium">AirBnB Price</h4>
          <div
            onClick={() =>
              edit &&
              setModal(
                <AirBnbModal
                  setModal={setModal}
                  setRates={handleSetRates}
                  currentRates={rates}
                  id={property._id}
                />
              )
            }
            className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-md p-2 w-full cursor-pointer"
          >
            <span className={edit ? "text-black" : "text-[#808080]"}>
              {currentAirbnbRate !== undefined
                ? `$${currentAirbnbRate} (Click to edit)`
                : "Set AirBnB price (Click to set)"}
            </span>
          </div>
        </div>

        <PricingCalendar rates={rates} />
      </div>
    </div>
  );
}

export default Pricing;
