import { ChevronDownIcon } from "../assets/icons";
import DashboardNav from "../components/DashboardNav";
import DashboardLayout from "../layouts/DashboardLayout";
import BookingTable from "../components/BookingTable";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { CONSTANT } from "../util";
import ReactPaginate from "react-paginate";

// const data = [
//   {
//     date: "Dec 14",
//     time: "12:00 PM",
//     apartment: "Ama's Nest",
//     location: "25 Bello Drive, Lagos Island Nigeria",
//     name: "Olojo Ayomide",
//     amount: "$4000",
//     duration: "For 3 Nights",
//     status: "Ongoing",
//     guest: 2,
//     child: 1,
//   },
//   {
//     date: "Dec 14",
//     time: "12:00 PM",
//     apartment: "Ama's Nest",
//     location: "25 Bello Drive, Lagos Island Nigeria",
//     name: "Olojo Ayomide",
//     amount: "$4000",
//     duration: "For 3 Nights",
//     status: "Ongoing",
//     guest: 2,
//     child: 1,
//   },
//   {
//     date: "Dec 14",
//     time: "12:00 PM",
//     apartment: "Ama's Nest",
//     location: "25 Bello Drive, Lagos Island Nigeria",
//     name: "Olojo Ayomide",
//     amount: "$4000",
//     duration: "For 3 Nights",
//     status: "Completed",
//     guest: 2,
//     child: 1,
//   },
// ];

const userId = "0108ba0f-ff0e-44da-a819-aba575d5bddf";

function Bookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios
      .get(`${CONSTANT.BASE_URL}/booking/user/${userId}`)
      .then((response) => {
        setBookings(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  //pagination logic

  const itemsPerPage = 21;

  const [currentPage, setCurrentPage] = useState(0);

  const pageCount = Math.ceil(bookings.length / itemsPerPage);

  const handlePageChange = ({ selected }: { selected: any }) => {
    setCurrentPage(selected);
  };

  const displayedData = bookings.slice(
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
            <div className="flex items-center justify-center gap-2 bg-white border border-solid rounded-xl p-2 w-fit">
              <select className="outline-none text-secondary text-xs md:text-sm font-light appearance-none border-none bg-transparent">
                <option>All Bookings</option>
              </select>
              <ChevronDownIcon width={12} />
            </div>
            <div className="flex items-center justify-center gap-2 bg-white border border-solid rounded-xl p-2 w-fit">
              <select className="outline-none text-secondary text-xs md:text-sm font-light appearance-none border-none bg-transparent">
                <option>All Properties</option>
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
          <BookingTable data={displayedData} setData={setBookings} />
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
