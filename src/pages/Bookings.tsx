import { ChevronDownIcon } from "../assets/icons";
import DashboardNav from "../components/DashboardNav";
import DashboardLayout from "../layouts/DashboardLayout";
import BookingTable from "../components/BookingTable";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import apiClient from "../helpers/apiClient";

function Bookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

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

  useEffect(() => {
    setCurrentPage(0);
  }, [search, selectedProperty, statusFilter]);

  useEffect(() => {
    apiClient
      .get(`/booking`)
      .then((response) => {
        setBookings(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Pagination logic
  const itemsPerPage = 15;
  const [currentPage, setCurrentPage] = useState(0);

  const filteredBookings = bookings
    .filter((booking: any) =>
      booking?.propertyDetails?.propertyName
        ?.toLowerCase()
        .includes(selectedProperty.toLowerCase())
    )
    .filter((booking: any) => {
      const query = search.toLowerCase();
      return (
        booking.guestFirstName?.toLowerCase().includes(query) ||
        booking.guestLastName?.toLowerCase().includes(query) ||
        booking.guestEmail?.toLowerCase().includes(query) ||
        booking.propertyDetails?.propertyName?.toLowerCase().includes(query)
      );
    })
    .filter((booking: any) =>
      statusFilter
        ? (booking.status || "").toLowerCase().trim() ===
          statusFilter.toLowerCase().trim()
        : true
    );

  // Calculate page count based on filtered bookings
  const pageCount = Math.ceil(filteredBookings.length / itemsPerPage);

  const handlePageChange = ({ selected }: { selected: any }) => {
    setCurrentPage(selected);
  };

  // Filter and slice the data for the current page
  const displayedData = filteredBookings.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <DashboardLayout>
      <div>
        <DashboardNav
          title="Bookings"
          description="Manage your bookings with ease."
        />

        <div className="flex flex-wrap gap-4 items-center justify-between w-full my-4 px-6">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center gap-2 bg-white border border-solid rounded-xl p-2 w-fit">
              <select
                onChange={(e) => setStatusFilter(e.target.value)}
                value={statusFilter}
                className="outline-none text-secondary text-xs md:text-sm font-light appearance-none border-none bg-transparent cursor-pointer pr-6"
              >
                <option value="">All Bookings</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
                <option value="Ongoing">Ongoing</option>
              </select>
              <div className="pointer-events-none absolute right-2">
                <ChevronDownIcon width={12} />
              </div>
            </div>
            <div className="relative flex items-center justify-center gap-2 bg-white border border-solid rounded-xl p-2 w-fit">
              <select
                onChange={(e) => {
                  setSelectedProperty(e.target.value);
                }}
                className="outline-none text-secondary text-xs md:text-sm font-light appearance-none border-none bg-transparent pr-5"
              >
                <option value="">All Properties</option>
                {properties.map((property) => (
                  <option key={property._id} value={property.propertyName}>
                    {property.propertyName}
                  </option>
                ))}
              </select>
              <ChevronDownIcon
                className="pointer-events-none absolute right-2"
                width={12}
              />
            </div>
          </div>
          <button
            onClick={() => navigate("/reservation")}
            className="bg-primary p-2 rounded-xl text-white font-medium text-sm border border-primary"
          >
            Create Reservation
          </button>
        </div>
        <div className="flex items-center gap-4 bg-white border border-solid rounded-xl p-3 ml-6 max-w-sm w-full">
          <input
            type="text"
            placeholder="Search bookings"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none bg-transparent text-xs md:text-sm text-secondary placeholder:text-gray-400 w-full"
          />
        </div>
        <div className="overflow-x-auto px-6 no-scrollbar mt-6">
          <BookingTable data={displayedData} />
        </div>
        <ReactPaginate
          previousLabel={""}
          nextLabel={""}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={2}
          onPageChange={handlePageChange}
          pageClassName="block border hover:bg-primary/80 hover:text-white border-primary rounded-lg p-1.5 cursor-pointer"
          containerClassName="flex justify-center items-center font-medium mt-12 gap-5"
          activeClassName="bg-primary border border-primary text-white"
        />
      </div>
    </DashboardLayout>
  );
}

export default Bookings;
