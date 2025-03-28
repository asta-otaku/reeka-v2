import { useEffect, useState } from "react";
import pricetag from "../../assets/pricetag.svg";
import { useCurrency } from "../../helpers/getCurrency";

function Pricing({
  toggleSection,
  openSection,
  formDetails,
  setFormDetails,
}: {
  toggleSection: any;
  openSection: any;
  formDetails: any;
  setFormDetails: any;
}) {
  const [price, setPrice] = useState({
    airbnbPrice: 0,
    basePrice: 0,
    discountPercentage: -25,
    boostPercentage: 25,
  });
  const currency = useCurrency();

  useEffect(() => {
    setFormDetails({ ...formDetails, price: price });
  }, [price]);

  const handleDiscountPercentage = (value: number) => {
    const clampedValue = Math.max(0, Math.min(100, value));
    setPrice({
      ...price,
      discountPercentage: -clampedValue,
    });
  };

  return (
    <div
      onClick={() => toggleSection("pricing")}
      className="rounded-xl bg-[#FAFAFA] border flex flex-col gap-4 cursor-pointer mx-2 p-4"
    >
      <div className="flex gap-2 items-center">
        <img src={pricetag} />
        <h3 className="text-[#0A2EE6] font-medium">Pricing</h3>
      </div>
      {openSection === "pricing" && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col gap-3"
        >
          <div className="flex flex-col gap-2 w-full">
            <h4 className="text-[#3A3A3A] text-sm font-medium">Base Price</h4>
            <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-md p-2 w-full">
              <span className="text-black">{currency}</span>
              <input
                name="basePrice"
                placeholder="0"
                onChange={(e) => {
                  const value = e.target.value.replace(/,/g, "");
                  if (!isNaN(Number(value))) {
                    setPrice({
                      ...price,
                      basePrice: Number(value),
                    });
                  }
                }}
                value={price?.basePrice.toLocaleString()}
                className="w-full outline-none bg-transparent"
              />
              <h4 className="text-[#808080]">/Night</h4>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-[#FAFAFA] border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-2xl p-2 w-full">
              <div className="bg-white rounded-2xl p-2">
                <h4 className="text-[#808080] text-xs">Discounted Price</h4>
                <span className="text-[#121212] flex gap-2 py-2 text-2xl">
                  {currency}
                  <input
                    className="outline-none w-fit bg-transparent"
                    value={(
                      price?.basePrice -
                      (Math.abs(price?.discountPercentage) / 100) *
                        price?.basePrice
                    ).toFixed(0)}
                    onChange={(e) => {
                      const newDiscountedPrice = Number(e.target.value);
                      if (newDiscountedPrice < 0) return;
                      if (newDiscountedPrice > price.basePrice) return;
                      // Ensure basePrice is not zero to avoid division by zero
                      const discountPercentage =
                        price.basePrice !== 0
                          ? ((price.basePrice - newDiscountedPrice) /
                              price.basePrice) *
                              100 || 0
                          : 0;

                      setPrice(() => ({
                        ...price,
                        discountPercentage: Number(
                          discountPercentage.toFixed(2)
                        ),
                      }));
                    }}
                  />
                </span>
              </div>

              <div className="mt-2 flex justify-center gap-2 items-center">
                <span className="bg-[#ECECEC] w-[30px] h-[30px] flex items-center justify-center rounded-full">
                  <button
                    onClick={() => {
                      if (!price) return;
                      const currentAbs = Math.abs(
                        price.discountPercentage || 0
                      );
                      if (currentAbs === 0) return;
                      handleDiscountPercentage(currentAbs - 1);
                    }}
                    className="w-5 h-5 rounded-full bg-[#FAFAFA] text-xs"
                  >
                    -
                  </button>
                </span>
                <span className="text-xs text-[#808080] flex items-center gap-1">
                  Discount by
                  <div className="flex items-center">
                    <span>-</span>
                    <input
                      className="w-8 outline-none text-center"
                      value={Math.abs(price?.discountPercentage || 0)}
                      onChange={(e: any) => {
                        const val = Number(e.target.value);
                        if (isNaN(val) || val > 100) return;
                        handleDiscountPercentage(val);
                      }}
                    />
                  </div>
                  %
                </span>

                <span className="bg-[#ECECEC] w-[30px] h-[30px] flex items-center justify-center rounded-full">
                  <button
                    onClick={() => {
                      if (!price) return;
                      const currentAbs = Math.abs(
                        price.discountPercentage || 0
                      );
                      if (currentAbs >= 100) return;
                      handleDiscountPercentage(currentAbs + 1);
                    }}
                    className="w-5 h-5 rounded-full bg-[#FAFAFA] text-xs"
                  >
                    +
                  </button>
                </span>
              </div>
            </div>

            <div className="bg-[#FAFAFA] border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-2xl p-2 w-full">
              <div className="bg-white rounded-2xl p-2">
                <h4 className="text-[#808080] text-xs">Boosted Price</h4>
                <span className="text-[#121212] flex gap-2 py-2 text-2xl">
                  {currency}
                  <input
                    className="outline-none w-fit bg-transparent"
                    value={(
                      price?.basePrice +
                      (price?.boostPercentage / 100) * price?.basePrice
                    ).toFixed(0)}
                    onChange={(e) => {
                      const newBoostedPrice = Number(e.target.value);
                      if (newBoostedPrice < 0) return;

                      const boostPercentage =
                        price.basePrice !== 0
                          ? ((newBoostedPrice - price.basePrice) /
                              price.basePrice) *
                              100 || 0
                          : 0;
                      setPrice(() => ({
                        ...price,
                        boostPercentage: Number(boostPercentage.toFixed(2)),
                      }));
                    }}
                  />
                </span>
              </div>

              <div className="mt-2 flex justify-center gap-2 items-center">
                <span className="bg-[#ECECEC] w-[30px] h-[30px] flex items-center justify-center rounded-full">
                  <button
                    onClick={() => {
                      setPrice(() => ({
                        ...price,
                        boostPercentage: Math.max(price.boostPercentage - 1, 0),
                      }));
                    }}
                    className="w-5 h-5 rounded-full bg-[#FAFAFA] text-xs"
                  >
                    -
                  </button>
                </span>

                <span className="text-xs text-[#808080] flex items-center gap-1">
                  Boost by
                  <input
                    className="w-8 outline-none text-center"
                    value={price?.boostPercentage || 0}
                    onChange={(e) => {
                      setPrice(() => ({
                        ...price,
                        boostPercentage: Number(e.target.value) || 0,
                      }));
                    }}
                  />
                  %
                </span>

                <span className="bg-[#ECECEC] w-[30px] h-[30px] flex items-center justify-center rounded-full">
                  <button
                    onClick={() => {
                      setPrice(() => ({
                        ...price,
                        boostPercentage: Math.min(
                          price.boostPercentage + 1,
                          100
                        ),
                      }));
                    }}
                    className="w-5 h-5 rounded-full bg-[#FAFAFA] text-xs"
                  >
                    +
                  </button>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <h4 className="text-[#3A3A3A] text-sm font-medium">AirBnB Price</h4>
            <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-md p-2 w-full">
              <span className="text-black">$</span>
              <input
                name="airbnbPrice"
                placeholder="0"
                onChange={(e) => {
                  const value = e.target.value.replace(/,/g, "");
                  if (!isNaN(Number(value))) {
                    setPrice({
                      ...price,
                      airbnbPrice: Number(value),
                    });
                  }
                }}
                value={price?.airbnbPrice.toLocaleString()}
                className="w-full outline-none bg-transparent"
              />
              <h4 className="text-[#808080]">/Night</h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pricing;
