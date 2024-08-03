import { useState } from "react";
import { ChevronDownIcon } from "../assets/icons";
import DashboardNav from "../components/DashboardNav";
import DashboardLayout from "../layouts/DashboardLayout";
import gridIcon from "../assets/grid-view.svg";
import line from "../assets/line.svg";
import menuIcon from "../assets/menu-01.svg";
import prop1 from "../assets/prop1.svg";
import prop2 from "../assets/prop2.svg";
import prop3 from "../assets/prop3.svg";
import prop4 from "../assets/prop4.svg";
import searchIcon from "../assets/search-01.svg";
import AddProperty from "../components/AddProperty";

function ListingManagement() {
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState("");
  const [grid, setGrid] = useState(false);

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

  return (
    <DashboardLayout>
      {
        {
          1: (
            <div>
              <DashboardNav
                title="Listing Management"
                description="Manage your bookings with ease."
              />

              <div className="flex flex-wrap gap-4 items-center justify-between w-full my-4 px-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center justify-center gap-2 bg-white border border-solid rounded-xl p-2 w-fit">
                    <select className="outline-none text-secondary text-xs md:text-sm font-light appearance-none border-none bg-transparent">
                      <option>All Locations</option>
                    </select>
                    <ChevronDownIcon width={12} />
                  </div>
                  <div className="flex items-center justify-center gap-2 bg-white border border-solid rounded-xl p-2 w-fit">
                    <select className="outline-none text-secondary text-xs md:text-sm font-light appearance-none border-none bg-transparent">
                      <option>Listed</option>
                    </select>
                    <ChevronDownIcon width={12} />
                  </div>
                </div>

                <div className="flex flex-wrap lg:flex-nowrap items-center gap-4">
                  <div className="w-fit flex gap-2 border border-solid border-[#E4E4E4] bg-[#F5F5F5] rounded-xl p-3">
                    <img src={searchIcon} className="w-5" />
                    <input
                      type="search"
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search"
                      className="outline-none text-secondary text-xs bg-transparent w-full"
                    />
                  </div>
                  <img src={line} />
                  <img src={menuIcon} className="cursor-pointer" />
                  <img src={line} />
                  <img
                    src={gridIcon}
                    className="cursor-pointer"
                    onClick={() => setGrid(!grid)}
                  />
                  <img src={line} />
                  <button
                    onClick={() => setStep(2)}
                    className="bg-primary p-2 rounded-xl text-white font-medium text-sm border border-primary shadow-inner shadow-black/20"
                  >
                    Add Property
                  </button>
                </div>
              </div>

              <div
                className={`grid gap-6 px-6 ${
                  grid ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"
                }`}
              >
                {properties
                  .filter(
                    (property) =>
                      property.name
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      property.location
                        .toLowerCase()
                        .includes(search.toLowerCase())
                  )
                  .map((property, index) => (
                    <div
                      key={index}
                      className="bg-[#FAFAFA] rounded-xl shadow-sm shadow-black/10 p-3 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className={`${grid && "flex gap-3 items-center"}`}>
                          <img
                            src={property.image}
                            alt="property"
                            className={`${
                              grid ? "w-28 h-16 hidden md:block" : "h-48 w-full"
                            } object-cover rounded-xl`}
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
                        <button
                          className={`${
                            !grid && "hidden"
                          } bg-[#E8E8FF] px-2.5 py-1.5 text-[#5856D6] font-semibold text-xs rounded-md`}
                        >
                          Delisted
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ),
          2: <AddProperty setStep={setStep} setData={() => {}} data={[]} />,
        }[step]
      }
    </DashboardLayout>
  );
}

export default ListingManagement;
