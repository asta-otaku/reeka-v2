import LineChart from "../charts/Line";
import info from "../assets/info.svg";
import { useEffect, useState } from "react";
import axios from "axios";
import { CONSTANT } from "../util";

function DashboardCharts() {
  const [monthlyBookings, setMonthlyBookings] = useState<any>({});
  const [monthlyRevenue, setMonthlyRevenue] = useState<any>({});
  const [monthlyAverageNightlyRate, setMonthlyAverageNightlyRate] =
    useState<any>({});
  const [dailyBookings, setDailyBookings] = useState<any>([]);
  const [dailyRevenue, setDailyRevenue] = useState<any>([]);
  const [dailyAverageNightlyRate, setdailyAverageNightlyRate] = useState<any>(
    []
  );
  const [previousMonthlyBookings, setPreviousMonthlyBookings] = useState<any>(
    {}
  );
  const [previousMonthlyRevenue, setPreviousMonthlyRevenue] = useState<any>({});
  const [
    previousMonthlyAverageNightlyRate,
    setPreviousMonthlyAverageNightlyRate,
  ] = useState<any>({});

  const userId = CONSTANT.USER_ID;

  useEffect(() => {
    const fetchMonthlyBookings = async () => {
      try {
        const response = await axios.get(
          `${CONSTANT.BASE_URL}/analytics/total-nights-booked/${userId}`
        );
        setMonthlyBookings(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchMonthlyRevenue = async () => {
      try {
        const response = await axios.get(
          `${CONSTANT.BASE_URL}/analytics/revenue/${userId}`
        );
        setMonthlyRevenue(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchMonthlyAverageNightlyRate = async () => {
      try {
        const response = await axios.get(
          `${CONSTANT.BASE_URL}/analytics/average-nightly-rate/${userId}`
        );
        setMonthlyAverageNightlyRate(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchDailyBookings = async () => {
      try {
        const response = await axios.get(
          `${CONSTANT.BASE_URL}/analytics/daily-bookings/${userId}`
        );
        setDailyBookings(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchDailyRevenue = async () => {
      try {
        const response = await axios.get(
          `${CONSTANT.BASE_URL}/analytics/daily-revenue/${userId}`
        );
        setDailyRevenue(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchDailyAverageNightlyRate = async () => {
      try {
        const response = await axios.get(
          `${CONSTANT.BASE_URL}/analytics/daily-average-nightly-rate/${userId}`
        );
        setdailyAverageNightlyRate(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchPreviousMonthlyBookings = async () => {
      try {
        const response = await axios.get(
          `${CONSTANT.BASE_URL}/analytics/previous/daily-bookings/${userId}`
        );
        setPreviousMonthlyBookings(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchPreviousMonthlyRevenue = async () => {
      try {
        const response = await axios.get(
          `${CONSTANT.BASE_URL}/analytics/previous/daily-revenue/${userId}`
        );
        setPreviousMonthlyRevenue(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchPreviousMonthlyAverageNightlyRate = async () => {
      try {
        const response = await axios.get(
          `${CONSTANT.BASE_URL}/analytics/previous/daily-average-nightly-rate/${userId}`
        );
        setPreviousMonthlyAverageNightlyRate(response.data);
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
    fetchPreviousMonthlyBookings();
    fetchPreviousMonthlyRevenue();
    fetchPreviousMonthlyAverageNightlyRate();
  }, []);

  const CardData = [
    {
      title: "Bookings",
      amount: monthlyBookings.totalNightsBooked || 0,
      percentage: monthlyBookings.percentageChangeNightsBooked || 0,
      caption: "total nights booked",
    },
    {
      title: "Revenue",
      amount: monthlyRevenue.totalRevenue,
      percentage: monthlyRevenue.percentageChangeRevenue || 0,
      caption: "total revenue earned" || 0,
    },
    {
      title: "Average Nightly Rate",
      amount: monthlyAverageNightlyRate.averageNightlyRate || 0,
      percentage: monthlyAverageNightlyRate.percentageChangeNightlyRate || 0,
      caption: "revenue/booked nights",
    },
  ];

  const ChartData = [
    {
      title: "Bookings",
      amount: monthlyBookings.totalNightsBooked || 0,
      percentage: monthlyBookings.percentageChangeNightsBooked || 0,
      current: dailyBookings.length
        ? dailyBookings.map((item: any) => item.count)
        : [],
      previous: previousMonthlyBookings.length
        ? previousMonthlyBookings.map((item: any) => item.totalNights)
        : [],
      labels: dailyBookings.length
        ? dailyBookings.map((_item: any) => " ")
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
      labels: dailyRevenue?.length
        ? dailyRevenue?.map((item: any) => item?.date)
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
      labels: dailyAverageNightlyRate.length
        ? dailyAverageNightlyRate?.map((item: any) => item?.date)
        : [],
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-4">
        {CardData.map((data, index) => (
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
                {data?.percentage?.toFixed(2)}%
              </h6>
            </div>
            <div>
              <h2 className="text-[#121212] text-2xl font-medium">
                {data.title === "Bookings"
                  ? data?.amount
                  : `$${data?.amount
                      ?.toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
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
        {ChartData.map((data, index) => (
          <div key={index}>
            <h4 className="flex gap-1 text-[#808080] font-medium items-center">
              {data.title}
              <img src={info} />
            </h4>
            <h2 className="flex items-baseline gap-2 text-[#121212] text-2xl font-semibold">
              {data.title === "Bookings"
                ? data?.amount
                : `$${data?.amount
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
                current={data.current}
                previous={data.previous}
                labels={data.labels}
              />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default DashboardCharts;
