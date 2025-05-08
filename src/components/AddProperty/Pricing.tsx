import { useEffect, useState } from "react";
import pricetag from "../../assets/pricetag.svg";
import { useCurrency } from "../../helpers/getCurrency";
import FeeSection, { PricePreview } from "../ViewProperty/FeeSection";

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
    cautionFee: 0,
    basePrice: 0,
  });
  const currency = useCurrency();

  useEffect(() => {
    setFormDetails({ ...formDetails, price: price });
  }, [price]);

  const [showPreview, setShowPreview] = useState(true);

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

          <FeeSection
            cautionFee={formDetails.price.cautionFee}
            setCautionFee={(val) =>
              setFormDetails({
                ...formDetails,
                price: { ...formDetails.price, cautionFee: val },
              })
            }
            edit={true}
          />
          {showPreview && (
            <PricePreview
              basePrice={formDetails.price.basePrice}
              cautionFee={formDetails.price.cautionFee || 0}
            />
          )}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="mt-2 text-[#3498db] underline text-sm"
          >
            {showPreview ? "Hide Price Preview" : "Show Price Preview"}
          </button>
        </div>
      )}
    </div>
  );
}

export default Pricing;
