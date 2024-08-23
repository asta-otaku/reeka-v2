import buy from "../../assets/Buy.svg";
function Amenities({ facilityList }: { facilityList: any }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-[#121212] font-medium text-lg">Amenities</h3>
        <button className="text-[#808080] text-xs font-medium">Edit</button>
      </div>
      <div className="flex gap-2 my-4 flex-wrap">
        {Object.keys(facilityList).map((facility, index) => (
          <div
            key={index}
            className="bg-[#FAFAFA] text-[#808080] border flex items-center gap-1 p-2 rounded-lg text-xs"
          >
            <img src={buy} alt="buy" />
            <span>{facility}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Amenities;
