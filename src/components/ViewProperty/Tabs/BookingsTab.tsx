import { useState } from "react";
import searchIcon from "../../../assets/search-01.svg";
import BookingTable from "../../BookingTable";
import ReactPaginate from "react-paginate";

function BookingsTab({ bookings }: { bookings: any }) {
  const [selected, setSelected] = useState(0);
  const [search, setSearch] = useState("");

  // Pagination
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(0);
  const pageCount = Math.ceil(bookings.length / itemsPerPage);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const displayedData = bookings
    .filter(
      (bk: any) =>
        bk?.properyName?.toLowerCase().includes(search.toLowerCase()) ||
        bk?.address?.toLowerCase().includes(search.toLowerCase()) ||
        bk?.guestFirstName?.toLowerCase().includes(search.toLowerCase()) ||
        bk?.guestLastName?.toLowerCase().includes(search.toLowerCase())
    )
    .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  const firstHalf = bookings.slice(0, Math.ceil(displayedData.length / 2));
  const secondHalf = bookings.slice(
    Math.ceil(displayedData.length / 2),
    displayedData.length
  );
  return (
    <div className="w-full max-w-[90%] mx-auto">
      <h3 className="text-[#121212] font-medium">Booking & Reservation</h3>
      <div className="rounded-2xl border shadow-xl shadow-gray-300 mt-4 mb-12 pb-8">
        <div className="border-b p-4 flex items-center gap-2">
          <img src={searchIcon} alt="search" />
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none bg-transparent text-[#808080] text-xs"
          />
        </div>
        <div className="flex items-center gap-6 w-full border-b border-0 my-4 px-4">
          <button
            onClick={() => setSelected(0)}
            className={`text-sm pb-2 ${
              selected === 0
                ? " text-primary border-b-2 border-primary"
                : "text-[#808080]"
            }`}
          >
            Booking
          </button>
        </div>
        <div className="px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-2.5 gap-y-4">
            <BookingTable data={firstHalf} />
            <BookingTable data={secondHalf} />
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
            containerClassName="flex justify-center items-center font-medium mt-8 gap-5"
            activeClassName="bg-primary border border-primary text-white"
          />
        </div>
      </div>
    </div>
  );
}

export default BookingsTab;
