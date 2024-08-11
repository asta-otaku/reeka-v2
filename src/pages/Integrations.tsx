import { useState } from "react";
import Cards from "../components/IntegrationCards";
import DashboardNav from "../components/DashboardNav";
import DashboardLayout from "../layouts/DashboardLayout";
import airbnb from "../assets/airbnb.svg";
import bookingsIcon from "../assets/Booking.com_logo 2.svg";
import expedia from "../assets/expedia.svg";
import finance from "../assets/finance.svg";
import mpesa from "../assets/icons8-mpesa-48.png";
import vrbo from "../assets/vrbo-removebg-preview 1.svg";
import trivago from "../assets/trivago.svg";

const bookings: {
  name: string;
  description: string;
  logo: string;
  status: boolean;
  disabled?: boolean;
}[] = [
  {
    name: "Airbnb",
    description: "Manage your bookings with ease.",
    logo: airbnb,
    status: true,
  },
  {
    name: "Booking.com",
    description: "Manage your bookings with ease.",
    logo: bookingsIcon,
    status: false,
  },
  {
    name: "Expedia",
    description: "Manage your bookings with ease.",
    logo: expedia,
    status: false,
  },
  {
    name: "Vrbo",
    description: "Manage your bookings with ease.",
    logo: vrbo,
    status: false,
  },
  {
    name: "Trivago",
    description: "Manage your bookings with ease.",
    logo: trivago,
    status: false,
  },
];

const finances: {
  name: string;
  description: string;
  logo: string;
  status: boolean;
  disabled?: boolean;
}[] = [
  {
    name: "Paystack",
    description: "Manage your payments with ease.",
    logo: finance,
    status: false,
    disabled: false,
  },
  {
    name: "Mpesa",
    description: "Manage your payments with ease.",
    logo: mpesa,
    status: false,
    disabled: true,
  },
];

function Integrations() {
  const [selected, setSelected] = useState(0);
  const [bookingList, setBookingList] = useState(bookings);
  const [financeList, setFinanceList] = useState(finances);

  return (
    <DashboardLayout>
      <div>
        <DashboardNav
          title="Integration"
          description="Manage your bookings with ease."
        />
      </div>

      <div className="px-4 ">
        <div className="flex items-center gap-6 w-full border-b border-0 my-4">
          <button
            onClick={() => setSelected(0)}
            className={`text-sm pb-2 ${
              selected === 0
                ? " text-primary border-b border-primary"
                : "text-[#808080]"
            }`}
          >
            Booking
          </button>
          <button
            onClick={() => setSelected(1)}
            className={`text-sm pb-2 ${
              selected === 1
                ? " text-primary border-b border-primary"
                : "text-[#808080]"
            }`}
          >
            Finance
          </button>
        </div>

        {selected === 0 ? (
          <div>
            <Cards list={bookingList} setList={setBookingList} tag={false} />

            <div className="mt-8">
              <h2 className="text-[#121212] font-medium text-2xl mb-4">
                Your Integrations
              </h2>
              <Cards list={bookingList} setList={setBookingList} tag />
            </div>
          </div>
        ) : (
          <div>
            <Cards list={financeList} setList={setFinanceList} tag={false} />

            <div className="mt-8">
              <h2 className="text-[#121212] font-medium text-2xl mb-4">
                Your Integrations
              </h2>
              <Cards list={financeList} setList={setFinanceList} tag />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Integrations;
