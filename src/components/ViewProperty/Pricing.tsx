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
  const parseNumberInput = (value: string) => {
    return Number(value.replace(/[^0-9]/g, ""));
  };

  // Handler for base price
  const handleBasePrice = (value: string) => {
    const numericValue = parseNumberInput(value);
    setProperty({
      ...property,
      price: {
        ...property.price,
        basePrice: numericValue,
      },
    });
  };

  // Handler for discounted price
  const handleDiscountedPrice = (value: string) => {
    const numericValue = parseNumberInput(value);

    // Ensure discounted price is not higher than base price
    if (numericValue > property.price.basePrice) return;

    const discountPercentage =
      property.price.basePrice > 0
        ? ((property.price.basePrice - numericValue) /
            property.price.basePrice) *
          100
        : 0;

    setProperty((prev: any) => ({
      ...prev,
      price: {
        ...prev.price,
        discountPercentage: -Number(discountPercentage.toFixed(2)),
      },
    }));
  };

  // Handler for boosted price
  const handleBoostedPrice = (value: string) => {
    const numericValue = parseNumberInput(value);

    const boostPercentage =
      property.price.basePrice > 0
        ? ((numericValue - property.price.basePrice) /
            property.price.basePrice) *
          100
        : 0;

    setProperty((prev: any) => ({
      ...prev,
      price: {
        ...prev.price,
        boostPercentage: Number(boostPercentage.toFixed(2)),
      },
    }));
  };

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
              ₦
            </span>
            <input
              name="basePrice"
              disabled={!edit}
              style={{ color: edit ? "#121212" : "#808080" }}
              onChange={(e) => handleBasePrice(e.target.value)}
              value={property?.price?.basePrice?.toLocaleString()}
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
                ₦
                <input
                  className="outline-none w-fit bg-transparent overflow-hidden text-ellipsis whitespace-nowrap"
                  disabled={!edit}
                  style={{ maxWidth: "90%" }}
                  value={(
                    property.price.basePrice -
                    (Math.abs(property?.price?.discountPercentage) / 100) *
                      property.price.basePrice
                  )
                    .toFixed(0)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  onChange={(e) => handleDiscountedPrice(e.target.value)}
                />
              </span>
            </div>

            <div className="mt-2 flex justify-center gap-2 items-center">
              <span className="bg-[#ECECEC] w-[30px] h-[30px] flex items-center justify-center rounded-full">
                <button
                  onClick={() => {
                    if (!edit) return;
                    if (property?.price?.discountPercentage === 0) return;
                    setProperty({
                      ...property,
                      price: {
                        ...property.price,
                        discountPercentage:
                          property.price.discountPercentage + 1,
                      },
                    });
                  }}
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
                  onChange={(e: any) => {
                    if (!edit) return;
                    let value = Number(e.target.value);
                    if (value > 0) value = -value;
                    if (value < -100) return;
                    setProperty({
                      ...property,
                      price: {
                        ...property.price,
                        discountPercentage: value || 0,
                      },
                    });
                  }}
                />
                %
              </span>
              <span className="bg-[#ECECEC] w-[30px] h-[30px] flex items-center justify-center rounded-full">
                <button
                  onClick={() => {
                    if (!edit) return;
                    if (property?.price?.discountPercentage <= -100) return;
                    setProperty({
                      ...property,
                      price: {
                        ...property.price,
                        discountPercentage:
                          property.price.discountPercentage - 1,
                      },
                    });
                  }}
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
                ₦
                <input
                  className="outline-none w-fit bg-transparent overflow-hidden text-ellipsis whitespace-nowrap"
                  disabled={!edit}
                  style={{ maxWidth: "90%" }}
                  value={(
                    property.price.basePrice +
                    (property?.price?.boostPercentage / 100) *
                      property.price.basePrice
                  )
                    .toFixed(0)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  onChange={(e) => handleBoostedPrice(e.target.value)}
                />
              </span>
            </div>

            <div className="mt-2 flex justify-center gap-2 items-center">
              <span className="bg-[#ECECEC] w-[30px] h-[30px] flex items-center justify-center rounded-full">
                <button
                  onClick={() => {
                    if (!edit) return;
                    setProperty((prev: any) => ({
                      ...prev,
                      price: {
                        ...prev.price,
                        boostPercentage: Math.max(
                          prev.price.boostPercentage - 1,
                          0
                        ),
                      },
                    }));
                  }}
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
                  onChange={(e) => {
                    if (!edit) return;
                    setProperty((prev: any) => ({
                      ...prev,
                      price: {
                        ...prev.price,
                        boostPercentage: Number(e.target.value) || 0,
                      },
                    }));
                  }}
                />
                %
              </span>

              <span className="bg-[#ECECEC] w-[30px] h-[30px] flex items-center justify-center rounded-full">
                <button
                  onClick={() => {
                    if (!edit) return;
                    setProperty((prev: any) => ({
                      ...prev,
                      price: {
                        ...prev.price,
                        boostPercentage: Math.min(
                          prev.price.boostPercentage + 1,
                          100
                        ),
                      },
                    }));
                  }}
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
              style={{ color: edit ? "#121212" : "#808080" }}
              onChange={(e) => {
                const value = e.target.value.replace(/,/g, "");
                if (!isNaN(Number(value))) {
                  setProperty({
                    ...property,
                    price: {
                      ...property.price,
                      airbnbPrice: Number(value),
                    },
                  });
                }
              }}
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
