import { ChevronDownIcon } from "@/assets/icons";
import DashboardNav from "@/components/DashboardNav";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import downloadIcon from "@/assets/download-circle-01.svg";
import searchIcon from "@/assets/search-01.svg";
import { useState } from "react";
import { ReportModal } from "./Modal";
import moment from "moment";
import { useGetProperties, useGetReport } from "@/lib/api/queries";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

function ReportCenter() {
  const [search, setSearch] = useState("");
  const { data: properties = [] } = useGetProperties();
  const [selectedProperty, setSelectedProperty] = useState("");
  const [reportFilter, setReportFilter] = useState("bookings");
  const [reportDetails, setReportDetails] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const { refetch } = useGetReport(
    reportDetails?.url || "",
    reportDetails?.title || ""
  );

  const handleSingleDownload = (propertyName: string) => {
    const url =
      reportFilter === "occupancy"
        ? `/report/occupancy/pdf?startDate=&endDate=&propertyName=${propertyName}`
        : `/report/pdf?startDate=&endDate=&propertyName=${propertyName}`;

    setReportDetails({ url, title: propertyName });
    setTimeout(() => refetch(), 500);
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
            <div className="relative flex items-center justify-center gap-2 bg-white border border-solid rounded-xl p-2 w-fit">
              <select
                onChange={(e) => {
                  setReportFilter(e.target.value);
                }}
                className="outline-none text-secondary text-xs md:text-sm font-light appearance-none border-none bg-transparent pr-6"
              >
                <option value="bookings">Bookings</option>
                <option value="occupancy">Occupancy</option>
              </select>
              <ChevronDownIcon
                className="absolute cursor-pointer pointer-events-none right-2"
                width={12}
              />
            </div>
            <div className="relative flex items-center justify-center gap-2 bg-white border border-solid rounded-xl p-2 w-fit">
              <select
                onChange={(e) => {
                  setSelectedProperty(e.target.value);
                }}
                className="outline-none text-secondary text-xs md:text-sm font-light appearance-none border-none bg-transparent pr-6"
              >
                <option value="">All Properties</option>
                {properties.map((property) => (
                  <option key={property._id} value={property.propertyName}>
                    {property.propertyName}
                  </option>
                ))}
              </select>
              <ChevronDownIcon
                className="absolute cursor-pointer pointer-events-none right-2"
                width={12}
              />
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
            <Dialog>
              <DialogTrigger asChild>
                <button className="bg-primary p-2 rounded-xl text-white w-full md:w-fit md:absolute md:-top-20 z-10 right-6 font-medium text-sm border border-primary">
                  New Report
                </button>
              </DialogTrigger>
              <DialogContent className="p-0 max-w-xl w-full">
                <ReportModal properties={properties} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {properties
            .filter((bk) =>
              bk.propertyName
                .toLowerCase()
                .includes(selectedProperty.toLowerCase())
            )
            .filter((item) =>
              item.propertyName.toLowerCase().includes(search.toLowerCase())
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
                      {moment(dt.createdAt).format("dddd, MMMM D, YYYY")}
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
