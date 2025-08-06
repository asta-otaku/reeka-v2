import { ChevronDownIcon } from "../assets/icons";
import DashboardNav from "../components/DashboardNav";
import DashboardLayout from "../layouts/DashboardLayout";
import BookingTable from "../components/BookingTable";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import apiClient from "../helpers/apiClient";

// Define the booking type
interface Booking {
  _id: string;
  guestFirstName?: string;
  guestLastName?: string;
  guestEmail?: string;
  startDate: string;
  endDate: string;
  propertyDetails?: {
    propertyName?: string;
  };
  status?: string;
}

function Bookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
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
    .filter((booking) =>
      booking?.propertyDetails?.propertyName
        ?.toLowerCase()
        .includes(selectedProperty.toLowerCase())
    )
    .filter((booking) => {
      const query = search.toLowerCase();
      return (
        booking.guestFirstName?.toLowerCase().includes(query) ||
        booking.guestLastName?.toLowerCase().includes(query) ||
        booking.guestEmail?.toLowerCase().includes(query) ||
        booking.propertyDetails?.propertyName?.toLowerCase().includes(query)
      );
    })
    .filter((booking) => {
      if (!statusFilter) return true;

      return booking.status?.toLowerCase() === statusFilter.toLowerCase();
    });

  // Custom sorting: ongoing first, then recently completed, then upcoming, then other completed
  const sortedBookings = filteredBookings.slice().sort((a, b) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Helper function to get booking status
    const getBookingStatus = (booking: Booking) => {
      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);

      if (startDate <= now && endDate >= now) {
        return "ongoing";
      } else if (endDate < now) {
        // Check if completed today
        const endDateOnly = new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate()
        );
        if (endDateOnly.getTime() === today.getTime()) {
          return "recently-completed";
        } else {
          return "completed";
        }
      } else {
        return "upcoming";
      }
    };

    const statusA = getBookingStatus(a);
    const statusB = getBookingStatus(b);

    // Define priority order
    const priority = {
      ongoing: 1,
      "recently-completed": 2,
      upcoming: 3,
      completed: 4,
    };

    // First sort by status priority
    if (priority[statusA] !== priority[statusB]) {
      return priority[statusA] - priority[statusB];
    }

    // Within the same status, sort by date
    if (statusA === "upcoming") {
      // For upcoming, sort by start date (earliest first)
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    } else if (statusA === "completed" || statusA === "recently-completed") {
      // For completed, sort by end date (most recent first)
      return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
    } else {
      // For ongoing, sort by start date (earliest first)
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    }
  });

  // Calculate page count based on filtered bookings
  const pageCount = Math.ceil(sortedBookings.length / itemsPerPage);

  const handlePageChange = ({ selected }: { selected: any }) => {
    setCurrentPage(selected);
  };

  // Filter and slice the data for the current page
  const displayedData = sortedBookings.slice(
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
