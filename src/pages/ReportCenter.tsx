import { Calendar, ChevronDownIcon } from "../assets/icons";
import DashboardNav from "../components/DashboardNav";
import DashboardLayout from "../layouts/DashboardLayout";
import downloadIcon from "../assets/download-circle-01.svg";
import searchIcon from "../assets/search-01.svg";
import { useEffect, useState } from "react";
import useStore from "../store";
import axios from "axios";
import { CONSTANT } from "../util";
import toast, { Toaster } from "react-hot-toast";

function ReportCenter() {
  const [search, setSearch] = useState("");
  const setModal = useStore((state: any) => state.setModal);
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userID = CONSTANT.USER_ID || "";
        setUserId(userID);
      } catch (error) {
        console.error("Error fetching userId:", error);
      }
    };

    const fetchProperties = async () => {
      try {
        const response = await axios.get(
          `${CONSTANT.BASE_URL}/properties/owner/${userId}`
        );
        setProperties(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserId();
    fetchProperties();
  }, [userId]);

  const handleSingleDownload = (propertyName: string) => {
    if (!userId) {
      toast.error("User ID not available, please try again later.");
      return;
    }

    axios
      .get(
        `${CONSTANT.BASE_URL}/report/${userId}/pdf?startDate=&endDate=&propertyName=${propertyName}`,
        {
          responseType: "blob",
        }
      )
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${propertyName}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch(() => {
        toast.error("An error occurred while generating the report.");
      });
  };

  return (
    <DashboardLayout>
      <div className="px-4">
        <DashboardNav
          title="Report Management"
          description="Manage your bookings with ease."
        />

        <div className="flex flex-wrap gap-4 items-center justify-between w-full my-4 relative">
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
                <option value="">All Properties</option>
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
              onClick={() =>
                setModal(
                  <ReportModal properties={properties} userId={userId} />
                )
              }
              className="bg-primary p-2 rounded-xl text-white w-full md:w-fit md:absolute md:-top-20 z-10 right-6 font-medium text-sm border border-primary"
            >
              New Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {properties
            .filter((bk: any) =>
              bk?.propertyName
                ?.toLowerCase()
                .includes(selectedProperty.toLowerCase())
            )
            .filter((item) =>
              item?.propertyName?.toLowerCase().includes(search.toLowerCase())
            )
            .map((dt) => (
              <div key={dt._id} className="rounded-2xl border max-w-sm">
                <div className="p-4 bg-[#FAFAFA] rounded-t-[32px] relative w-full h-[70%] select-none">
                  <img
                    src={dt.images[0]}
                    alt="chart"
                    className="w-full h-40 rounded-xl"
                  />
                </div>
                <div className="border-t p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm truncate max-w-[200px]">
                      {dt.propertyName}
                    </p>
                    <p className="font-light text-[#808080] text-xs">
                      Created at{" "}
                      {new Date(dt.createdAt).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex gap-4 select-none">
                    <img
                      src={downloadIcon}
                      alt="download"
                      onClick={() => handleSingleDownload(dt.propertyName)}
                      className="cursor-pointer"
                    />
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

function ReportModal({ properties, userId }: any) {
  const [form, setForm] = useState({
    type: "",
    property: "",
    from: "",
    to: "",
  });

  const handleDownload = (e: any) => {
    e.preventDefault();

    if (!form.type || !userId) {
      toast.error("Please select a report type and ensure User ID is loaded.");
      return;
    }

    axios
      .get(
        `${CONSTANT.BASE_URL}/report/${userId}/${form.type}?startDate=${form.from}&endDate=${form.to}&propertyName=${form.property}`,
        {
          responseType: "blob",
        }
      )
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        const filename = `${form.property ? `${form.property}-` : "report"}${
          form.from
        }-to-${form.to}.${form.type}`;
        link.setAttribute("download", filename || `report.${form.type}`);
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => {
        toast.error("An error occurred while generating the report.");
      });
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative bg-[#FAFAFA] max-w-xl w-full rounded-2xl p-4"
    >
      <Toaster />
      <h2 className="text-secondary font-semibold text-lg">Report</h2>
      <form className="flex flex-col gap-2 mt-4">
        <div className="flex flex-col gap-2 w-full">
          <h4 className="text-[#3A3A3A] text-sm font-medium">Report Type*</h4>
          <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-md p-2 w-full">
            <select
              onChange={(e) => {
                setForm({ ...form, type: e.target.value });
              }}
              className="outline-none text-secondary text-xs md:text-sm w-full font-medium appearance-none border-none bg-transparent"
            >
              <option value="">Report Type</option>
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
            </select>
            <ChevronDownIcon width={16} />
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <h4 className="text-[#3A3A3A] text-sm font-medium">Property*</h4>
          <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-md p-2 w-full">
            <select
              onChange={(e) => {
                setForm({ ...form, property: e.target.value });
              }}
              className="outline-none text-secondary text-xs md:text-sm font-light appearance-none border-none bg-transparent w-full"
            >
              <option value="">All Properties</option>
              {properties.map((property: any) => (
                <option
                  key={property.propertyName}
                  value={property.propertyName}
                >
                  {property.propertyName}
                </option>
              ))}
            </select>
            <ChevronDownIcon width={12} />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2 w-full">
            <h4 className="text-[#3A3A3A] text-sm font-medium">From</h4>
            <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-lg p-2 w-full">
              <Calendar className="w-6" />
              <input
                type="date"
                onChange={(e) => setForm({ ...form, from: e.target.value })}
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
                onChange={(e) => setForm({ ...form, to: e.target.value })}
                className="w-full outline-none bg-transparent text-[#667085]"
              />
            </div>
          </div>
        </div>
        <button
          onClick={handleDownload}
          className="bg-primary p-2 rounded-lg text-white mt-8 w-32 mx-auto font-semibold text-sm"
        >
          Generate
        </button>
      </form>
    </div>
  );
}
