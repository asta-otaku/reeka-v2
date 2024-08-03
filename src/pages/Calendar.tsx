import { useNavigate } from "react-router-dom";
import { Calendar as CalendarIcon, ChevronDownIcon } from "../assets/icons";
import DashboardNav from "../components/DashboardNav";
import { getDateRange } from "../helpers/getDate";
import DashboardLayout from "../layouts/DashboardLayout";
import Scheduler from "@mormat/react-scheduler";
import "@mormat/react-scheduler/dist/mormat_react_scheduler.css";

const events = [
  {
    label: "Meeting",
    start: "2024-02-01 10:00",
    end: "2024-02-01 12:00",
  },
  {
    label: "Conference",
    start: "2024-02-01 14:00",
    end: "2024-02-01 18:00",
  },
];

function Calendar() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div>
        <DashboardNav
          title="Calendar"
          description="Create edit and send reservations."
        />

        <div className="flex flex-wrap gap-4 items-center justify-between w-full my-4 px-6">
          <div className="flex items-center gap-4 min-w-fit overflow-x-auto no-scrollbar">
            <div className="flex items-center justify-center gap-2 bg-white border border-solid rounded-xl p-2 w-fit">
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
            </div>
            <div className="flex items-center justify-center gap-2 bg-white border border-solid rounded-xl p-2 w-fit">
              <select className="outline-none text-secondary text-xs md:text-sm font-light appearance-none border-none bg-transparent">
                <option>Bookings</option>
              </select>
              <ChevronDownIcon width={12} />
            </div>
            <div className="flex items-center justify-center gap-2 bg-white border border-solid rounded-xl p-2 w-fit">
              <select className="outline-none text-secondary text-xs md:text-sm font-light appearance-none border-none bg-transparent">
                <option>Ame's Palace</option>
              </select>
              <ChevronDownIcon width={12} />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-primary p-2 rounded-xl text-white font-medium text-sm border border-primary shadow-inner shadow-black/20">
              Create Booking
            </button>
            <button
              onClick={() => navigate("/reservation")}
              className="bg-primary p-2 rounded-xl text-white font-medium text-sm border border-primary shadow-inner shadow-black/20"
            >
              Create Reservation
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 my-6">
          <Scheduler events={events} initialDate={new Date()} />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Calendar;
