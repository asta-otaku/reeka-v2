import { ChevronDownIcon } from "../assets/icons";
import DashboardNav from "../components/DashboardNav";
import DashboardLayout from "../layouts/DashboardLayout";
import downloadIcon from "../assets/download-circle-01.svg";
import searchIcon from "../assets/search-01.svg";
import { useEffect, useState } from "react";
import useStore from "../store";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import apiClient from "../helpers/apiClient";
import DatePicker from "react-datepicker";
import { format, parseISO } from "date-fns";
import Select from "react-select";

async function handleBlobError(error: any) {
  if (
    error.response &&
    error.response.data instanceof Blob &&
    error.response.data.type === "application/json"
  ) {
    try {
      const text = await error.response.data.text();
      const json = JSON.parse(text);
      return json.error || "An unexpected error occurred.";
    } catch {
      return "Failed to parse error response.";
    }
  }
  return "An error occurred while generating the report.";
}

function ReportCenter() {
  const [search, setSearch] = useState("");
  const setModal = useStore((state: any) => state.setModal);
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [reportFilter, _] = useState("bookings");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await apiClient.get(`/properties`);
        setProperties(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProperties();
  }, []);

  const handleSingleDownload = (propertyName: string) => {
    const url =
      reportFilter === "occupancy"
        ? `/report/occupancy/pdf?startDate=&endDate=&propertyName=${propertyName}`
        : `/report/pdf?startDate=&endDate=&propertyName=${propertyName}`;

    apiClient
      .get(url, {
        responseType: "blob",
      })
      .then((res) => {
        const downloadUrl = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", `${propertyName}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      })
      .catch(async (error) => {
        const message = await handleBlobError(error);
        toast.error(message);
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
            {/* <div className="relative flex items-center justify-center gap-2 bg-white border border-solid rounded-xl p-2 w-fit">
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
            </div> */}
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
            <button
              onClick={() => setModal(<ReportModal properties={properties} />)}
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

function ReportModal({ properties }: any) {
  const [loading, setLoading] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState<any[]>([]);
  const [form, setForm] = useState({
    type: "bookings",
    from: "",
    to: "",
    format: "pdf",
  });

  const propertyOptions = properties.map((property: any) => ({
    value: property._id,
    label: property.propertyName,
    property: property,
  }));

  const handleDownload = (e: any) => {
    e.preventDefault();

    if (!form.type) {
      toast.error("Please select a report type and ensure User ID is loaded.");
      return;
    }
    if (selectedProperties.length === 0) {
      toast.error("Please select at least one property");
      return;
    }
    setLoading(true);
    const propertyIds = selectedProperties.map((option) => option.value);

    const queryParams = new URLSearchParams({
      startDate: form.from,
      endDate: form.to,
    });

    propertyIds.forEach((id) => queryParams.append("propertyIds", id));
    const url =
      form.type === "occupancy"
        ? `/report/occupancy/${form.format}?${queryParams}`
        : `/report/${form.format}?${queryParams}`;

    apiClient
      .get(url, {
        responseType: "blob",
      })
      .then((res) => {
        setLoading(false);
        const downloadUrl = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = downloadUrl;

        const formattedFrom = form.from?.replace(/-/g, "") || "";
        const formattedTo = form.to?.replace(/-/g, "") || "";
        const datePart =
          formattedFrom && formattedTo
            ? `${formattedFrom}_to_${formattedTo}`
            : formattedFrom || formattedTo || "undated";

        const filename =
          selectedProperties.length === 1
            ? `${selectedProperties[0].label.replace(/\s+/g, "_")}_${
                form.type
              }_${datePart}.${form.format}`
            : `${selectedProperties.length}_properties_${form.type}_${datePart}.${form.format}`;

        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(link);
      })
      .catch(async (error) => {
        setLoading(false);
        const message = await handleBlobError(error);
        toast.error(message);
      });
  };

  const handlePropertyChange = (selectedOptions: any) => {
    setSelectedProperties(selectedOptions || []);
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative bg-[#FAFAFA] max-w-xl w-full rounded-2xl p-4"
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
          <h4 className="text-[#3A3A3A] text-sm font-medium">Properties*</h4>
          <Select
            isMulti
            value={selectedProperties}
            onChange={handlePropertyChange}
            options={propertyOptions}
            placeholder="Select properties..."
            className="react-select-container"
            classNamePrefix="react-select"
            styles={{
              control: (base) => ({
                ...base,
                border: "1px solid #D0D5DD",
                boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
                "&:hover": {
                  border: "1px solid #D0D5DD",
                },
                "&:focus-within": {
                  border: "1px solid #D0D5DD",
                  boxShadow: "0 0 0 3px rgba(16, 24, 40, 0.1)",
                },
              }),
              placeholder: (base) => ({
                ...base,
                color: "#667085",
                fontSize: "14px",
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: "rgba(var(--primary-rgb, 59, 130, 246), 0.1)",
                border: "1px solid rgba(var(--primary-rgb, 59, 130, 246), 1)",
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: "rgba(var(--primary-rgb, 59, 130, 246), 1)",
                fontWeight: "500",
              }),
              multiValueRemove: (base) => ({
                ...base,
                color: "rgba(var(--primary-rgb, 59, 130, 246), 1)",
                "&:hover": {
                  backgroundColor:
                    "rgba(var(--primary-rgb, 59, 130, 246), 0.2)",
                  color: "rgba(var(--primary-rgb, 59, 130, 246), 1)",
                },
              }),
            }}
          />
          <p className="text-xs text-gray-500 mt-1">
            {selectedProperties.length} property
            {selectedProperties.length !== 1 ? "s" : ""} selected
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* From Date */}
          <div className="flex flex-col gap-2 w-full">
            <h4 className="text-[#3A3A3A] text-sm font-medium">From</h4>
            <DatePicker
              selected={form.from ? parseISO(form.from) : null}
              onChange={(date: Date | null) =>
                setForm({
                  ...form,
                  from: date ? format(date, "yyyy-MM-dd") : "",
                })
              }
              placeholderText="From"
              dateFormat="dd/MM/yyyy"
              className="w-full text-[#667085] bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-lg p-2"
            />
          </div>

          {/* To Date */}
          <div className="flex flex-col gap-2 w-full">
            <h4 className="text-[#3A3A3A] text-sm font-medium">To</h4>
            <DatePicker
              selected={form.to ? parseISO(form.to) : null}
              onChange={(date: Date | null) =>
                setForm({
                  ...form,
                  to: date ? format(date, "yyyy-MM-dd") : "",
                })
              }
              minDate={form.from ? parseISO(form.from) : undefined}
              placeholderText="To"
              dateFormat="dd/MM/yyyy"
              className="w-full text-[#667085] bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-lg p-2"
            />
          </div>
        </div>

        <button
          disabled={loading}
          onClick={handleDownload}
          className="bg-primary p-2 rounded-lg text-white mt-8 w-32 mx-auto font-semibold text-sm"
        >
          {loading ? <Spinner /> : "Generate"}
        </button>
      </form>
    </div>
  );
}
