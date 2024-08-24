import { useState } from "react";
import back from "../../assets/arrow-left-02.svg";

function AddNewFacility({
  counterStates,
  setCounterStates,
  setModal,
}: {
  counterStates: any;
  setCounterStates: any;
  setModal: any;
}) {
  const [facilityList] = useState<any>({
    ...counterStates.amenities,
    "Swimming Pool": 1,
    Griller: 1,
    Bathroom: 1,
    "Basket Court": 1,
    Gym: 1,
    Wifi: 1,
  });

  const [selectedFacility, setSelectedFacility] = useState<any>({});

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative bg-[#FAFAFA] max-w-xl w-full rounded-2xl p-4"
    >
      <div className="flex items-center gap-2">
        <button onClick={() => setModal(null)}>
          <img src={back} alt="back" />
        </button>
        <h2 className="font-medium text-[#3A3A3A] text-sm">Add Amenities</h2>
      </div>
      <p className="text-[#3A3A3A] text-[10px] mt-1">
        Type in the amenities you have or select from the options below
      </p>

      <div className="flex gap-2 my-4 flex-wrap">
        {Object.keys(facilityList).map((facility, index) => (
          <button
            key={index}
            onClick={() =>
              setSelectedFacility({
                ...selectedFacility,
                [facility]: 1,
              })
            }
            className={`${
              selectedFacility.hasOwnProperty(facility)
                ? "bg-[#219653] text-white"
                : "bg-[#FAFAFA] text-[#808080] border"
            } py-1 px-2 rounded-lg text-xs`}
          >
            {facility}
          </button>
        ))}
      </div>

      <div className="rounded-lg border px-4 py-3 h-28 w-full flex items-start flex-wrap gap-2">
        {Object.keys(selectedFacility).map((facility, index) => (
          <button
            key={index}
            onClick={() => {
              const updatedAmenities = { ...selectedFacility };
              delete updatedAmenities[facility];
              setSelectedFacility(updatedAmenities);
            }}
            className="bg-[#219653] text-white flex items-center gap-2 border py-1 px-2 rounded-lg text-xs"
          >
            {facility}
            <span>x</span>
          </button>
        ))}
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={() => {
            setCounterStates({
              ...counterStates,
              amenities: {
                ...selectedFacility,
              },
            });
            setModal(null);
          }}
          className="bg-[#C4C4C4] text-white rounded-lg text-sm font-semibold w-24 h-9"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default AddNewFacility;
