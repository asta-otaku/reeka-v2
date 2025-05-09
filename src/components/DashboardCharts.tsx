import LineChart from "../charts/Line";
import info from "../assets/info.svg";
import { useEffect, useState } from "react";
import moment from "moment";
import apiClient from "../helpers/apiClient";

function DashboardCharts({
  filterType,
  startDate,
  endDate,
  userCurrency,
}: {
  filterType: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  userCurrency: string;
}) {
  const [activeMonth, setActiveMonth] = useState("current");
  const [cardData, setCardData] = useState<{
    userAnalytics: {
      totalNightsBooked: number;
      totalRevenue: number;
      averageNightlyRate: number;
      occupancyRate: number;
    };
    percentageChange: {
      totalNightsBooked: number;
      totalRevenue: number;
      averageNightlyRate: number;
      occupancyRate: number;
    };
  }>({
    userAnalytics: {
      totalNightsBooked: 0,
      totalRevenue: 0,
      averageNightlyRate: 0,
      occupancyRate: 0,
    },
    percentageChange: {
      totalNightsBooked: 0,
      totalRevenue: 0,
      averageNightlyRate: 0,
      occupancyRate: 0,
    },
  });
  const [previousCardData, setPreviousCardData] = useState<{
    userAnalytics: {
      totalNightsBooked: number;
      totalRevenue: number;
      averageNightlyRate: number;
      occupancyRate: number;
    };
    percentageChange: {
      totalNightsBooked: number;
      totalRevenue: number;
      averageNightlyRate: number;
      occupancyRate: number;
    };
  }>({
    userAnalytics: {
      totalNightsBooked: 0,
      totalRevenue: 0,
      averageNightlyRate: 0,
      occupancyRate: 0,
    },
    percentageChange: {
      totalNightsBooked: 0,
      totalRevenue: 0,
      averageNightlyRate: 0,
      occupancyRate: 0,
    },
  });
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
  const currencySymbol = userCurrency.toUpperCase() === "NGN" ? "₦" : "$";

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const formattedStartDate = moment(startDate).format("YYYY-MM-DD");
    const formattedEndDate = moment(endDate).format("YYYY-MM-DD");
    const filterQuery =
      filterType !== "custom_date_range"
        ? `filterType=${filterType}`
        : `filterType=custom_date_range&customStartDate=${formattedStartDate}&customEndDate=${formattedEndDate}&targetCurrency=${userCurrency}`;

    // Fetch functions with signal
    const fetchCardData = async () => {
      try {
        const response = await apiClient.get(
          `/analytics/user?${filterQuery}&targetCurrency=${userCurrency}`,
          { signal }
        );
        if (!signal.aborted) setCardData(response.data);
      } catch (error) {
        if (!signal.aborted) console.error(error);
      }
    };

    const fetchPreviousCardData = async () => {
      try {
        const response = await apiClient.get(
          `/analytics/previous/user?${filterQuery}&targetCurrency=${userCurrency}`,
          { signal }
        );
        if (!signal.aborted) setPreviousCardData(response.data);
      } catch (error) {
        if (!signal.aborted) console.error(error);
      }
    };

    const fetchGraphData = async () => {
      try {
        const response = await apiClient.get(
          `/analytics/user/daily?${filterQuery}`,
          { signal }
        );
        if (!signal.aborted) setGraphData(response.data);
      } catch (error) {
        if (!signal.aborted) console.error(error);
      }
    };

    const fetchPreviousGraphData = async () => {
      try {
        const response = await apiClient.get(
          `/analytics/previous/user/daily?${filterQuery}&targetCurrency=${userCurrency}`,
          { signal }
        );
        if (!signal.aborted) setPreviousGraphData(response.data);
      } catch (error) {
        if (!signal.aborted) console.error(error);
      }
    };

    // Execute all fetches
    fetchCardData();
    fetchPreviousCardData();
    fetchGraphData();
    fetchPreviousGraphData();

    // Cleanup: Abort requests on unmount/dependency change
    return () => controller.abort();
  }, [filterType, startDate, endDate, userCurrency]);

  const cards = [
    {
      title: "Revenue",
      amount:
        activeMonth === "current"
          ? cardData.userAnalytics.totalRevenue
          : previousCardData.userAnalytics.totalRevenue,
      percentage:
        activeMonth === "current"
          ? cardData.percentageChange.totalRevenue
          : previousCardData.percentageChange.totalRevenue,
      caption: "total revenue earned",
    },
    {
      title: "Avg Nightly Rate",
      amount:
        activeMonth === "current"
          ? cardData.userAnalytics.averageNightlyRate
          : previousCardData.userAnalytics.averageNightlyRate,
      percentage:
        activeMonth === "current"
          ? cardData.percentageChange.averageNightlyRate
          : previousCardData.percentageChange.averageNightlyRate,
      caption: "revenue/booked nights",
    },
    {
      title: "Occupancy Rate",
      amount:
        activeMonth === "current"
          ? `${cardData.userAnalytics.occupancyRate ?? 0}%`
          : previousCardData.userAnalytics.occupancyRate + "%",
      percentage:
        activeMonth === "current"
          ? cardData.percentageChange.occupancyRate
          : previousCardData.percentageChange.occupancyRate,
      caption: "percentage of occupied nights",
    },
    {
      title: "Bookings",
      amount:
        activeMonth === "current"
          ? cardData.userAnalytics.totalNightsBooked
          : previousCardData.userAnalytics.totalNightsBooked,
      percentage:
        activeMonth === "current"
          ? cardData.percentageChange.totalNightsBooked
          : previousCardData.percentageChange.totalNightsBooked,
      caption: "total nights booked",
    },
  ];

  const ChartData = [
    {
      title: "Bookings",
      amount:
        activeMonth === "current"
          ? cardData.userAnalytics.totalNightsBooked
          : previousCardData.userAnalytics.totalNightsBooked,
      percentage:
        activeMonth === "current"
          ? cardData.percentageChange.totalNightsBooked
          : previousCardData.percentageChange.totalNightsBooked,
      current: graphData?.map((data) => data.totalNightsBooked) ?? [],
      previous: previousGraphData?.map((data) => data.totalNightsBooked) || [],
      labels:
        activeMonth === "current"
          ? graphData.map((data) => data.date) || []
          : previousGraphData.map((data) => data.date) || [],
    },
    {
      title: "Revenue",
      amount:
        activeMonth === "current"
          ? cardData.userAnalytics.totalRevenue
          : previousCardData.userAnalytics.totalRevenue,
      percentage:
        activeMonth === "current"
          ? cardData.percentageChange.totalRevenue
          : previousCardData.percentageChange.totalRevenue,
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
          ? cardData.userAnalytics.averageNightlyRate
          : previousCardData.userAnalytics.averageNightlyRate,
      percentage:
        activeMonth === "current"
          ? cardData.percentageChange.averageNightlyRate
          : previousCardData.percentageChange.averageNightlyRate,
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
                  {data?.percentage?.toFixed(2)}%
                </h6>
              </div>
              <div>
                <h2 className="text-[#121212] text-2xl font-medium">
                  {data.title === "Bookings" || data.title === "Occupancy Rate"
                    ? data?.amount
                    : `${currencySymbol}${Number(data?.amount)
                        .toFixed(2)
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
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
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
            <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
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
              <img src={info} alt="info" />
            </h4>
            <h2 className="flex items-baseline gap-2 text-[#121212] text-2xl font-semibold">
              {data.title === "Bookings"
                ? data?.amount
                : `${currencySymbol}${data?.amount
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
                labels={
                  activeMonth === "current"
                    ? data.labels
                    : data.labels /* previous labels if needed */
                }
                data={activeMonth === "current" ? data.current : data.previous}
                activeMonth={activeMonth}
                label={data.title}
              />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default DashboardCharts;
