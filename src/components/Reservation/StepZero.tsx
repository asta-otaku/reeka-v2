import { useState } from "react";
import prop1 from "../../assets/prop1.svg";
import prop2 from "../../assets/prop2.svg";
import prop3 from "../../assets/prop3.svg";
import prop4 from "../../assets/prop4.svg";
import searchIcon from "../../assets/search-01.svg";
import toast, { Toaster } from "react-hot-toast";

const properties = [
  {
    name: "Ama's Nest",
    location: "24 Drive, Lagos Island, Nigeria",
    image: prop1,
  },
  {
    name: "Ama's Nest",
    location: "24 Drive, Lagos Island, Nigeria",
    image: prop2,
  },
  {
    name: "Ama's Place",
    location: "24 Drive, Lagos Island, Nigeria",
    image: prop3,
  },
  {
    name: "Ama's Palace",
    location: "24 Drive, Lagos Island, Kenya",
    image: prop4,
  },
];

function StepZero({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [data] = useState<
    {
      name: string;
      location: string;
      image: string;
    }[]
  >(properties);

  const [search, setSearch] = useState<string>("");
  const [selectedApartment, setSelectedApartment] = useState<string | null>();

  return (
    <div className="flex flex-col gap-5 items-center w-full">
      <Toaster />
      <h3 className="text-xl font-medium text-center">Choose Apartment</h3>
      <div className="flex items-center gap-2 p-2 rounded-3xl bg-[#FAFAFA] w-4/5 lg:w-3/5">
        <img src={searchIcon} alt="search" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="w-full bg-transparent outline-none placeholder:text-xs placeholder:text-[#6D6D6D]"
        />
      </div>

      <div className="grid gap-6 px-6 grid-cols-1 lg:grid-cols-2">
        {data
          .filter(
            (property) =>
              property.name.toLowerCase().includes(search.toLowerCase()) ||
              property.location.toLowerCase().includes(search.toLowerCase())
          )
          .map((property, index) => (
            <div
              key={index}
              onClick={() => setSelectedApartment(index.toString())}
              className={`bg-[#FAFAFA] rounded-xl shadow-sm shadow-black/10 p-3 cursor-pointer ${
                selectedApartment === index.toString()
                  ? "border-2 border-primary"
                  : ""
              }`}
            >
              <div>
                <img
                  src={property.image}
                  alt="property"
                  className="h-48 w-full object-cover rounded-xl"
                />
                <div className="mt-2">
                  <h3 className="text-[#808080] font-medium text-xs">
                    {property.name}
                  </h3>
                  <p className="text-secondary text-[10px]">
                    {property.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="my-3 w-full flex justify-center">
        <button
          onClick={() => {
            if (selectedApartment) {
              setStep(1);
            } else {
              toast.error("Please select an apartment");
            }
          }}
          className="w-[160px] rounded-lg bg-primary text-white font-medium text-sm py-2"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default StepZero;
