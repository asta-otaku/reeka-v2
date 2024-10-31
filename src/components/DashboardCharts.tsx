import LineChart from "../charts/Line";
import info from "../assets/info.svg";
import { useEffect, useState } from "react";
import axios from "axios";
import { CONSTANT } from "../util";
import moment from "moment";

function DashboardCharts({
  filterType,
  startDate,
  endDate,
}: {
  filterType: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
}) {
  const [monthlyBookings, setMonthlyBookings] = useState<{
    totalNightsBooked: number;
    percentageChangeNightsBooked: number;
  }>({
    totalNightsBooked: 0,
    percentageChangeNightsBooked: 0,
  });
  const [monthlyRevenue, setMonthlyRevenue] = useState<{
    totalRevenue: number;
    percentageChangeRevenue: number;
  }>({
    totalRevenue: 0,
    percentageChangeRevenue: 0,
  });
  const [monthlyAverageNightlyRate, setMonthlyAverageNightlyRate] = useState<{
    averageNightlyRate: number;
    percentageChangeNightlyRate: number;
  }>({
    averageNightlyRate: 0,
    percentageChangeNightlyRate: 0,
  });
  const [previousMonthlyBookings, setPreviousMonthlyBookings] = useState<{
    totalNightsBooked: number;
    percentageChangeNightsBooked: number;
  }>({
    totalNightsBooked: 0,
    percentageChangeNightsBooked: 0,
  });
  const [previousMonthlyRevenue, setPreviousMonthlyRevenue] = useState<{
    totalRevenue: number;
    percentageChangeRevenue: number;
  }>({
    totalRevenue: 0,
    percentageChangeRevenue: 0,
  });
  const [
    previousMonthlyAverageNightlyRate,
    setPreviousMonthlyAverageNightlyRate,
  ] = useState<{
    averageNightlyRate: number;
    percentageChangeNightlyRate: number;
  }>({
    averageNightlyRate: 0,
    percentageChangeNightlyRate: 0,
  });
  const [occupancyRate, setOccupancyRate] = useState<{
    occupancy: number;
    percentageChange: number;
  }>({
    occupancy: 0,
    percentageChange: 0,
  });
  const [activeMonth, setActiveMonth] = useState("current");
  const [graphData, setGraphData] = useState<
    {
      totalRevenue: number;
      totalNightsBooked: number;
      date: string;
      averageNightlyRate: number;
    }[]
  >([]);
  const [previousGraphData, setPreviousGraphData] = useState<
    {
      totalRevenue: number;
      totalNightsBooked: number;
      date: string;
      averageNightlyRate: number;
    }[]
  >([]);
  const [userId] = useState(CONSTANT.USER_ID);

  useEffect(() => {
    const formattedStartDate = moment(startDate).format("YYYY-MM-DD");
    const formattedEndDate = moment(endDate).format("YYYY-MM-DD");
    const filterQuery =
      filterType !== "custom_date_range"
        ? `filterType=${filterType}`
        : `filterType=custom_date_range&customStartDate=${formattedStartDate}&customEndDate=${formattedEndDate}`;

    //Monthly Card Data
    const fetchMonthlyBookings = async () => {
      try {
        const response = await axios.get(
          `${CONSTANT.BASE_URL}/analytics/total-nights-booked/${userId}?${filterQuery}`
        );
        setMonthlyBookings(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchMonthlyRevenue = async () => {
      try {
        const response = await axios.get(
          `${CONSTANT.BASE_URL}/analytics/revenue/${userId}?${filterQuery}`
        );
        setMonthlyRevenue(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchMonthlyAverageNightlyRate = async () => {
      try {
        const response = await axios.get(
          `${CONSTANT.BASE_URL}/analytics/average-nightly-rate/${userId}?${filterQuery}`
        );
        setMonthlyAverageNightlyRate(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchOccupancyRate = async () => {
      try {
        const response = await axios.get(
          `${CONSTANT.BASE_URL}/analytics/occupancy/${userId}?${filterQuery}`
        );
        setOccupancyRate(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    //Previous Monthly Card Data
    const fetchPreviousMonthlyBookings = async () => {
      try {
        const response = await axios.get(
          `${CONSTANT.BASE_URL}/analytics/previous/total-nights-booked/${userId}?${filterQuery}`
        );
        setPreviousMonthlyBookings(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchPreviousMonthlyRevenue = async () => {
      try {
        const response = await axios.get(
          `${CONSTANT.BASE_URL}/analytics/previous/revenue/${userId}?${filterQuery}`
        );
        setPreviousMonthlyRevenue(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchPreviousMonthlyAverageNightlyRate = async () => {
      try {
        const response = await axios.get(
          `${CONSTANT.BASE_URL}/analytics/previous/average-nightly-rate/${userId}?${filterQuery}`
        );
        setPreviousMonthlyAverageNightlyRate(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    //Graph Data
    const fetchGraphData = async () => {
      try {
        const response = await axios.get(
          `${CONSTANT.BASE_URL}/analytics/user/${userId}/daily?${filterQuery}`
        );
        setGraphData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchPreviousGraphData = async () => {
      try {
        const response = await axios.get(
          `${CONSTANT.BASE_URL}/analytics/previous/user/${userId}/daily?${filterQuery}`
        );
        setPreviousGraphData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMonthlyBookings();
    fetchMonthlyRevenue();
    fetchMonthlyAverageNightlyRate();
    fetchOccupancyRate();
    fetchPreviousMonthlyBookings();
    fetchPreviousMonthlyRevenue();
    fetchPreviousMonthlyAverageNightlyRate();
    fetchGraphData();
    fetchPreviousGraphData();
  }, [filterType, startDate, endDate, userId]);

  const CardData = [
    {
      title: "Revenue",
      amount: monthlyRevenue?.totalRevenue ?? 0,
      percentage: monthlyRevenue?.percentageChangeRevenue ?? 0,
      caption: "total revenue earned",
    },
    {
      title: "Avg Nightly Rate",
      amount: monthlyAverageNightlyRate?.averageNightlyRate ?? 0,
      percentage: monthlyAverageNightlyRate?.percentageChangeNightlyRate ?? 0,
      caption: "revenue/booked nights",
    },
    {
      title: "Occupancy Rate",
      amount: occupancyRate?.occupancy ? occupancyRate.occupancy + "%" : "0%",
      percentage: occupancyRate?.percentageChange ?? 0,
      caption: "percentage of occupied nights",
    },
    {
      title: "Bookings",
      amount: monthlyBookings?.totalNightsBooked ?? 0,
      percentage: monthlyBookings?.percentageChangeNightsBooked ?? 0,
      caption: "total nights booked",
    },
  ];

  const ChartData = [
    {
      title: "Bookings",
      amount:
        activeMonth === "current"
          ? monthlyBookings?.totalNightsBooked
          : previousMonthlyBookings.totalNightsBooked,
      percentage:
        activeMonth === "current"
          ? monthlyBookings?.percentageChangeNightsBooked
          : previousMonthlyBookings.percentageChangeNightsBooked,
      current: graphData.map((data) => data.totalNightsBooked) || [],
      previous: previousGraphData.map((data) => data.totalNightsBooked) || [],
      labels:
        activeMonth === "current"
          ? graphData.map((data) => data.date) || []
          : previousGraphData.map((data) => data.date) || [],
    },
    {
      title: "Revenue",
      amount:
        activeMonth === "current"
          ? monthlyRevenue?.totalRevenue
          : previousMonthlyRevenue.totalRevenue,
      percentage:
        activeMonth === "current"
          ? monthlyRevenue?.percentageChangeRevenue
          : previousMonthlyRevenue.percentageChangeRevenue,
      current: graphData.map((data) => data.totalRevenue) || [],
      previous: previousGraphData.map((data) => data.totalRevenue) || [],
      labels:
        activeMonth === "current"
          ? graphData.map((data) => data.date) || []
          : previousGraphData.map((data) => data.date) || [],
    },
    {
      title: "Average Nightly Rate",
      amount:
        activeMonth === "current"
          ? monthlyAverageNightlyRate?.averageNightlyRate
          : previousMonthlyAverageNightlyRate.averageNightlyRate,
      percentage:
        activeMonth === "current"
          ? monthlyAverageNightlyRate?.percentageChangeNightlyRate
          : previousMonthlyAverageNightlyRate.percentageChangeNightlyRate,
      current: graphData.map((data) => data.averageNightlyRate) || [],
      previous: previousGraphData.map((data) => data.averageNightlyRate) || [],
      labels:
        activeMonth === "current"
          ? graphData.map((data) => data.date) || []
          : previousGraphData.map((data) => data.date) || [],
    },
  ];

  return (
    <div>
      <div className="w-full overflow-x-auto no-scrollbar">
        <div className="flex space-x-3">
          {CardData.map((data, index) => (
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
                  {data?.percentage?.toFixed(2)}%
                </h6>
              </div>
              <div>
                <h2 className="text-[#121212] text-2xl font-medium">
                  {data.title === "Bookings" || data.title === "Occupancy Rate"
                    ? data?.amount
                    : `₦${Number(data?.amount)
                        ?.toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                </h2>
                <p className="text-xs text-[#808080]">{data.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

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
                : `₦${data?.amount
                    ?.toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
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
                labels={data.labels} // X-axis labels (dates)
                data={activeMonth === "current" ? data.current : data.previous} // Show current or previous month data
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
