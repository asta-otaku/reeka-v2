import { useNavigate } from "react-router-dom";
import { ChevronDownIcon } from "@/assets/icons";
import DashboardNav from "@/components/DashboardNav";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Scheduler from "@mormat/react-scheduler";
import "@mormat/react-scheduler/dist/mormat_react_scheduler.css";
import { useEffect, useState } from "react";
import { formatTimestamp } from "@/lib/utils";
import { useGetBookings, useGetProperties } from "@/lib/api/queries";
import { Bookings } from "@/lib/types";

function Calendar() {
  const navigate = useNavigate();
  const [bookingsArray, setBookingsArray] = useState<Bookings[]>([]);
  const { data: properties = [] } = useGetProperties();
  const { data: bookings } = useGetBookings();
  const [selectedProperty, setSelectedProperty] = useState("");

  useEffect(() => {
    if (bookings) {
      const colorMap: { [key: string]: string } = {};

      const formattedBookings = bookings.map((booking: Bookings) => {
        const propertyName = booking?.propertyId?.propertyName;

        if (!colorMap[propertyName]) {
          colorMap[propertyName] =
            "#" + Math.floor(Math.random() * 16777215).toString(16);
        }

        return {
          color: colorMap[propertyName],
          ...booking,
        };
      });

      setBookingsArray(formattedBookings);
    }
  }, [bookings]);

  const events = bookingsArray
    .filter((bk) =>
      bk.propertyId.propertyName
        .toLowerCase()
        .includes(selectedProperty.toLowerCase())
    )
    .map((booking) => ({
      id: booking._id,
      label: `${booking.guestFirstName} ${booking.guestLastName} - [${booking.propertyId.propertyName}]`,
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
            <div className="relative flex items-center justify-center gap-2 bg-white border border-solid rounded-xl p-2 w-fit">
              <select
                onChange={(e) => {
                  setSelectedProperty(e.target.value);
                }}
                className="outline-none text-secondary text-xs md:text-sm font-light appearance-none border-none bg-transparent pr-6"
              >
                <option value="">All Properties</option>
                {properties.map((property) => (
                  <option key={property._id} value={property.propertyName}>
                    {property.propertyName}
                  </option>
                ))}
              </select>
              <ChevronDownIcon
                className="cursor-pointer pointer-events-none absolute right-2"
                width={12}
              />
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
