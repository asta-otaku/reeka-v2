import { useNavigate } from "react-router-dom";
import { ChevronDownIcon } from "../assets/icons";
import DashboardNav from "../components/DashboardNav";
import DashboardLayout from "../layouts/DashboardLayout";
import Scheduler from "@mormat/react-scheduler";
import "@mormat/react-scheduler/dist/mormat_react_scheduler.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { CONSTANT } from "../util";

function Calendar() {
  const navigate = useNavigate();
  const [bookingsArray, setBookingsArray] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState("");

  function formatTimestamp(timestamp: string, isEndDate = false) {
    const date = new Date(timestamp);

    // Extract UTC date components
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    // Set hours and minutes based on whether it's a start or end date
    const hours = isEndDate ? "18" : "06";
    const minutes = "00";

    // Return the formatted string in 'YYYY-MM-DD HH:mm' format (in UTC)
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(
          `${CONSTANT.BASE_URL}/properties/owner/${CONSTANT.USER_ID}`
        );
        setProperties(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    axios
      .get(`${CONSTANT.BASE_URL}/booking/user/${CONSTANT.USER_ID}`)
      .then((response) => {
        const colorMap: { [key: string]: string } = {};

        const formattedBookings = response.data.map((booking: any) => {
          const propertyName = booking?.propertyId?.propertyName;

          if (!colorMap[propertyName]) {
            colorMap[propertyName] =
              "#" + Math.floor(Math.random() * 16777215).toString(16);
          }

          return {
            _id: booking.id,
            propertyName: propertyName,
            guestFirstName: booking.guestFirstName,
            guestLastName: booking.guestLastName,
            startDate: booking.startDate,
            endDate: booking.endDate,
            color: colorMap[propertyName],
            ...booking,
          };
        });

        setBookingsArray(formattedBookings);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Filter bookings based on the selected property and map them to events for the Scheduler
  const events = bookingsArray
    .filter((bk: any) =>
      bk?.propertyName?.toLowerCase().includes(selectedProperty.toLowerCase())
    )
    .map((booking) => ({
      id: booking._id,
      label: `${booking.guestFirstName} ${booking.guestLastName} - [${booking.propertyName}]`,
      start: formatTimestamp(booking.startDate),
      end: formatTimestamp(booking.endDate, true),
      bgColor: booking.color,
    }));

  return (
    <DashboardLayout>
      <div>
        <DashboardNav
          title="Calendar"
          description="Create, edit and send reservations."
        />

        <div className="flex flex-wrap gap-4 items-center justify-between w-full my-4 px-6">
          <div className="flex items-center gap-4 min-w-fit overflow-x-auto no-scrollbar">
            {/* <div className="flex items-center justify-center gap-2 bg-white border border-solid rounded-xl p-2 w-fit">
              <select className="outline-none text-secondary text-xs md:text-sm font-light appearance-none border-none bg-transparent">
                <option>Bookings</option>
              </select>
              <ChevronDownIcon width={12} />
            </div> */}
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
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/reservation")}
              className="bg-primary p-2 rounded-xl text-white font-medium text-sm border border-primary"
            >
              Create Reservation
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 my-6">
          <Scheduler
            events={events} // Events array with formatted timestamps
            initialDate={new Date()}
            draggable={false}
            onEventDelete={(event: any) => {
              setBookingsArray(
                bookingsArray.filter((booking) => booking._id !== event.id)
              );
            }}
            viewMode="month"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Calendar;
