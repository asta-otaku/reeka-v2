import moment from "moment-timezone";
import { formatNumber, getStatus } from "@/lib/utils";
import { Bookings } from "@/lib/types";
import { useLocation } from "react-router-dom";

function BookingTableRow({
  booking,
  currency,
}: {
  booking: Bookings;
  currency: string;
}) {
  const location = useLocation();

  function formatDate(date: string) {
    return moment(date).tz("Africa/Lagos").format("MMM DD");
  }

  function formatTime(date: string) {
    return moment(date).tz("Africa/Lagos").format("hh:mm A");
  }

  return (
    <table className="min-w-full text-left text-xs border-collapse cursor-pointer bg-[#F2F2F2] rounded-xl shadow">
      <thead className="text-[#BDBDBD] text-sm">
        <tr className="capitalize">
          <th
            scope="col"
            className="px-4 py-4 w-[120px] whitespace-nowrap font-bold"
          >
            Date
          </th>
          <th
            scope="col"
            className="px-4 py-4 w-[160px] whitespace-nowrap font-bold"
          >
            Apartment
          </th>
          <th
            scope="col"
            className="px-4 py-4 w-[140px] whitespace-nowrap font-bold"
          >
            Name
          </th>
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
          <th
            scope="col"
            className="px-4 py-4 w-[120px] whitespace-nowrap font-bold"
          >
            Guest
          </th>
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
            <div className="flex bookings-center gap-2">
              <div className="px-0.5 py-4 rounded-2xl bg-[#34C759]" />
              <div>
                <div className="text-sm text-[#121212] font-medium">
                  {formatDate(booking.startDate.toString())}
                </div>
                <div className="text-[10px] text-[#808080] font-light">
                  {formatTime(booking.startDate.toString())}
                </div>
              </div>
            </div>
          </td>
          <td className="px-4 py-4 whitespace-nowrap w-[160px]">
            <div className="flex bookings-center gap-2">
              <img
                src={booking.propertyId.images[0]}
                className={`w-10 h-10 hidden lg:block ${
                  location.pathname.startsWith("/listing")
                    ? "hidden lg:hidden"
                    : "block"
                }`}
              />
              <div>
                <div className="text-sm text-[#121212] font-medium max-w-[100px] w-full truncate text-ellipsis">
                  {booking.propertyId.propertyName}
                </div>
                <div className="text-[10px] text-[#808080] font-light max-w-[100px] w-full truncate text-ellipsis">
                  {booking.propertyId.address}
                </div>
              </div>
            </div>
          </td>
          <td className="px-4 py-4 whitespace-nowrap">
            <div className="text-sm text-[#121212] font-medium max-w-[120px] w-full truncate text-ellipsis">
              {booking.guestFirstName} {booking.guestLastName}
            </div>
          </td>
          <td className="px-4 py-4 whitespace-nowrap w-[140px]">
            <div className="text-sm text-[#121212] max-w-[110px] w-full font-medium">
              {currency}
              {formatNumber(Number(booking.totalBookingValue.toFixed(2)))}
            </div>
            <div className="text-[10px] text-[#808080] max-w-[110px] w-full font-light">
              For {booking.nightsBooked} days
            </div>
          </td>
          <td className="px-4 py-4 whitespace-nowrap w-[100px]">
            <div
              style={{
                color:
                  getStatus(booking.startDate, booking.endDate) === "Ongoing"
                    ? "#FFD700"
                    : getStatus(booking.startDate, booking.endDate) ===
                      "Completed"
                    ? "#34C759"
                    : "#007BFF",
                backgroundColor:
                  getStatus(booking.startDate, booking.endDate) === "Ongoing"
                    ? "#FFFACD"
                    : getStatus(booking.startDate, booking.endDate) ===
                      "Completed"
                    ? "#DBFFE4"
                    : "#CCE5FF",
              }}
              className="text-xs p-1.5 rounded-lg font-medium w-full text-center"
            >
              <span>{getStatus(booking.startDate, booking.endDate)}</span>
            </div>
          </td>
          <td className="px-4 py-4 whitespace-nowrap w-[120px]">
            <div className="text-sm text-[#121212] font-medium">
              {booking.numberOfGuests}
            </div>
            <div className="text-[10px] text-[#808080] font-light">
              {booking.numberOfChildren} Child
            </div>
          </td>
          <td className="px-4 py-4 whitespace-nowrap w-[150px]">
            <div className="text-sm text-[#121212] font-medium">
              {formatDate(booking.endDate.toString())}
            </div>
            <div className="text-[10px] text-[#808080] font-light">
              {formatTime(booking.endDate.toString())}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default BookingTableRow;
