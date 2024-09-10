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
  const events: any[] = [];
  const [selectedProperty, setSelectedProperty] = useState("");

  function formatTimestamp(timestamp: string) {
    const date = new Date(timestamp);

    // Extract date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // Extract time components
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // Combine to get the desired format
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
        const formattedBookings = response.data.map((booking: any) => ({
          _id: booking.id,
          propertyName: booking?.propertyId?.propertyName,
          guestFirstName: booking.guestFirstName,
          guestLastName: booking.guestLastName,
          startDate: formatTimestamp(booking.startDate),
          endDate: formatTimestamp(booking.endDate),
          color:
            booking.color ||
            "#" + Math.floor(Math.random() * 16777215).toString(16),
          ...booking,
        }));

        setBookingsArray(formattedBookings);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  bookingsArray
    .filter((bk: any) =>
      bk?.propertyName?.toLowerCase().includes(selectedProperty.toLowerCase())
    )
    .forEach((booking) => {
      events.push({
        id: booking._id,
        label:
          booking.guestFirstName +
          " " +
          booking.guestLastName +
          " - " +
          "[" +
          booking.propertyName +
          "]",
        start: booking.startDate,
        end: booking.endDate,
        bgColor: booking.color,
      });
    });

  return (
    <DashboardLayout>
      <div>
        <DashboardNav
          title="Calendar"
          description="Create edit and send reservations."
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
            events={events}
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
