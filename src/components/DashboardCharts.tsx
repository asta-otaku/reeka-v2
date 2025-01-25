import LineChart from "../charts/Line";
import info from "../assets/info.svg";
import { useEffect, useState } from "react";
import moment from "moment";
import apiClient from "../helpers/apiClient";
import { useCurrency } from "@/hooks/use-get-currency";
import { dahsboardCardData, dashboardGraphData } from "@/lib/types";

function DashboardCharts({
  filterType,
  startDate,
  endDate,
}: {
  filterType: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
}) {
  const [activeMonth, setActiveMonth] = useState("current");
  const [cardData, setCardData] = useState<dahsboardCardData>({
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
  const [previousCardData, setPreviousCardData] = useState<dahsboardCardData>({
    userAnalytics: {
      totalNightsBooked: 0,
      totalRevenue: 0,
      averageNightlyRate: 0,
      occupancyRate: 0,
    },
    percentageChange: {
      totalRevenue: 0,
      totalNightsBooked: 0,
      averageNightlyRate: 0,
      occupancyRate: 0,
    },
  });
  const [graphData, setGraphData] = useState<dashboardGraphData[]>([]);
  const [previousGraphData, setPreviousGraphData] = useState<
    dashboardGraphData[]
  >([]);

  useEffect(() => {
    const formattedStartDate = moment(startDate).format("YYYY-MM-DD");
    const formattedEndDate = moment(endDate).format("YYYY-MM-DD");
    const filterQuery =
      filterType !== "custom_date_range"
        ? `filterType=${filterType}`
        : `filterType=custom_date_range&customStartDate=${formattedStartDate}&customEndDate=${formattedEndDate}`;

    const fetchData = async () => {
      try {
        const [
          cardResponse,
          previousCardResponse,
          graphResponse,
          previousGraphResponse,
        ] = await Promise.all([
          apiClient.get(`/analytics/user?${filterQuery}`),
          apiClient.get(`/analytics/previous/user?${filterQuery}`),
          apiClient.get(`/analytics/user/daily?${filterQuery}`),
          apiClient.get(`/analytics/previous/user/daily?${filterQuery}`),
        ]);

        setCardData(cardResponse.data);
        setPreviousCardData(previousCardResponse.data);
        setGraphData(graphResponse.data);
        setPreviousGraphData(previousGraphResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [filterType, startDate, endDate]);

  const generateCardData = () => {
    const cardMetrics = [
      {
        key: "totalRevenue",
        title: "Revenue",
        caption: "total revenue earned",
        formatValue: (val: number) =>
          useCurrency() +
          Number(val)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      },
      {
        key: "averageNightlyRate",
        title: "Avg Nightly Rate",
        caption: "revenue/booked nights",
        formatValue: (val: number) =>
          useCurrency() +
          Number(val)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      },
      {
        key: "occupancyRate",
        title: "Occupancy Rate",
        caption: "percentage of occupied nights",
        formatValue: (val: number) => `${val ?? 0}%`,
      },
      {
        key: "totalNightsBooked",
        title: "Bookings",
        caption: "total nights booked",
        formatValue: (val: number) => val,
      },
    ];

    type UserAnalyticsKeys = keyof typeof cardData.userAnalytics;

    return cardMetrics.map((metric) => {
      const currentData =
        cardData.userAnalytics[metric.key as UserAnalyticsKeys];
      const previousData =
        previousCardData.userAnalytics[metric.key as UserAnalyticsKeys];
      const currentPercentage =
        cardData.percentageChange[metric.key as UserAnalyticsKeys];
      const previousPercentage =
        previousCardData.percentageChange[metric.key as UserAnalyticsKeys];

      return {
        title: metric.title,
        amount: activeMonth === "current" ? currentData : previousData,
        percentage:
          activeMonth === "current" ? currentPercentage : previousPercentage,
        caption: metric.caption,
        formatValue: metric.formatValue,
      };
    });
  };

  const generateChartData = () => {
    const chartMetrics = [
      {
        key: "totalNightsBooked",
        title: "Bookings",
      },
      {
        key: "totalRevenue",
        title: "Revenue",
      },
      {
        key: "averageNightlyRate",
        title: "Average Nightly Rate",
      },
    ];

    return chartMetrics.map((metric) => {
      const currentData =
        graphData.map((data) => data[metric.key as keyof dashboardGraphData]) ??
        [];
      const previousData =
        previousGraphData.map(
          (data) => data[metric.key as keyof dashboardGraphData]
        ) ?? [];
      const currentLabels = graphData.map((data) => data.date) ?? [];
      const previousLabels = previousGraphData.map((data) => data.date) ?? [];

      const currentAnalytics =
        cardData.userAnalytics[
          metric.key as keyof typeof cardData.userAnalytics
        ];
      const previousAnalytics =
        previousCardData.userAnalytics[
          metric.key as keyof typeof cardData.userAnalytics
        ];
      const currentPercentage =
        cardData.percentageChange[
          metric.key as keyof typeof cardData.percentageChange
        ];
      const previousPercentage =
        previousCardData.percentageChange[
          metric.key as keyof typeof previousCardData.percentageChange
        ];

      return {
        title: metric.title,
        amount:
          activeMonth === "current" ? currentAnalytics : previousAnalytics,
        percentage:
          activeMonth === "current" ? currentPercentage : previousPercentage,
        current: currentData,
        previous: previousData,
        labels: activeMonth === "current" ? currentLabels : previousLabels,
      };
    });
  };

  const cards = generateCardData();
  const ChartData = generateChartData();

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
                : `${useCurrency()}${data?.amount
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
