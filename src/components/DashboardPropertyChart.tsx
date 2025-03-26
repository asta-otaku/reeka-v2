import apiClient from "../helpers/apiClient";
import { useEffect, useState } from "react";
import info from "../assets/info.svg";
import LineChart from "../charts/Line";
import moment from "moment";

function DashboardPropertyChart({
  activePropertyId,
  filterType,
  startDate,
  endDate,
  userCurrency,
}: {
  activePropertyId: string;
  filterType: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  userCurrency: string;
}) {
  const [cardData, setCardData] = useState<{
    propertyAnalytics: {
      totalBookings: number;
      revenue: number;
      averageNightlyRate: number;
      occupancyRate: number;
    };
    percentageChange: {
      totalBookings: number;
      revenue: number;
      averageNightlyRate: number;
      occupancyRate: number;
    };
  }>({
    propertyAnalytics: {
      totalBookings: 0,
      revenue: 0,
      averageNightlyRate: 0,
      occupancyRate: 0,
    },
    percentageChange: {
      totalBookings: 0,
      revenue: 0,
      averageNightlyRate: 0,
      occupancyRate: 0,
    },
  });
  const [graphData, setGraphData] = useState<
    {
      date: string;
      bookings: number;
      revenue: number;
      averageNightlyRate: number;
    }[]
  >([]);
  const currencySymbol = userCurrency.toUpperCase() === "NGN" ? "₦" : "$";

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchCardData = async () => {
      try {
        let url = `/analytics/user/properties/${activePropertyId}?filterType=${filterType}&targetCurrency=${userCurrency}`;

        if (filterType === "custom_date_range") {
          if (!startDate || !endDate) return;

          const formattedStartDate = moment(startDate).format("YYYY-MM-DD");
          const formattedEndDate = moment(endDate).format("YYYY-MM-DD");
          url = `/analytics/user/properties/${activePropertyId}?filterType=custom_date_range&customStartDate=${formattedStartDate}&customEndDate=${formattedEndDate}&targetCurrency=${userCurrency}`;
        }

        const response = await apiClient.get(url, { signal });
        if (!signal.aborted) setCardData(response.data);
      } catch (error) {
        if (!signal.aborted) console.error(error);
      }
    };

    const fetchGraphData = async () => {
      try {
        let url = `/analytics/user/properties/${activePropertyId}/daily?filterType=${filterType}&targetCurrency=${userCurrency}`;

        if (filterType === "custom_date_range") {
          if (!startDate || !endDate) return;

          const formattedStartDate = moment(startDate).format("YYYY-MM-DD");
          const formattedEndDate = moment(endDate).format("YYYY-MM-DD");
          url = `/analytics/user/properties/${activePropertyId}/daily?filterType=custom_date_range&customStartDate=${formattedStartDate}&customEndDate=${formattedEndDate}&targetCurrency=${userCurrency}`;
        }

        const response = await apiClient.get(url, { signal });
        if (!signal.aborted) setGraphData(response.data);
      } catch (error) {
        if (!signal.aborted) console.error(error);
      }
    };

    fetchCardData();
    fetchGraphData();

    return () => controller.abort();
  }, [activePropertyId, filterType, startDate, endDate, userCurrency]);

  const cards = [
    {
      title: "Revenue",
      amount: cardData.propertyAnalytics.revenue,
      percentage: cardData.percentageChange.revenue,
      caption: "total revenue earned",
    },
    {
      title: "Avg Nightly Rate",
      amount: cardData.propertyAnalytics.averageNightlyRate,
      percentage: cardData.percentageChange.averageNightlyRate,
      caption: "revenue/booked nights",
    },
    {
      title: "Occupancy Rate",
      amount: cardData.propertyAnalytics.occupancyRate + "%",
      percentage: cardData.percentageChange.occupancyRate,
      caption: "percentage of occupied nights",
    },
    {
      title: "Bookings",
      amount: cardData.propertyAnalytics.totalBookings,
      percentage: cardData.percentageChange.totalBookings,
      caption: "total nights booked",
    },
  ];

  const charts = [
    {
      title: "Bookings",
      amount: cardData.propertyAnalytics.totalBookings,
      current: graphData.map((data) => data.bookings) || [],
      percentage: cardData.percentageChange.totalBookings,
      labels: graphData.map((data) => data.date) || [],
    },
    {
      title: "Revenue",
      amount: cardData.propertyAnalytics.revenue,
      current: graphData.map((data) => data.revenue) || [],
      percentage: cardData.percentageChange.revenue,
      labels: graphData.map((data) => data.date) || [],
    },
    {
      title: "Average Nightly Rate",
      amount: cardData.propertyAnalytics.averageNightlyRate,
      current: graphData.map((data) => data.averageNightlyRate) || [],
      percentage: cardData.percentageChange.averageNightlyRate,
      labels: graphData.map((data) => data.date) || [],
    },
  ];

  return (
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
                  : `${currencySymbol}${
                      typeof data.amount === "number"
                        ? data.amount
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : data.amount
                    }`}
              </h2>
              <p className="text-xs text-[#808080]">{data.caption}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-6 mb-3">
        <h4 className="text-xl font-medium">Reports</h4>
      </div>

      <hr />

      <section id="charts" className="flex flex-col w-full gap-4 py-4">
        {charts.map((data, index) => (
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
                {data.percentage.toFixed(2)}%
              </span>
            </h2>
            <div className="mt-4 border rounded-2xl p-3 bg-[#FAFAFA] w-full h-56">
              <LineChart
                labels={data.labels}
                data={data.current}
                activeMonth={"current"}
              />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default DashboardPropertyChart;
