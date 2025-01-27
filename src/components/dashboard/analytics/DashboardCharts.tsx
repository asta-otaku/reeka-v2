import LineChart from "@/components/charts/Line";
import info from "@/assets/info.svg";
import { useCurrency } from "@/hooks/use-get-currency";
import { formatNumber } from "@/lib/utils";
import useDashboardAnalytics from "@/hooks/use-analytics";

function DashboardCharts({
  filterType,
  startDate,
  endDate,
}: {
  filterType: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
}) {
  const {
    activeMonth,
    setActiveMonth,
    cards,
    charts: ChartData,
  } = useDashboardAnalytics(filterType, startDate, endDate);

  return (
    <div>
      <div className="w-full overflow-x-auto no-scrollbar">
        <div className="flex space-x-3">
          {cards.map((data, index) => (
            <div
              key={index}
              className={`border shadow-sm rounded-xl space-y-6 p-4 min-w-[250px] grow
              ${
                data.percentage > 0
                  ? "bg-[linear-gradient(220deg,_#D5FFE7,_#FFFF_45%)]"
                  : "bg-[linear-gradient(220deg,_#FFEEEE,_#FFFF_45%)]"
              }`}
            >
              <div className="w-full flex items-center justify-between">
                <h4 className="text-[#808080] font-medium">{data.title}</h4>
                <h6
                  className={`${
                    data.percentage > 0 ? "text-[#219653]" : "text-[#E90000]"
                  } font-medium text-sm`}
                >
                  {data.percentage > 0 ? "+" : ""}
                  {data.percentage?.toFixed(2) || 0}%
                </h6>
              </div>
              <div>
                <h2 className="text-[#121212] text-2xl font-medium">
                  {data.formatValue(data.amount)}
                </h2>
                <p className="text-xs text-[#808080]">{data.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rest of the component remains the same */}
      <div className="flex justify-between items-center mt-6 mb-3">
        <h4 className="text-xl font-medium">Reports</h4>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveMonth("current")}
            className={`flex items-center gap-1.5 ${
              activeMonth === "current" ? "font-bold" : ""
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#E36B37]" />
            <h5 className="text-[#808080] font-light text-sm">
              Current Period
            </h5>
          </button>
          <button
            onClick={() => setActiveMonth("previous")}
            className={`flex items-center gap-1.5 ${
              activeMonth === "previous" ? "font-bold" : ""
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#F94144]" />
            <h5 className="text-[#808080] font-light text-sm">
              Previous Period
            </h5>
          </button>
        </div>
      </div>
      <hr />

      <section id="charts" className="flex flex-col w-full gap-4 py-4">
        {ChartData.map((data, index) => (
          <div key={index}>
            <h4 className="flex gap-1 text-[#808080] font-medium items-center">
              {data.title}
              <img src={info} />
            </h4>
            <h2 className="flex items-baseline gap-2 text-[#121212] text-2xl font-semibold">
              {data.title === "Bookings"
                ? data?.amount
                : `${useCurrency()}${formatNumber(data?.amount)}`}
              <span
                className={`text-xs p-1 rounded-md ${
                  data.percentage > 0
                    ? "bg-[#D5FFE7] text-[#219653]"
                    : "bg-[#FAFAFA] text-[#EB5757]"
                }`}
              >
                {data.percentage > 0 ? "+" : ""}
                {data?.percentage?.toFixed(2)}%
              </span>
            </h2>
            <div className="mt-4 border rounded-2xl p-3 bg-[#FAFAFA] w-full h-56">
              <LineChart
                labels={data.labels}
                data={(activeMonth === "current"
                  ? data.current
                  : data.previous
                ).filter((item): item is number => typeof item === "number")}
                activeMonth={activeMonth}
              />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default DashboardCharts;
