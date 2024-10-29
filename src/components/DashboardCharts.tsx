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
  const [monthlyBookings, setMonthlyBookings] = useState<any>({});
  const [monthlyRevenue, setMonthlyRevenue] = useState<any>({});
  const [monthlyAverageNightlyRate, setMonthlyAverageNightlyRate] =
    useState<any>({});
  const [dailyBookings, setDailyBookings] = useState<any>([]);
  const [dailyRevenue, setDailyRevenue] = useState<any>([]);
  const [dailyAverageNightlyRate, setdailyAverageNightlyRate] = useState<any>(
    []
  );
  const [occupancyRate, setOccupancyRate] = useState<any>({});
  const [previousDailyBooking, setpreviousDailyBooking] = useState<any>({});
  const [previousMonthlyRevenue, setPreviousMonthlyRevenue] = useState<any>({});
  const [
    previousMonthlyAverageNightlyRate,
    setPreviousMonthlyAverageNightlyRate,
  ] = useState<any>({});
  const [activeMonth, setActiveMonth] = useState("current");

  const [userId] = useState(CONSTANT.USER_ID);

  useEffect(() => {
    const formattedStartDate = moment(startDate).format("YYYY-MM-DD");
    const formattedEndDate = moment(endDate).format("YYYY-MM-DD");
    const filterQuery =
      filterType !== "custom_date_range"
        ? `filterType=${filterType}`
        : `filterType=custom_date_range&customStartDate=${formattedStartDate}&customEndDate=${formattedEndDate}`;

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
    const fetchDailyBookings = async () => {
      try {
        const response = await axios.get(
          `${CONSTANT.BASE_URL}/analytics/daily-nights-booked/${userId}?${filterQuery}`
        );
        setDailyBookings(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchDailyRevenue = async () => {
      try {
        const response = await axios.get(
          `${CONSTANT.BASE_URL}/analytics/daily-revenue/${userId}?${filterQuery}`
        );
        setDailyRevenue(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchDailyAverageNightlyRate = async () => {
      try {
        const response = await axios.get(
          `${CONSTANT.BASE_URL}/analytics/daily-average-nightly-rate/${userId}?${filterQuery}`
        );
        setdailyAverageNightlyRate(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchpreviousDailyBooking = async () => {
      try {
        const response = await axios.get(
          `${CONSTANT.BASE_URL}/analytics/previous/daily-nights-booked/${userId}?${filterQuery}`
        );
        setpreviousDailyBooking(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchPreviousMonthlyRevenue = async () => {
      try {
        const response = await axios.get(
          `${CONSTANT.BASE_URL}/analytics/previous/daily-revenue/${userId}?${filterQuery}`
        );
        setPreviousMonthlyRevenue(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchPreviousMonthlyAverageNightlyRate = async () => {
      try {
        const response = await axios.get(
          `${CONSTANT.BASE_URL}/analytics/previous/daily-average-nightly-rate/${userId}?${filterQuery}`
        );
        setPreviousMonthlyAverageNightlyRate(response.data);
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

    fetchMonthlyBookings();
    fetchMonthlyRevenue();
    fetchMonthlyAverageNightlyRate();
    fetchDailyBookings();
    fetchDailyRevenue();
    fetchDailyAverageNightlyRate();
    fetchpreviousDailyBooking();
    fetchPreviousMonthlyRevenue();
    fetchPreviousMonthlyAverageNightlyRate();
    fetchOccupancyRate();
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
      amount: monthlyBookings.totalNightsBooked || 0,
      percentage: monthlyBookings.percentageChangeNightsBooked || 0,
      current: dailyBookings.length
        ? dailyBookings.map((item: any) => item.totalNights) || 0
        : [],
      previous: previousDailyBooking.length
        ? previousDailyBooking.map((item: any) => item.totalNights)
        : [],
      labels:
        activeMonth === "current"
          ? dailyBookings.length
            ? dailyBookings.map((item: any) => item?.date)
            : []
          : previousDailyBooking.length
          ? previousDailyBooking.map((item: any) => item?.date)
          : [],
    },
    {
      title: "Revenue",
      amount: monthlyRevenue?.totalRevenue || 0,
      percentage: monthlyRevenue?.percentageChangeRevenue || 0,
      current: dailyRevenue.length
        ? dailyRevenue?.map((item: any) => item?.totalRevenue)
        : [],
      previous: previousMonthlyRevenue.length
        ? previousMonthlyRevenue?.map((item: any) => item?.totalRevenue)
        : [],
      labels:
        activeMonth === "current"
          ? dailyRevenue?.length
            ? dailyRevenue?.map((item: any) => item?.date)
            : []
          : previousMonthlyRevenue.length
          ? previousMonthlyRevenue?.map((item: any) => item?.date)
          : [],
    },
    {
      title: "Average Nightly Rate",
      amount: monthlyAverageNightlyRate?.averageNightlyRate || 0,
      percentage: monthlyAverageNightlyRate?.percentageChangeNightlyRate || 0,
      current: dailyAverageNightlyRate.length
        ? dailyAverageNightlyRate?.map((item: any) => item?.averageNightlyRate)
        : [],
      previous: previousMonthlyAverageNightlyRate.length
        ? previousMonthlyAverageNightlyRate?.map(
            (item: any) => item.averageNightlyRate
          )
        : [],
      labels:
        activeMonth === "current"
          ? dailyAverageNightlyRate.length
            ? dailyAverageNightlyRate?.map((item: any) => item?.date)
            : []
          : previousMonthlyAverageNightlyRate.length
          ? previousMonthlyAverageNightlyRate?.map((item: any) => item?.date)
          : [],
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
                    : `₦${data?.amount
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
                {data.percentage.toFixed(2)}%
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
