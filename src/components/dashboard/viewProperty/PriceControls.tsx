import useListPrice from "@/hooks/use-list-price";

function Pricing({
  edit,
  property,
  setProperty,
}: {
  edit: boolean;
  property: any;
  setProperty: any;
}) {
  const {
    currency,
    calculatedPrices,
    handleBasePrice,
    handleDiscountedPrice,
    handleBoostedPrice,
    handleDiscountPercentage,
    handleBoostPercentage,
    handleAirbnbPrice,
  } = useListPrice(edit, property, setProperty);

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
          <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-md p-2 w-full">
            <span className={`${edit ? "text-black " : "text-[#808080]"}`}>
              $
            </span>
            <input
              name="airbnbPrice"
              disabled={!edit}
              type="number"
              style={{ color: edit ? "#121212" : "#808080" }}
              onChange={(e) => handleAirbnbPrice(e.target.value)}
              value={property?.price?.airbnbPrice?.toLocaleString()}
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
