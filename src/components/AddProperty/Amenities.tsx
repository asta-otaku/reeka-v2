import { useEffect, useState } from "react";
import CounterRender from "./CounterRender";
import amenity from "../.././assets/amenity.svg";
import plusIcon from "../../assets/add-circle.svg";
import AddNewFacility from "./AddNewFacility";

function Amenities({
  toggleSection,
  openSection,
  setModal,
  formDetails,
  setFormDetails,
}: {
  toggleSection: any;
  openSection: any;
  setModal: any;
  formDetails: any;
  setFormDetails: any;
}) {
  const [counterStates, setCounterStates] = useState<any>({
    rooms: {
      bedroom: formDetails?.bedroomCount || 1,
      bathroom: formDetails?.bathroomCount || 1,
    },

    amenities: {
      // "Swimming Pool": 1,
      // "Basket Court": 1,
    },
  });

  useEffect(() => {
    setFormDetails({
      ...formDetails,
      amenities: {
        ...counterStates?.amenities,
      },
      bathroomCount: counterStates?.rooms?.bathroom || 0,
      bedroomCount: counterStates?.rooms?.bedroom || 0,
    });
  }, [counterStates]);

  return (
    <div
      onClick={() => toggleSection("amenities")}
      className="rounded-xl bg-[#FAFAFA] border flex flex-col gap-4 cursor-pointer mx-2 p-4"
    >
      <div className="flex gap-2 items-center">
        <img src={amenity} />
        <h3 className="text-[#219653] font-medium">Rooms and Amenities</h3>
      </div>
      {openSection === "amenities" && (
        <div onClick={(e) => e.stopPropagation()}>
          <div className="py-4">
            <h3 className="text-[#3A3A3A] font-medium text-sm">
              BedRoom and Bath
            </h3>
            <p className="text-[#808080] text-[10px]">
              Type in the amenities you have or select from the options below
            </p>
            <div className="flex flex-col gap-2 mt-4">
              <CounterRender
                counterStates={counterStates}
                setCounterStates={setCounterStates}
                tag="bedroom"
                title="Bedroom"
                cat="rooms"
              />
              <CounterRender
                counterStates={counterStates}
                setCounterStates={setCounterStates}
                tag="bathroom"
                title="Bathroom"
                cat="rooms"
              />
            </div>
          </div>
          <hr />
          <div className="py-4">
            <h3 className="text-[#3A3A3A] font-medium text-sm">Amenities</h3>
            <p className="text-[#808080] text-[10px]">Select or add</p>
            <div className="mt-4 flex flex-col gap-2">
              {Object.keys(counterStates.amenities).length > 0 ? (
                Object.keys(counterStates.amenities).map((amenity, index) => (
                  <CounterRender
                    counterStates={counterStates}
                    setCounterStates={setCounterStates}
                    tag={amenity}
                    title={amenity}
                    cat="amenities"
                    key={index}
                  />
                ))
              ) : (
                <p className="text-[#808080] text-[10px]">
                  No amenities selected
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() =>
              setModal(
                <AddNewFacility
                  counterStates={counterStates}
                  setCounterStates={setCounterStates}
                  setModal={setModal}
                />
              )
            }
            className="my-2 flex items-center gap-2 text-[#219653] text-[10px]"
          >
            <img src={plusIcon} />
            Add new facility/Equipment
          </button>
        </div>
      )}
    </div>
  );
}

export default Amenities;
