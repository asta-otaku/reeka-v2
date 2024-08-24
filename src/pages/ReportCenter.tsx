import { Calendar, ChevronDownIcon } from "../assets/icons";
import DashboardNav from "../components/DashboardNav";
import DashboardLayout from "../layouts/DashboardLayout";
import chart1 from "../assets/chart1.svg";
import chart2 from "../assets/chart2.svg";
import deleteIcon from "../assets/delete-01.svg";
import downloadIcon from "../assets/download-circle-01.svg";
import searchIcon from "../assets/search-01.svg";
import { useEffect, useState } from "react";
import useStore from "../store";
import axios from "axios";
import { CONSTANT } from "../util";

const data = [
  {
    id: 1,
    title: "Revenue Report:Allen House",
    date: "Created 21st February 2024",
    image: chart1,
  },
  {
    id: 2,
    title: "Booking Report:Ame's House",
    date: "Created 1st October, 2024",
    image: chart2,
  },
];

function ReportCenter() {
  const [search, setSearch] = useState("");
  const setModal = useStore((state: any) => state.setModal);
  const [properties, setProperties] = useState<any[]>([]);
  const [, setSelectedProperty] = useState("");

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
      <div>
        <DashboardNav
          title="Report Management"
          description="Manage your bookings with ease."
        />

        <div className="flex flex-wrap gap-4 items-center justify-between w-full my-4 px-6 relative">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center gap-2 bg-white border border-solid rounded-xl p-2 w-fit">
              <select className="outline-none text-secondary text-xs md:text-sm font-light appearance-none border-none bg-transparent">
                <option>All Reports</option>
              </select>
              <ChevronDownIcon width={12} />
            </div>
            <div className="flex items-center justify-center gap-2 bg-white border border-solid rounded-xl p-2 w-fit">
              <select
                onChange={(e) => {
                  setSelectedProperty(e.target.value);
                }}
                className="outline-none text-secondary text-xs md:text-sm font-light appearance-none border-none bg-transparent"
              >
                <option>All Properties</option>
                {properties.map((property) => (
                  <option key={property._id} value={property.propertyName}>
                    {property.propertyName}
                  </option>
                ))}
              </select>
              <ChevronDownIcon width={12} />
            </div>
          </div>
          <div className="flex items-center gap-4 max-w-sm w-full">
            <div className="w-full flex gap-2 border border-solid border-[#E4E4E4] bg-[#F5F5F5] rounded-xl p-3">
              <img src={searchIcon} className="w-5" />
              <input
                type="search"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="outline-none text-secondary text-xs bg-transparent w-full"
              />
            </div>
            <button
              onClick={() => setModal(<ReportModal />)}
              className="bg-primary p-2 rounded-xl text-white w-full md:w-fit md:absolute md:-top-20 z-10 right-6 font-medium text-sm border border-primary"
            >
              New Report
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 px-6">
          {data
            .filter((item) =>
              item.title.toLowerCase().includes(search.toLowerCase())
            )
            .map((dt) => (
              <div
                key={dt.id}
                className="rounded-2xl border w-full md:w-[320px] h-[280px]"
              >
                <div className="p-4 bg-[#FAFAFA] rounded-t-2xl relative w-full h-[70%] select-none">
                  <img src={dt.image} alt="chart" />
                  <img
                    src={dt.image}
                    alt="chart"
                    className="right-4 bottom-4 absolute"
                  />
                </div>
                <div className="border-t p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm truncate max-w-[200px]">
                      {dt.title}
                    </p>
                    <p className="font-light text-[#808080] text-xs">
                      {dt.date}
                    </p>
                  </div>
                  <div className="flex gap-4 select-none">
                    <img
                      src={downloadIcon}
                      alt="download"
                      className="cursor-pointer"
                    />
                    <img src={deleteIcon} className="w-4 cursor-pointer" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ReportCenter;

function ReportModal() {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative bg-[#FAFAFA] max-w-xl w-full rounded-2xl p-4"
    >
      <h2 className="text-secondary font-semibold text-lg">Report</h2>
      <form className="flex flex-col gap-2 mt-4">
        <div className="flex flex-col gap-2 w-full">
          <h4 className="text-[#3A3A3A] text-sm font-medium">Report Type*</h4>
          <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-md p-2 w-full">
            <select
              name="type"
              className="outline-none text-secondary text-xs md:text-sm w-full font-medium appearance-none border-none bg-transparent"
            >
              <option value="Apartment">Report Type</option>
            </select>
            <ChevronDownIcon width={16} />
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <h4 className="text-[#3A3A3A] text-sm font-medium">Property*</h4>
          <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-md p-2 w-full">
            <select
              name="type"
              className="outline-none text-secondary text-xs md:text-sm w-full font-medium appearance-none border-none bg-transparent"
            >
              <option value="Apartment">Property</option>
            </select>
            <ChevronDownIcon width={16} />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2 w-full">
            <h4 className="text-[#3A3A3A] text-sm font-medium">From</h4>
            <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-lg p-2 w-full">
              <Calendar className="w-6" />
              <input
                type="date"
                placeholder="Price per night"
                className="w-full outline-none bg-transparent text-[#667085]"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <h4 className="text-[#3A3A3A] text-sm font-medium">To</h4>
            <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-lg p-2 w-full">
              <Calendar className="w-6" />
              <input
                type="date"
                placeholder="Price per night"
                className="w-full outline-none bg-transparent text-[#667085]"
              />
            </div>
          </div>
        </div>
        <button className="bg-primary p-2 rounded-lg text-white mt-8 w-32 mx-auto font-semibold text-sm">
          Generate
        </button>
      </form>
    </div>
  );
}
