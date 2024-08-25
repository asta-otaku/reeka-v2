import { useNavigate } from "react-router-dom";
import { ChevronDownIcon } from "../assets/icons";
import DashboardNav from "../components/DashboardNav";
// import { getDateRange } from "../helpers/getDate";
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
    const bookings = localStorage.getItem("bookings");
    if (bookings) {
      setBookingsArray(JSON.parse(bookings));
    }
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
        start: new Date(booking.createdAt),
        end: new Date(booking.endDate),
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
                <option>Weekly</option>
              </select>
              <ChevronDownIcon width={12} />
            </div>
            <div className="flex items-center justify-center gap-2 bg-white border rounded-xl p-2 w-fit">
              <CalendarIcon width={12} />
              <select className="outline-none text-secondary text-xs md:text-sm appearance-none border-none bg-transparent">
                <option>{getDateRange()}</option>
              </select>
            </div> */}
            <div className="flex items-center justify-center gap-2 bg-white border border-solid rounded-xl p-2 w-fit">
              <select className="outline-none text-secondary text-xs md:text-sm font-light appearance-none border-none bg-transparent">
                <option>Bookings</option>
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
              localStorage.setItem("bookings", JSON.stringify(bookingsArray));
            }}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Calendar;
