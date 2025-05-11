import useStore from "../store";
import moment from "moment";
import { useLocation } from "react-router-dom";
import BookingModal from "./BookingModal";

function BookingTable({
  data,
  statusFilter,
}: {
  data: any[];
  statusFilter?: string;
}) {
  const setModal = useStore((state: any) => state.setModal);
  const location = useLocation();
  const currentDate = moment.utc();

  function formatDate(date: string) {
    return moment.utc(date).format("MMM DD");
  }

  function formatTime(date: string) {
    return moment.utc(date).format("hh:mm A");
  }

  function getStatus(startDate: string, endDate: string) {
    const start = moment.utc(startDate);
    const end = moment.utc(endDate);

    if (currentDate.isAfter(end)) {
      return "Completed";
    } else if (currentDate.isBefore(start)) {
      return "Upcoming";
    } else {
      return "Ongoing";
    }
  }

  const filteredData = statusFilter
    ? data.filter(
        (item) => getStatus(item.startDate, item.endDate) === statusFilter
      )
    : data;

  const sortedData = filteredData.slice().sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  const isListing = location.pathname.includes("/listing");

  return (
    <div className="flex flex-col gap-6 overflow-x-auto no-scrollbar">
      {sortedData.length > 0 ? (
        sortedData.map((item, i) => (
          <div key={i}>
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
                className="min-w-full text-left text-xs border-collapse cursor-pointer bg-[#F2F2F2] rounded-xl shadow"
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
                            {formatTime(item?.startDate?.toString())}
                          </div>
                        </div>
                      </div>
                    </td>
                    {!isListing && (
                      <td className="px-4 py-4 whitespace-nowrap w-[160px]">
                        <div className="flex items-center gap-2">
                          <img
                            src={item?.propertyId?.images[0]}
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
                        style={{
                          color:
                            getStatus(item.startDate, item.endDate) ===
                            "Ongoing"
                              ? "#FFD700"
                              : getStatus(item.startDate, item.endDate) ===
                                "Completed"
                              ? "#34C759"
                              : "#007BFF",
                          backgroundColor:
                            getStatus(item.startDate, item.endDate) ===
                            "Ongoing"
                              ? "#FFFACD"
                              : getStatus(item.startDate, item.endDate) ===
                                "Completed"
                              ? "#DBFFE4"
                              : "#CCE5FF",
                        }}
                        className="text-xs p-1.5 rounded-lg font-medium w-full text-center"
                      >
                        <span>{getStatus(item.startDate, item.endDate)}</span>
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
                        {formatTime(item?.endDate?.toString())}
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
