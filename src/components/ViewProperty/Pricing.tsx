function Pricing({
  property,
  setProperty,
}: {
  property: any;
  setProperty: any;
}) {
  return (
    <div className="my-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[#121212] font-medium text-lg">Price</h3>
        <button className="text-[#808080] text-xs font-medium">Edit</button>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 w-full">
          <h4 className="text-[#3A3A3A] text-sm font-medium">Base Price</h4>
          <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-md p-2 w-full">
            <input
              name="basePrice"
              placeholder="$"
              onChange={(e) => {
                setProperty({
                  ...property,
                  price: {
                    ...property.price,
                    basePrice: Number(e.target.value),
                  },
                });
              }}
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
              <span className="text-[#121212] flex gap-2 py-2 text-2xl">
                $
                <input
                  className="outline-none w-fit bg-transparent"
                  value={(
                    property?.price?.basePrice -
                    (Math.abs(property?.price?.discountPercentage) / 100) *
                      property?.price?.basePrice
                  ).toFixed(0)}
                  onChange={(e) => {
                    const newDiscountedPrice = Number(e.target.value);
                    if (newDiscountedPrice < 0) return;
                    if (newDiscountedPrice > property.price.basePrice) return;
                    // Ensure basePrice is not zero to avoid division by zero
                    const discountPercentage =
                      property.price.basePrice !== 0
                        ? ((property.price.basePrice - newDiscountedPrice) /
                            property.price.basePrice) *
                            100 || 0
                        : 0;

                    setProperty((prev: any) => ({
                      ...prev,
                      price: {
                        ...prev.price,
                        discountPercentage: Number(
                          discountPercentage.toFixed(2)
                        ),
                      },
                    }));
                  }}
                />
              </span>
            </div>

            <div className="mt-2 flex justify-center gap-2 items-center">
              <span className="bg-[#ECECEC] w-[30px] h-[30px] flex items-center justify-center rounded-full">
                <button
                  onClick={() => {
                    if (property?.price?.discountPercentage == 0) return;
                    setProperty({
                      ...property,
                      price: {
                        ...property.price,
                        discountPercentage:
                          property.price.discountPercentage + 1,
                      },
                    });
                  }}
                  className="w-5 h-5 rounded-full bg-[#FAFAFA] text-xs"
                >
                  -
                </button>
              </span>

              <span className="text-xs text-[#808080] flex items-center gap-1">
                Discount by
                <input
                  className="w-8 outline-none text-center"
                  value={property?.price?.discountPercentage || 0}
                  onChange={(e: any) => {
                    if (e.target.value > 100) return;
                    setProperty({
                      ...property,
                      price: {
                        ...property.price,
                        discountPercentage: -Number(e.target.value) || 0,
                      },
                    });
                  }}
                />
                %
              </span>
              <span className="bg-[#ECECEC] w-[30px] h-[30px] flex items-center justify-center rounded-full">
                <button
                  onClick={() => {
                    if (property?.price?.discountPercentage > 100) return;
                    setProperty({
                      ...property,
                      price: {
                        ...property.price,
                        discountPercentage:
                          property.price.discountPercentage - 1,
                      },
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
              <span className="text-[#121212] flex gap-2 py-2 text-2xl">
                $
                <input
                  className="outline-none w-fit bg-transparent"
                  value={(
                    property?.price?.basePrice +
                    (property?.price?.boostPercentage / 100) *
                      property?.price?.basePrice
                  ).toFixed(0)}
                  onChange={(e) => {
                    const newBoostedPrice = Number(e.target.value);
                    if (newBoostedPrice < 0) return;
                    // Ensure basePrice is not zero to avoid division by zero
                    const boostPercentage =
                      property.price.basePrice !== 0
                        ? ((newBoostedPrice - property.price.basePrice) /
                            property.price.basePrice) *
                            100 || 0
                        : 0;
                    setProperty((prev: any) => ({
                      ...prev,
                      price: {
                        ...prev.price,
                        boostPercentage: Number(boostPercentage.toFixed(2)),
                      },
                    }));
                  }}
                />
              </span>
            </div>

            <div className="mt-2 flex justify-center gap-2 items-center">
              <span className="bg-[#ECECEC] w-[30px] h-[30px] flex items-center justify-center rounded-full">
                <button
                  onClick={() => {
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
                  className="w-5 h-5 rounded-full bg-[#FAFAFA] text-xs"
                >
                  -
                </button>
              </span>

              <span className="text-xs text-[#808080] flex items-center gap-1">
                Boost by
                <input
                  className="w-8 outline-none text-center"
                  value={property?.price?.boostPercentage || 0}
                  onChange={(e) => {
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
                  className="w-5 h-5 rounded-full bg-[#FAFAFA] text-xs"
                >
                  +
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
