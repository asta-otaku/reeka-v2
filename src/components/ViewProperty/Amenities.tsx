import buy from "../../assets/Buy.svg";
import useStore from "../../store";
import AddNewFacility from "../AddProperty/AddNewFacility";

function Amenities({
  property,
  setProperty,
}: {
  property: any;
  setProperty: any;
}) {
  const setModal = useStore((state: any) => state.setModal);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-[#121212] font-medium text-lg">Amenities</h3>
        <button className="text-[#808080] text-xs font-medium">Edit</button>
      </div>
      {
        // check if property has amenities
        Object.keys(property?.amenities).length > 0 ? (
          <div
            onClick={() =>
              setModal(
                <AddNewFacility
                  counterStates={property}
                  setCounterStates={setProperty}
                  setModal={setModal}
                />
              )
            }
            className="flex gap-2 my-4 flex-wrap cursor-pointer"
          >
            {Object.keys(property?.amenities).map((facility, index) => (
              <div
                key={index}
                className="bg-[#FAFAFA] text-[#808080] border flex items-center gap-1 p-2 rounded-lg text-xs"
              >
                <img src={buy} alt="buy" />
                <span>{facility}</span>
              </div>
            ))}
          </div>
        ) : (
          <div
            onClick={() =>
              setModal(
                <AddNewFacility
                  counterStates={property}
                  setCounterStates={setProperty}
                  setModal={setModal}
                />
              )
            }
            className="flex gap-2 my-4 flex-wrap cursor-pointer"
          >
            <div className="bg-[#FAFAFA] text-[#808080] border flex items-center gap-1 p-2 rounded-lg text-xs">
              <img src={buy} alt="buy" />
              <span>Add New Facility</span>
            </div>
          </div>
        )
      }
    </div>
  );
}

export default Amenities;
