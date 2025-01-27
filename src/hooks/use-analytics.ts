import { useState } from "react";
import moment from "moment";
import { dahsboardCardData, dashboardGraphData } from "@/lib/types";
import { defaultAnalytics, formatNumber } from "@/lib/utils";
import { useCurrency } from "./use-get-currency";
import {
  useGetPreviousUserAnalytics,
  useGetPreviousUserDailyAnalytics,
  useGetUserAnalytics,
  useGetUserDailyAnalytics,
} from "@/lib/api/queries";

const useDashboardAnalytics = (
  filterType: string,
  startDate: Date | undefined,
  endDate: Date | undefined
) => {
  const [activeMonth, setActiveMonth] = useState<"current" | "previous">(
    "current"
  );
  const formattedStartDate = moment(startDate).format("YYYY-MM-DD");
  const formattedEndDate = moment(endDate).format("YYYY-MM-DD");

  const filterQuery =
    filterType !== "custom_date_range"
      ? `filterType=${filterType}`
      : `filterType=custom_date_range&customStartDate=${formattedStartDate}&customEndDate=${formattedEndDate}`;

  const {
    data: cardData = {
      userAnalytics: defaultAnalytics,
      percentageChange: defaultAnalytics,
    },
  } = useGetUserAnalytics(filterQuery);
  const {
    data: previousCardData = {
      userAnalytics: defaultAnalytics,
      percentageChange: defaultAnalytics,
    },
  } = useGetPreviousUserAnalytics(filterQuery);
  const { data: graphData = [] } = useGetUserDailyAnalytics(filterQuery);
  const { data: previousGraphData = [] } =
    useGetPreviousUserDailyAnalytics(filterQuery);

  const generateCardData = () => {
    const cardMetrics = [
      {
        key: "totalRevenue",
        title: "Revenue",
        caption: "total revenue earned",
        formatValue: (val: number) => useCurrency() + formatNumber(Number(val)),
      },
      {
        key: "averageNightlyRate",
        title: "Avg Nightly Rate",
        caption: "revenue/booked nights",
        formatValue: (val: number) => useCurrency() + formatNumber(Number(val)),
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

    return cardMetrics.map((metric) => {
      const currentData =
        cardData.userAnalytics[metric.key as keyof dahsboardCardData];
      const previousData =
        previousCardData.userAnalytics[metric.key as keyof dahsboardCardData];
      const currentPercentage =
        cardData.percentageChange[metric.key as keyof dahsboardCardData];
      const previousPercentage =
        previousCardData.percentageChange[
          metric.key as keyof dahsboardCardData
        ];

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
          metric.key as keyof typeof previousCardData.userAnalytics
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

  return {
    activeMonth,
    setActiveMonth,
    cards: generateCardData(),
    charts: generateChartData(),
  };
};

export default useDashboardAnalytics;
