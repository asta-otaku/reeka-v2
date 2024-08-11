import LineChart from "../charts/Line";
import info from "../assets/info.svg";

const chartData = [
  {
    title: "Bookings",
    amount: "$20,000",
    percentage: +2.4,
    current: [50, 31, 40],
    previous: [60, 40, 44],
  },
  {
    title: "Average Nightly Rate",
    amount: "$20,000",
    percentage: -2.4,
    current: [16, 22, 60],
    previous: [30, 21, 18],
  },
  {
    title: "Revenue",
    amount: "$20,000",
    percentage: +2.4,
    current: [10, 12, 8],
    previous: [20, 13, 8],
  },
];

const cardData = [
  {
    title: "Bookings",
    amount: "2,000",
    percentage: 200,
    caption: "total nights booked",
  },
  {
    title: "Revenue",
    amount: "$2,000",
    percentage: -200,
    caption: "total revenue earned",
  },
  {
    title: "Average Nightly Rate",
    amount: "$2,000",
    percentage: 200,
    caption: "revenue/booked nights",
  },
];

function DashboardCharts() {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-4">
        {cardData.map((data, index) => (
          <div
            key={index}
            className={`border shadow-sm rounded-xl space-y-6 p-4
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
                {data.percentage}%
              </h6>
            </div>
            <div>
              <h2 className="text-[#121212] text-2xl font-medium">
                {data.amount}
              </h2>
              <p className="text-xs text-[#808080]">{data.caption}</p>
            </div>
          </div>
        ))}
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
        {chartData.map((data, index) => (
          <div key={index}>
            <h4 className="flex gap-1 text-[#808080] font-medium items-center">
              {data.title}
              <img src={info} />
            </h4>
            <h2 className="flex items-baseline gap-2 text-[#121212] text-2xl font-semibold">
              {data.amount}
              <span
                className={`text-xs p-1 rounded-md ${
                  data.percentage > 0
                    ? "bg-[#D5FFE7] text-[#219653]"
                    : "bg-[#FAFAFA] text-[#EB5757]"
                }`}
              >
                {data.percentage > 0 ? "+" : ""}
                {data.percentage.toFixed(2)}%
              </span>
            </h2>
            <div className="mt-4 border rounded-2xl p-3 bg-[#FAFAFA] w-full h-56">
              <LineChart current={data.current} previous={data.previous} />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default DashboardCharts;
