import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../services/axiosInstance";
import { Bookings, dahsboardCardData, dashboardGraphData, dashboardPropertyCardData, dashboardPropertyGraphData, PricingPlan, Property } from "../types";
import moment from "moment";
import toast from "react-hot-toast";

export const useGetUserSubscription = () => {
  return useQuery({
    queryKey: ["user-subscription"],
    queryFn: async (): Promise<PricingPlan> =>
      axiosInstance
        .get("/subscriptions/user-subscriptin")
        .then((res) => res.data)
        .catch((error) => {
          window.location.href = "/pricing";
          throw new Error(error);
        }),
  });
};

export const useGetProperties = (id?: string) => {
  return useQuery({
    queryKey: ["properties", id],
    queryFn: async (): Promise<Property[]> => {
      const url = id ? `/properties/${id}` : "/properties";
      return axiosInstance.get(url).then((res) => res.data);
    },
  });
};

export const useGetUserAnalytics = (filterQuery: string) => {
  return useQuery({
    queryKey: ["user-analytics", filterQuery],
    queryFn: async (): Promise<{
    userAnalytics: dahsboardCardData;
    percentageChange: dahsboardCardData;
  }> => {
      const { data } = await axiosInstance.get(`/analytics/user?${filterQuery}`);
      return data;
    },
  });
};

export const useGetPreviousUserAnalytics = (filterQuery: string) => {
  return useQuery({
    queryKey: ["previous-user-analytics", filterQuery],
    queryFn: async () : Promise<{
    userAnalytics: dahsboardCardData;
    percentageChange: dahsboardCardData;
  }> => {
      const { data } = await axiosInstance.get(`/analytics/previous/user?${filterQuery}`);
      return data;
    },
  });
};

export const useGetUserDailyAnalytics = (filterQuery: string) => {
  return useQuery({
    queryKey: ["user-daily-analytics", filterQuery],
    queryFn: async (): Promise<dashboardGraphData[]> => {
      const { data } = await axiosInstance.get(`/analytics/user/daily?${filterQuery}`);
      return data;
    },
  });
};

export const useGetPreviousUserDailyAnalytics = (filterQuery: string) => {
  return useQuery({
    queryKey: ["previous-user-daily-analytics", filterQuery],
    queryFn: async (): Promise<dashboardGraphData[]> => {
      const { data } = await axiosInstance.get(`/analytics/previous/user/daily?${filterQuery}`);
      return data;
    },
  });
};

export const useGetPropertyAnalytics = (
  activePropertyId: string,
  filterType: string,
  startDate?: Date,
  endDate?: Date
) => {
  const filterParams =
    filterType === "custom_date_range" && startDate && endDate
      ? `?filterType=custom_date_range&customStartDate=${moment(startDate).format(
          "YYYY-MM-DD"
        )}&customEndDate=${moment(endDate).format("YYYY-MM-DD")}`
      : `?filterType=${filterType}`;

  return useQuery({
    queryKey: ["property-analytics", activePropertyId, filterParams],
    queryFn: async (): Promise<{
      propertyAnalytics: dashboardPropertyCardData;
      percentageChange: dashboardPropertyCardData;
    }> => {
      const { data } = await axiosInstance.get(
        `/analytics/user/properties/${activePropertyId}${filterParams}`
      );
      return data
    },
  });
};

export const useGetPropertyGraphData = (
  activePropertyId: string,
  filterType: string,
  startDate?: Date,
  endDate?: Date
) => {
  const filterParams =
    filterType === "custom_date_range" && startDate && endDate
      ? `?filterType=custom_date_range&customStartDate=${moment(startDate).format(
          "YYYY-MM-DD"
        )}&customEndDate=${moment(endDate).format("YYYY-MM-DD")}`
      : `?filterType=${filterType}`;

  return useQuery({
    queryKey: ["property-graph-data", activePropertyId, filterParams],
    queryFn: async (): Promise<dashboardPropertyGraphData[]> => {
      const { data } = await axiosInstance.get(
        `/analytics/user/properties/${activePropertyId}/daily${filterParams}`
      );
      return data;
    },
  });
};

export const useGetBookings = (id?: string) => {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: async (): Promise<Bookings[]> => {
      const url = id ? `/booking/${id}` : "/booking";
      return axiosInstance.get(url).then((res) => res.data);
    },
  });
};

export const useGetReport = (url: string, title: string) => {
  return useQuery({
    queryKey: ["report", url],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(url, { responseType: "blob" });
        const downloadUrl = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", `${title}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      } catch {
        toast.error("An error occurred while generating the report.");
      }
    },
    enabled: false,
  });
};