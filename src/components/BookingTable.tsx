import useStore from "../store";
import graycancel from "../assets/graycancel.svg";
import redcancel from "../assets/cancel-red.svg";
import { CONSTANT } from "../util";
import axios from "axios";
import moment from "moment-timezone";
import { useLocation } from "react-router-dom";

function BookingTable({ data }: { data: any[] }) {
  const setModal = useStore((state: any) => state.setModal);
  const location = useLocation();

  function formatDate(date: string) {
    return moment(date).tz("Africa/Lagos").format("MMM DD");
  }

  function formatTime(date: string) {
    return moment(date).tz("Africa/Lagos").format("hh:mm A");
  }

  return (
    <div className="flex flex-col gap-6 overflow-x-auto no-scrollbar">
      {data.length > 0 ? (
        data.map((item, i) => (
          <div key={i}>
            <div className="">
              <table
                onClick={() =>
                  setModal(<Modal setModal={setModal} booking={item} />)
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
                    <th
                      scope="col"
                      className="px-4 py-4 w-[160px] whitespace-nowrap font-bold"
                    >
                      Apartment
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4 w-[120px] whitespace-nowrap font-bold"
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
                    <td className="px-4 py-4 whitespace-nowrap w-[160px]">
                      <div className="flex items-center gap-2">
                        <img
                          src={item?.propertyId?.images[0]}
                          className={`w-10 h-10 ${
                            location.pathname.startsWith("/listing")
                              ? "hidden"
                              : ""
                          }`}
                        />
                        <div>
                          <div className="text-sm text-[#121212] font-medium max-w-[150px] truncate text-ellipsis">
                            {item?.propertyId?.propertyName}
                          </div>
                          <div className="text-[10px] text-[#808080] font-light max-w-[150px] truncate text-ellipsis">
                            {item?.propertyId?.address}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap w-[120px]">
                      <div className="text-sm text-[#121212] font-medium max-w-[110px] truncate text-ellipsis">
                        {item?.guestFirstName} {item?.guestLastName}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap w-[140px]">
                      <div className="text-sm text-[#121212] font-medium">
                        ₦
                        {item?.totalBookingValue
                          ?.toString()
                          ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </div>
                      <div className="text-[10px] text-[#808080] font-light">
                        For {item?.nightsBooked} days
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap w-[100px]">
                      <div
                        style={{
                          color:
                            item.status === "Ongoing" ? "#34C759" : "#007AFF",
                          backgroundColor:
                            item.status === "Ongoing" ? "#DBFFE4" : "#DFEEFF",
                        }}
                        className="text-xs p-1.5 rounded-lg font-medium w-[80px] text-center"
                      >
                        <span>{item.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap w-[120px]">
                      <div className="text-sm text-[#121212] font-medium">
                        {item.numberOfGuests}
                      </div>
                      <div className="text-[10px] text-[#808080] font-light">
                        {item.numberOfChildren} Child
                      </div>
                    </td>
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
            {i !== data.length - 1 && (
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

function Modal({ booking, setModal }: { booking: any; setModal: any }) {
  console.log(booking);

  const handleDelete = async () => {
    axios
      .delete(`${CONSTANT.BASE_URL}/booking/${booking._id}`)
      .then((res) => {
        console.log(res.data);
        setModal(null);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="border border-[#C0C0C0] rounded-2xl p-1.5 bg-[#FAFAFA] max-w-xl w-full relative"
    >
      <img
        src={graycancel}
        alt=""
        onClick={() => setModal(null)}
        className="absolute top-2 right-2 cursor-pointer"
      />
      <div className="border border-[#C0C0C0] rounded-xl p-4 bg-white">
        <h5 className="text-[#808080] font-light text-xs">Apartment</h5>
        <div className="flex w-full justify-between items-center my-3">
          <div>
            <h2 className="text-[#121212] font-semibold text-xs">
              {booking?.propertyId?.propertyName}
            </h2>
            <p className="text-[#3A3A3A] font-light text-[10px]">
              {booking?.propertyId?.address}
            </p>
          </div>
        </div>
        <div className="w-full h-40">
          <img
            className="w-full h-full object-cover rounded-xl"
            src={booking?.propertyId?.images[0]}
          />
        </div>
      </div>
      <div className="border border-[#C0C0C0] rounded-xl p-4 bg-white mt-1">
        <div className="flex w-full justify-between items-center">
          <h3 className="text-[#808080] text-xs">Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-3 my-2">
          <div>
            <h2 className="text-[#808080] text-xs">First Name</h2>
            <h4 className="text-[#121212] text-xs mt-0.5">
              {booking?.guestFirstName}
            </h4>
          </div>
          <div>
            <h2 className="text-[#808080] text-xs">Last Name</h2>
            <h4 className="text-[#121212] text-xs mt-0.5">
              {booking?.guestLastName}
            </h4>
          </div>
          <div>
            <h2 className="text-[#808080] text-xs">Phone no</h2>
            <h4 className="text-[#121212] text-xs mt-0.5">
              {booking?.guestPhone}
            </h4>
          </div>
          <div>
            <h2 className="text-[#808080] text-xs">Email</h2>
            <h4 className="text-[#121212] text-xs mt-0.5">
              {booking?.guestEmail}
            </h4>
          </div>
          <div>
            <h2 className="text-[#808080] text-xs">Price per night</h2>
            <h4 className="text-[#121212] text-xs mt-0.5">
              ₦
              {(booking?.totalBookingValue / booking?.nightsBooked)
                ?.toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </h4>
          </div>
          <div>
            <h2 className="text-[#808080] text-xs">Number of guest</h2>
            <h4 className="text-[#121212] text-xs mt-0.5">
              {booking?.numberOfGuests}
            </h4>
          </div>
          <div>
            <h2 className="text-[#808080] text-xs">Check-in</h2>
            <h4 className="text-[#121212] text-xs mt-0.5">
              {booking?.startDate?.split("T")[0]}
            </h4>
          </div>
          <div>
            <h2 className="text-[#808080] text-xs">Check-out</h2>
            <h4 className="text-[#121212] text-xs mt-0.5">
              {booking?.endDate?.split("T")[0]}
            </h4>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={handleDelete}
          className="text-[#F94144] font-medium text-sm flex items-center gap-2"
        >
          <img src={redcancel} />
          Cancel booking
        </button>
      </div>
    </div>
  );
}
