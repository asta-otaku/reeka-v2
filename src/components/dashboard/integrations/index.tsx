import { useState } from "react";
import Cards from "@/components/IntegrationCards";
import DashboardNav from "@/components/DashboardNav";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { bookings, finances } from "@/lib/utils";

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
            disabled
            onClick={() => setSelected(1)}
            className={`text-sm pb-2 cursor-not-allowed ${
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
