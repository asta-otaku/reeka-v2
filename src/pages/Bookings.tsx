import { ChevronDownIcon } from "../assets/icons";
import DashboardNav from "../components/DashboardNav";
import DashboardLayout from "../layouts/DashboardLayout";
import BookingTable from "../components/BookingTable";
import { useNavigate } from "react-router-dom";

const data = [
  {
    date: "Dec 14",
    time: "12:00 PM",
    apartment: "Ama's Nest",
    location: "25 Bello Drive, Lagos Island Nigeria",
    name: "Olojo Ayomide",
    amount: "$4000",
    duration: "For 3 Nights",
    status: "Ongoing",
    guest: 2,
    child: 1,
  },
  {
    date: "Dec 14",
    time: "12:00 PM",
    apartment: "Ama's Nest",
    location: "25 Bello Drive, Lagos Island Nigeria",
    name: "Olojo Ayomide",
    amount: "$4000",
    duration: "For 3 Nights",
    status: "Ongoing",
    guest: 2,
    child: 1,
  },
  {
    date: "Dec 14",
    time: "12:00 PM",
    apartment: "Ama's Nest",
    location: "25 Bello Drive, Lagos Island Nigeria",
    name: "Olojo Ayomide",
    amount: "$4000",
    duration: "For 3 Nights",
    status: "Confirmed",
    guest: 2,
    child: 1,
  },
];

function Bookings() {
  const navigate = useNavigate();
  return (
    <DashboardLayout>
      <div>
        <DashboardNav
          title="Bookings"
          description="Manage your bookings with ease."
        />

        <div className="flex flex-wrap gap-4 items-center justify-between w-full my-4 px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center gap-2 bg-white border border-solid rounded-xl p-2 w-fit">
              <select className="outline-none text-secondary text-xs md:text-sm font-light appearance-none border-none bg-transparent">
                <option>All Bookings</option>
              </select>
              <ChevronDownIcon width={12} />
            </div>
            <div className="flex items-center justify-center gap-2 bg-white border border-solid rounded-xl p-2 w-fit">
              <select className="outline-none text-secondary text-xs md:text-sm font-light appearance-none border-none bg-transparent">
                <option>All Properties</option>
              </select>
              <ChevronDownIcon width={12} />
            </div>
          </div>
          <button
            onClick={() => navigate("/reservation")}
            className="bg-primary p-2 rounded-xl text-white font-medium text-sm border border-primary shadow-inner shadow-black/20"
          >
            Create Reservation
          </button>
        </div>

        <div className="overflow-x-auto px-6 no-scrollbar mt-6">
          <BookingTable data={data} />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Bookings;
