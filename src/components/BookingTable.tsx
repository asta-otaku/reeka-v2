import useStore from "../store";
import moment from "moment";
import { useLocation } from "react-router-dom";
import BookingModal from "./BookingModal";

function BookingTable({ data }: { data: any[] }) {
  const setModal = useStore((state: any) => state.setModal);
  const location = useLocation();

  function formatDate(date: string) {
    return moment.utc(date).format("DD MMM, YYYY");
  }

  // Remove status filtering logic; assume data is already filtered by status
  const sortedData = data.slice().sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  const isListing = location.pathname.includes("/listing");

  // Helper for status color
  function getStatusColor(status: string) {
    if (status === "Ongoing")
      return { color: "#FFD700", backgroundColor: "#FFFACD" };
    if (status === "Completed")
      return { color: "#34C759", backgroundColor: "#DBFFE4" };
    return { color: "#007BFF", backgroundColor: "#CCE5FF" };
  }

  return (
    <div className="flex flex-col gap-6 overflow-x-auto no-scrollbar w-full min-w-0">
      {sortedData.length > 0 ? (
        sortedData.map((item, i) => (
          <div key={i} className="w-full min-w-0">
            <div className="">
              <table
                onClick={() =>
                  setModal(
                    <BookingModal
                      setModal={setModal}
                      booking={item}
                      currency={item.currency === "NGN" ? "₦" : "$"}
                    />
                  )
                }
                className="min-w-full w-full table-auto text-left text-xs border-collapse cursor-pointer bg-[#F2F2F2] rounded-xl shadow"
              >
                <thead className="text-[#BDBDBD] text-sm">
                  <tr className="capitalize">
                    <th
                      scope="col"
                      className="px-4 py-4 w-[120px] whitespace-nowrap font-bold"
                    >
                      Date
                    </th>
                    {!isListing && (
                      <th
                        scope="col"
                        className="px-4 py-4 w-[160px] whitespace-nowrap font-bold"
                      >
                        Apartment
                      </th>
                    )}
                    {!isListing && (
                      <th
                        scope="col"
                        className="px-4 py-4 w-[140px] whitespace-nowrap font-bold"
                      >
                        Name
                      </th>
                    )}
                    <th
                      scope="col"
                      className="px-4 py-4 w-[140px] whitespace-nowrap font-bold"
                    >
                      Amount Paid
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4 w-[100px] whitespace-nowrap font-bold"
                    >
                      Status
                    </th>
                    {!isListing && (
                      <th
                        scope="col"
                        className="px-4 py-4 w-[120px] whitespace-nowrap font-bold"
                      >
                        Guest
                      </th>
                    )}
                    <th
                      scope="col"
                      className="px-4 py-4 w-[150px] whitespace-nowrap font-bold"
                    >
                      Check-out Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr>
                    <td className="px-4 py-4 whitespace-nowrap w-[120px]">
                      <div className="flex items-center gap-2">
                        <div className="px-0.5 py-4 rounded-2xl bg-[#34C759]" />
                        <div>
                          <div className="text-sm text-[#121212] font-medium">
                            {formatDate(item?.startDate?.toString())}
                          </div>
                          <div className="text-[10px] text-[#808080] font-light">
                            2:00 PM
                          </div>
                        </div>
                      </div>
                    </td>
                    {!isListing && (
                      <td className="px-4 py-4 whitespace-nowrap w-[160px]">
                        <div className="flex items-center gap-2">
                          <img
                            src={item?.propertyDetails?.images[0]}
                            className="w-10 h-10 hidden lg:block"
                          />
                          <div>
                            <div className="text-sm text-[#121212] font-medium max-w-[100px] w-full truncate text-ellipsis">
                              {item?.propertyDetails?.propertyName}
                            </div>
                            <div className="text-[10px] text-[#808080] font-light max-w-[100px] w-full truncate text-ellipsis">
                              {item?.propertyDetails?.address}
                            </div>
                          </div>
                        </div>
                      </td>
                    )}
                    {!isListing && (
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-[#121212] font-medium max-w-[120px] w-full truncate text-ellipsis">
                          {item?.guestFirstName} {item?.guestLastName}
                        </div>
                      </td>
                    )}
                    <td className="px-4 py-4 whitespace-nowrap w-[140px]">
                      <div className="text-sm text-[#121212] max-w-[110px] w-full font-medium">
                        {item.currency === "NGN" ? "₦" : "$"}
                        {item?.totalBookingValue
                          ?.toFixed(2)
                          ?.toString()
                          ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </div>
                      <div className="text-[10px] text-[#808080] max-w-[110px] w-full font-light">
                        For {item?.nightsBooked} days
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap w-[100px]">
                      <div
                        style={getStatusColor(item.status)}
                        className="text-xs p-1.5 rounded-lg font-medium w-full text-center"
                      >
                        <span>{item.status}</span>
                      </div>
                    </td>
                    {!isListing && (
                      <td className="px-4 py-4 whitespace-nowrap w-[120px]">
                        <div className="text-sm text-[#121212] font-medium">
                          {item.numberOfGuests}
                        </div>
                        <div className="text-[10px] text-[#808080] font-light">
                          {item.numberOfChildren} Child
                        </div>
                      </td>
                    )}
                    <td className="px-4 py-4 whitespace-nowrap w-[150px]">
                      <div className="text-sm text-[#121212] font-medium">
                        {formatDate(item?.endDate?.toString())}
                      </div>
                      <div className="text-[10px] text-[#808080] font-light">
                        11:00 AM
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {i !== sortedData.length - 1 && (
              <div className="border-b border-gray-200 mt-5" key={i} />
            )}
          </div>
        ))
      ) : (
        <div className="text-center text-[#808080]">No bookings available</div>
      )}
    </div>
  );
}

export default BookingTable;
