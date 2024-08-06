import pricetag from "../../assets/pricetag.svg";

function Pricing({
  handleChange,
  toggleSection,
  openSection,
}: {
  handleChange: any;
  toggleSection: any;
  openSection: any;
}) {
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
        <form
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col gap-2"
        >
          <div className="flex flex-col gap-2 w-full">
            <h4 className="text-[#3A3A3A] text-sm font-medium">Base Price</h4>
            <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-md p-2 w-full">
              <input
                name="basePrice"
                placeholder="$"
                className="w-full outline-none bg-transparent"
                onChange={handleChange}
              />
              <h4 className="text-[#808080]">/Night</h4>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 w-full">
              <h4 className="text-[#3A3A3A] text-sm font-medium">Min Price</h4>
              <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-md p-2 w-full">
                <input
                  name="minPrice"
                  placeholder="$"
                  className="w-full outline-none bg-transparent"
                  onChange={handleChange}
                />
                <h4 className="text-[#808080]">/Night</h4>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <h4 className="text-[#3A3A3A] text-sm font-medium">Max Price</h4>
              <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-md p-2 w-full">
                <input
                  name="maxPrice"
                  placeholder="$"
                  className="w-full outline-none bg-transparent"
                  onChange={handleChange}
                />
                <h4 className="text-[#808080]">/Night</h4>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default Pricing;
