import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardNav from "../components/DashboardNav";
import searchIcon from "../assets/search-01.svg";
import Spinner from "../components/Spinner";
import { ChevronDownIcon } from "../assets/icons";
import apiClient from "../helpers/apiClient";
import useStore from "../store";
import IncidentCard from "../components/IncidentReport/Card";

export interface IncidentReport {
  _id: string;
  bookingId: string;
  propertyName: string;
  title: string;
  description: string;
  photos: string[];
  status: "open" | "closed" | "in-progress";
  createdAt: string;
  updatedAt: string;
  startDate: string;
  endDate: string;
  guestFirstName: string;
  guestEmail: string;
  guestPhone: string;
  nightsBooked: number;
}

export default function IncidentReportsPage() {
  const [loading, setLoading] = useState(true);
  const [incidentReports, setIncidentReports] = useState<IncidentReport[]>([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [search, setSearch] = useState("");
  const setModal = useStore((state: any) => state.setModal);

  useEffect(() => {
    const fetchIncidentReports = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/booking/incident-report");
        setIncidentReports(response.data);
      } catch (error) {
        console.error("Failed to fetch incident reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidentReports();
  }, []);

  // Get unique properties for filter dropdown
  const uniqueProperties = [
    ...new Set(incidentReports.map((report) => report.propertyName)),
  ];

  // Filter reports based on selected property and search term
  const filteredReports = incidentReports.filter((report) => {
    const matchesProperty = selectedProperty
      ? report.propertyName === selectedProperty
      : true;

    const matchesSearch = search
      ? report.title.toLowerCase().includes(search.toLowerCase()) ||
        report.description.toLowerCase().includes(search.toLowerCase()) ||
        report.guestFirstName.toLowerCase().includes(search.toLowerCase()) ||
        report.propertyName.toLowerCase().includes(search.toLowerCase())
      : true;

    return matchesProperty && matchesSearch;
  });

  return (
    <DashboardLayout>
      {/* Overlay Spinner when loading */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-25">
          <Spinner />
        </div>
      )}

      <div className="px-4 pb-12">
        <DashboardNav
          title="Incident Reports"
          description="Manage incident reports from your guests."
        />

        <div className="flex flex-wrap gap-4 items-center justify-between w-full my-4 relative">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center gap-2 bg-white border border-solid rounded-xl p-2 w-fit">
              <select
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="outline-none text-secondary text-xs md:text-sm font-light appearance-none border-none bg-transparent pr-6"
                value={selectedProperty}
              >
                <option value="">All Properties</option>
                {uniqueProperties.map((property) => (
                  <option key={property} value={property}>
                    {property}
                  </option>
                ))}
              </select>
              <ChevronDownIcon
                className="absolute cursor-pointer pointer-events-none right-2"
                width={12}
              />
            </div>

            <div className="relative flex items-center justify-center gap-2 bg-white border border-solid rounded-xl p-2 w-fit">
              <select className="outline-none text-secondary text-xs md:text-sm font-light appearance-none border-none bg-transparent pr-6">
                <option value="all">All Statuses</option>
                <option value="in-progress">Processing</option>
                <option value="closed">Completed</option>
              </select>
              <ChevronDownIcon
                className="absolute cursor-pointer pointer-events-none right-2"
                width={12}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 max-w-sm w-full">
            <div className="w-full flex gap-2 border border-solid border-[#E4E4E4] bg-[#F5F5F5] rounded-xl p-3">
              <img src={searchIcon} className="w-5" alt="Search" />
              <input
                type="search"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reports..."
                className="outline-none text-secondary text-xs bg-transparent w-full"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredReports.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500">No incident reports found</p>
            </div>
          ) : (
            filteredReports.map((report) => (
              <IncidentCard
                key={report._id}
                report={report}
                setModal={setModal}
              />
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
