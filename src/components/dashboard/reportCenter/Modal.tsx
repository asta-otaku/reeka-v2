import Spinner from "@/components/Spinner";
import { Calendar, ChevronDownIcon } from "@/assets/icons";
import { useState } from "react";
import toast from "react-hot-toast";
import { useGetReport } from "@/lib/api/queries";

export function ReportModal({ properties }: any) {
  const [form, setForm] = useState({
    type: "bookings",
    property: "",
    from: "",
    to: "",
    format: "pdf",
  });

  const [reportDetails, setReportDetails] = useState<{
    url: string;
    title: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const { refetch } = useGetReport(
    reportDetails?.url || "",
    reportDetails?.title || ""
  );

  const handleDownload = (e: any) => {
    e.preventDefault();
    if (!properties.length) {
      toast.error("Please add a property before generating a report.");
      return;
    }

    if (!form.type) {
      toast.error("Please select a report type and ensure User ID is loaded.");
      return;
    }
    const url =
      form.type === "occupancy"
        ? `/report/occupancy/${form.format}?startDate=${form.from}&endDate=${form.to}&propertyName=${form.property}`
        : `/report/${form.format}?startDate=${form.from}&endDate=${form.to}&propertyName=${form.property}`;
    setLoading(true);
    setReportDetails({ url, title: form.property });
    setTimeout(() => {
      refetch();
      setLoading(false);
    }, 500);
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative bg-[#FAFAFA] rounded-2xl p-4"
    >
      <h2 className="text-secondary font-semibold text-lg">Report</h2>
      <form className="flex flex-col gap-2 mt-4">
        <div className="flex flex-col gap-2 w-full">
          <h4 className="text-[#3A3A3A] text-sm font-medium">Report Type*</h4>
          <div className="relative flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-md p-2 w-full">
            <select
              onChange={(e) => {
                setForm({ ...form, type: e.target.value });
              }}
              className="outline-none text-secondary text-xs md:text-sm w-full font-medium appearance-none border-none bg-transparent cursor-pointer pr-6"
            >
              <option value="bookings">Bookings</option>
              <option value="occupancy">Occupancy</option>
            </select>
            <div className="pointer-events-none absolute right-2">
              <ChevronDownIcon width={12} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <h4 className="text-[#3A3A3A] text-sm font-medium">Report Format*</h4>
          <div className="relative flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-md p-2 w-full">
            <select
              onChange={(e) => {
                setForm({ ...form, format: e.target.value });
              }}
              className="outline-none text-secondary text-xs md:text-sm w-full font-medium appearance-none border-none bg-transparent cursor-pointer pr-6"
            >
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
            </select>
            <div className="pointer-events-none absolute right-2">
              <ChevronDownIcon width={12} />
            </div>
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
          disabled={loading}
          onClick={handleDownload}
          className="bg-primary p-2 rounded-lg text-white mt-8 w-32 mx-auto font-semibold text-sm min-w-[120px]"
        >
          {loading ? <Spinner /> : "Generate"}
        </button>
      </form>
    </div>
  );
}
