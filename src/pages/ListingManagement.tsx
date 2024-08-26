import { useEffect, useState } from "react";
import { ChevronDownIcon } from "../assets/icons";
import DashboardNav from "../components/DashboardNav";
import DashboardLayout from "../layouts/DashboardLayout";
import gridIcon from "../assets/grid-view.svg";
import line from "../assets/line.svg";
import menuIcon from "../assets/menu-01.svg";
import searchIcon from "../assets/search-01.svg";
import AddProperty from "../components/AddProperty";
import { useNavigate } from "react-router-dom";
import { CONSTANT } from "../util";
import axios from "axios";

function ListingManagement() {
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState("");
  const [grid, setGrid] = useState(false);
  const [properties, setProperties] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(
          `${CONSTANT.BASE_URL}/properties/owner/${CONSTANT.USER_ID}`
        );
        setProperties(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProperties();
  }, []);

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
                  <img
                    src={menuIcon}
                    onClick={() => setGrid(true)}
                    className="cursor-pointer"
                  />
                  <img src={line} />
                  <img
                    src={gridIcon}
                    className="cursor-pointer"
                    onClick={() => setGrid(false)}
                  />
                  <img src={line} />
                  <button
                    onClick={() => setStep(2)}
                    className="bg-primary p-2 rounded-xl text-white font-medium text-sm border border-primary"
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
                    (property: any) =>
                      property.propertyName
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      property?.address
                        .toLowerCase()
                        .includes(search.toLowerCase())
                  )
                  .map((property: any, index) => (
                    <div
                      key={index}
                      onClick={() =>
                        navigate(`/listing/${index}`, {
                          state: { property },
                        })
                      }
                      className="bg-[#FAFAFA] rounded-xl shadow-sm shadow-black/10 p-3 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className={`${
                            grid && "flex gap-3 items-center"
                          } w-full`}
                        >
                          <img
                            src={property?.images[0]}
                            alt="property"
                            className={`${
                              grid ? "w-28 h-16 hidden md:block" : "h-48 w-full"
                            } object-cover rounded-xl`}
                          />
                          <div className="mt-2">
                            <h3 className="text-[#808080] font-medium text-xs">
                              {property?.propertyName}
                            </h3>
                            <p className="text-secondary text-[10px]">
                              {property?.address}
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
          2: <AddProperty setStep={setStep} />,
        }[step]
      }
    </DashboardLayout>
  );
}

export default ListingManagement;
