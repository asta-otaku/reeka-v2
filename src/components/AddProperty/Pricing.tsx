import { useEffect, useState } from "react";
import pricetag from "../../assets/pricetag.svg";

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
    basePrice: 0,
    discountPercentage: 0,
    boostPercentage: 0,
  });

  useEffect(() => {
    setFormDetails({ ...formDetails, price: price });
  }, [price]);

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
          className="flex flex-col gap-2"
        >
          <div className="flex flex-col gap-2 w-full">
            <h4 className="text-[#3A3A3A] text-sm font-medium">Base Price</h4>
            <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-md p-2 w-full">
              <input
                name="basePrice"
                placeholder="$"
                value={price.basePrice}
                className="w-full outline-none bg-transparent"
                onChange={(e) =>
                  setPrice({ ...price, basePrice: Number(e.target.value) })
                }
              />
              <h4 className="text-[#808080]">/Night</h4>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-[#FAFAFA] border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-2xl p-2 w-full">
              <div className="bg-white rounded-2xl p-2">
                <h4 className="text-[#808080] text-xs">Discounted Price</h4>
                <p className="text-[#121212] mt-2 text-2xl">
                  $
                  {price.basePrice -
                    (price.discountPercentage / 100) * price.basePrice}
                </p>
              </div>

              <div className="mt-2 flex justify-center gap-2 items-center">
                <span className="bg-[#ECECEC] w-[30px] h-[30px] flex items-center justify-center rounded-full">
                  <button
                    onClick={() => {
                      if (price.discountPercentage == 0) return;
                      setPrice({
                        ...price,
                        discountPercentage: price.discountPercentage - 1,
                      });
                    }}
                    className="w-5 h-5 rounded-full bg-[#FAFAFA] text-xs"
                  >
                    -
                  </button>
                </span>

                <span className="text-xs text-[#808080]">
                  Discount by {price.discountPercentage}%
                </span>
                <span className="bg-[#ECECEC] w-[30px] h-[30px] flex items-center justify-center rounded-full">
                  <button
                    onClick={() => {
                      if (price.discountPercentage > 100) return;
                      setPrice({
                        ...price,
                        discountPercentage: price.discountPercentage + 1,
                      });
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
                <p className="text-[#121212] text-2xl">
                  $
                  {price.basePrice +
                    (price.boostPercentage / 100) * price.basePrice}
                </p>
              </div>

              <div className="mt-2 flex justify-center gap-2 items-center">
                <span className="bg-[#ECECEC] w-[30px] h-[30px] flex items-center justify-center rounded-full">
                  <button
                    onClick={() => {
                      if (price.boostPercentage == 0) return;
                      setPrice({
                        ...price,
                        boostPercentage: price.boostPercentage - 1,
                      });
                    }}
                    className="w-5 h-5 rounded-full bg-[#FAFAFA] text-xs"
                  >
                    -
                  </button>
                </span>

                <span className="text-xs text-[#808080]">
                  Increase by {price.boostPercentage}%
                </span>
                <span className="bg-[#ECECEC] w-[30px] h-[30px] flex items-center justify-center rounded-full">
                  <button
                    onClick={() => {
                      if (price.boostPercentage > 100) return;
                      setPrice({
                        ...price,
                        boostPercentage: price.boostPercentage + 1,
                      });
                    }}
                    className="w-5 h-5 rounded-full bg-[#FAFAFA] text-xs"
                  >
                    +
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pricing;
