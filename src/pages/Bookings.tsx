import { ChevronDownIcon } from "../assets/icons";
import DashboardNav from "../components/DashboardNav";
import DashboardLayout from "../layouts/DashboardLayout";
import BookingTable from "../components/BookingTable";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { CONSTANT } from "../util";
import ReactPaginate from "react-paginate";

// Dynamically retrieve userId from CONSTANT
const userId = CONSTANT.USER_ID;

function Bookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      if (userId) {
        // Ensure userId is present
        try {
          const response = await axios.get(
            `${CONSTANT.BASE_URL}/properties/owner/${userId}`
          );
          setProperties(response.data);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchProperties();
  }, [userId]);

  useEffect(() => {
    if (userId) {
      // Ensure userId is present before making the request
      axios
        .get(`${CONSTANT.BASE_URL}/booking/user/${userId}`)
        .then((response) => {
          setBookings(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [userId]);

  // Pagination logic
  const itemsPerPage = 15;
  const [currentPage, setCurrentPage] = useState(0);

  // Calculate page count based on filtered bookings
  const pageCount = Math.ceil(
    bookings.filter((booking: any) =>
      booking?.propertyId?.propertyName
        ?.toLowerCase()
        .includes(selectedProperty.toLowerCase())
    ).length / itemsPerPage
  );

  const handlePageChange = ({ selected }: { selected: any }) => {
    setCurrentPage(selected);
  };

  // Filter and slice the data for the current page
  const displayedData = bookings
    .filter((booking: any) =>
      booking?.propertyId?.propertyName
        ?.toLowerCase()
        .includes(selectedProperty.toLowerCase())
    )
    .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <DashboardLayout>
      <div>
        <DashboardNav
          title="Bookings"
          description="Manage your bookings with ease."
        />

        <div className="flex flex-wrap gap-4 items-center justify-between w-full my-4 px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center gap-2 bg-white border border-solid rounded-xl p-2 w-fit">
              <select className="outline-none text-secondary text-xs md:text-sm font-light appearance-none border-none bg-transparent">
                <option>All Bookings</option>
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
          <button
            onClick={() => navigate("/reservation")}
            className="bg-primary p-2 rounded-xl text-white font-medium text-sm border border-primary"
          >
            Create Reservation
          </button>
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
