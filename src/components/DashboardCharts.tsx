import LineChart from "../charts/Line";
import info from "../assets/info.svg";

function DashboardCharts() {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-4">
        <div className="bg-[linear-gradient(220deg,_#D5FFE7,_#FFFF_45%)] border shadow-sm rounded-xl space-y-6 p-4">
          <div className="w-full flex items-center justify-between">
            <h4 className="text-[#808080] font-medium">Bookings</h4>
            <h6 className="text-[#219653] font-medium text-sm">+200%</h6>
          </div>
          <div>
            <h2 className="text-[#121212] text-2xl font-medium">2,000</h2>
            <p className="text-xs text-[#808080]">1,000 previous period</p>
          </div>
        </div>
        <div className="bg-[linear-gradient(220deg,_#FFEEEE,_#FFFF_45%)] border shadow-sm rounded-xl space-y-6 p-4">
          <div className="w-full flex items-center justify-between">
            <h4 className="text-[#808080] font-medium">Revenue</h4>
            <h6 className="text-[#E90000] font-medium text-sm">+200%</h6>
          </div>
          <div>
            <h2 className="text-[#121212] text-2xl font-medium">2,000</h2>
            <p className="text-xs text-[#808080]">1,000 previous period</p>
          </div>
        </div>
        <div className="bg-[linear-gradient(220deg,_#D5FFE7,_#FFFF_45%)] border shadow-sm rounded-xl space-y-6 p-4">
          <div className="w-full flex items-center justify-between">
            <h4 className="text-[#808080] font-medium">Bookings</h4>
            <h6 className="text-[#219653] font-medium text-sm">+200%</h6>
          </div>
          <div>
            <h2 className="text-[#121212] text-2xl font-medium">2,000</h2>
            <p className="text-xs text-[#808080]">1,000 previous period</p>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-6 mb-3">
        <h4 className="text-xl font-medium">Reports</h4>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E36B37]" />
            <h5 className="text-[#808080] font-light text-sm">Current Month</h5>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F94144]" />
            <h5 className="text-[#808080] font-light text-sm">
              Previous Month
            </h5>
          </div>
        </div>
      </div>
      <hr />

      <section id="charts" className="flex flex-col w-full gap-4 py-4">
        <div>
          <h4 className="flex gap-1 text-[#808080] font-medium items-center">
            Booking
            <img src={info} />
          </h4>
          <h2 className="flex items-baseline gap-2 text-[#121212] text-2xl font-semibold">
            $20,000
            <span className="text-xs text-[#219653] p-0.5 rounded-md bg-[#D5FFE7]">
              +2.40%
            </span>
          </h2>
          <div className="mt-4 border rounded-2xl p-3 bg-[#FAFAFA]">
            <LineChart current={[50, 31, 40]} previous={[60, 40, 44]} />
          </div>
        </div>
        <div>
          <h4 className="flex gap-1 text-[#808080] font-medium items-center">
            Report
            <img src={info} />
          </h4>
          <h2 className="flex items-baseline gap-2 text-[#121212] text-2xl font-semibold">
            $20,000
            <span className="text-xs text-[#EB5757] p-1 rounded-md bg-[#FFDEDF]">
              +2.40%
            </span>
          </h2>
          <div className="mt-4 border rounded-2xl p-3 bg-[#FAFAFA]">
            <LineChart current={[16, 22, 60]} previous={[30, 21, 18]} />
          </div>
        </div>
        <div>
          <h4 className="flex gap-1 text-[#808080] font-medium items-center">
            Revenue
            <img src={info} />
          </h4>
          <h2 className="flex items-baseline gap-2 text-[#121212] text-2xl font-semibold">
            $20,000
            <span className="text-xs text-[#219653] p-1 rounded-md bg-[#D5FFE7]">
              +2.40%
            </span>
          </h2>
          <div className="mt-4 border rounded-2xl p-3 bg-[#FAFAFA]">
            <LineChart current={[10, 12, 8]} previous={[20, 13, 8]} />
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardCharts;
