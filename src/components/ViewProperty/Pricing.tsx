import { useCallback } from "react";
import { useCurrency } from "../../helpers/getCurrency";

function Pricing({
  edit,
  property,
  setProperty,
}: {
  edit: boolean;
  property: any;
  setProperty: any;
}) {
  // Helper function to ensure number input is valid
  const parseNumberInput = useCallback((value: string) => {
    return value.replace(/[^0-9.]/g, ""); // Allow only numbers and a single decimal
  }, []);

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
      </div>
    </div>
  );
}

export default Pricing;
