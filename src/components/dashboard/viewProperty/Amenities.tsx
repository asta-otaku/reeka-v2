import buy from "@/assets/Buy.svg";
import AddNewFacility from "@/components/dashboard/addProperty/AddNewFacility";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";

function Amenities({
  edit,
  property,
  setProperty,
}: {
  edit: boolean;
  property: any;
  setProperty: any;
}) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (edit) {
      setOpen(true);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-[#121212] font-medium text-lg">Amenities</h3>
      </div>
      {Object.keys(property?.amenities).length > 0 ? (
        <div
          onClick={handleClick}
          className={`flex gap-2 my-4 flex-wrap ${
            edit ? "cursor-pointer" : "cursor-default"
          }`}
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
          onClick={handleClick}
          className={`flex gap-2 my-4 flex-wrap ${
            edit ? "cursor-pointer" : "cursor-default"
          }`}
        >
          <div className="bg-[#FAFAFA] text-[#808080] border flex items-center gap-1 p-2 rounded-lg text-xs">
            <img src={buy} alt="buy" />
            <span>Add New Facility</span>
          </div>
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full p-0">
          <AddNewFacility
            counterStates={property}
            setCounterStates={setProperty}
            setOpen={setOpen}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Amenities;
