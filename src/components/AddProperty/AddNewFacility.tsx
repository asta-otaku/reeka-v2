import { useState, useEffect } from "react";
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
    "Swimming Pool": 1,
    Griller: 1,
    "Basket Court": 1,
    Gym: 1,
    Wifi: 1,
    ...counterStates.amenities,
  });

  const [selectedFacility, setSelectedFacility] = useState<any>({});
  const [newFacility, setNewFacility] = useState("");
  const [newFacilityQuantity, setNewFacilityQuantity] = useState(1);
  const [bedroomCount, setBedroomCount] = useState(
    counterStates.bedroomCount || 0
  );
  const [bathroomCount, setBathroomCount] = useState(
    counterStates.bathroomCount || 0
  );

  // Initialize selectedFacility with the amenities from counterStates
  useEffect(() => {
    setSelectedFacility(counterStates.amenities || {});
    setBedroomCount(counterStates.bedroomCount || 0);
    setBathroomCount(counterStates.bathroomCount || 0);
  }, [
    counterStates.amenities,
    counterStates.bedroomCount,
    counterStates.bathroomCount,
  ]);

  // Handle adding new facility
  const handleAddNewFacility = () => {
    if (newFacility && !selectedFacility.hasOwnProperty(newFacility)) {
      setSelectedFacility({
        ...selectedFacility,
        [newFacility]: newFacilityQuantity,
      });
      setNewFacility("");
      setNewFacilityQuantity(1);
    }
  };

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

      {/* Bedroom and Bathroom Count Section */}
      <div className="flex gap-4 my-4">
        <div className="flex-1">
          <label className="text-xs text-[#3A3A3A] mb-1 block">Bedrooms</label>
          <input
            type="number"
            min={0}
            value={bedroomCount === 0 ? "" : bedroomCount}
            onChange={(e) => setBedroomCount(Number(e.target.value) || 0)}
            className="w-full border rounded-lg p-2 text-xs"
            placeholder="Number of bedrooms"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-[#3A3A3A] mb-1 block">Bathrooms</label>
          <input
            type="number"
            min={0}
            value={bathroomCount === 0 ? "" : bathroomCount}
            onChange={(e) => setBathroomCount(Number(e.target.value) || 0)}
            className="w-full border rounded-lg p-2 text-xs"
            placeholder="Number of bathrooms"
          />
        </div>
      </div>

      <div title="list properties" className="flex gap-2 my-4 flex-wrap">
        {Object.keys(facilityList).map((facility, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedFacility({
                ...selectedFacility,
                [facility]: selectedFacility[facility]
                  ? selectedFacility[facility] + 1
                  : 1,
              });
            }}
            className={`$${
              selectedFacility.hasOwnProperty(facility)
                ? "bg-[#219653] text-white"
                : "bg-[#FAFAFA] text-[#808080] border"
            } py-1 px-2 rounded-lg text-xs`}
          >
            {facility}
          </button>
        ))}
      </div>

      <div
        title="selected amenities"
        className="rounded-lg border px-4 py-3 h-28 w-full flex items-start flex-wrap gap-2"
      >
        {Object.keys(selectedFacility).map((facility, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-[#219653] text-white border py-1 px-2 rounded-lg text-xs"
          >
            <span>{facility}</span>
            <input
              type="number"
              min={1}
              value={
                selectedFacility[facility] === 0
                  ? ""
                  : selectedFacility[facility]
              }
              onChange={(e) => {
                const updatedAmenities = {
                  ...selectedFacility,
                  [facility]: Number(e.target.value),
                };
                setSelectedFacility(updatedAmenities);
              }}
              className="w-12 text-black rounded px-1"
              style={{ background: "#fff" }}
            />
            <button
              onClick={() => {
                const updatedAmenities = { ...selectedFacility };
                delete updatedAmenities[facility];
                setSelectedFacility(updatedAmenities);
              }}
              className="ml-1"
              style={{ color: "#fff" }}
            >
              x
            </button>
          </div>
        ))}
      </div>

      <div
        title="add new facility"
        className="rounded-lg border px-4 py-3 mt-4 w-full flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="Add a new facility"
          value={newFacility}
          onChange={(e) => setNewFacility(e.target.value)}
          className="border rounded-lg p-2 text-xs w-full"
        />
        <input
          type="number"
          min={1}
          value={newFacilityQuantity === 0 ? "" : newFacilityQuantity}
          onChange={(e) => setNewFacilityQuantity(Number(e.target.value))}
          className="border rounded-lg p-2 text-xs w-20 mt-2"
        />
        <button
          onClick={handleAddNewFacility}
          className="bg-[#219653] text-white rounded-lg text-sm font-semibold w-full h-9"
        >
          Add New Facility
        </button>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={() => {
            setCounterStates({
              ...counterStates,
              bedroomCount: bedroomCount,
              bathroomCount: bathroomCount,
              amenities: {
                ...selectedFacility,
              },
            });
            setModal(null);
          }}
          className="bg-[#219653] text-white rounded-lg text-sm font-semibold w-24 h-9"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default AddNewFacility;
