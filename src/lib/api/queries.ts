import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../services/axiosInstance";
import {
  Bookings,
  dahsboardCardData,
  dashboardGraphData,
  dashboardPropertyCardData,
  dashboardPropertyGraphData,
  EditUser,
  PricingPlan,
  Property,
  Staff,
} from "../types";
import moment from "moment";
import toast from "react-hot-toast";

export const useGetUserSubscription = () => {
  return useQuery({
    queryKey: ["user-subscription"],
    queryFn: async (): Promise<PricingPlan> =>
      axiosInstance
        .get("/subscriptions/user-subscription")
        .then((res) => res.data)
        .catch((error) => {
          setTimeout(() => (window.location.href = "/pricing"), 500);
          throw new Error(error);
        }),
  });
};

export const useGetProperties = () => {
  return useQuery({
    queryKey: ["properties"],
    queryFn: async (): Promise<Property[]> => {
      return axiosInstance.get("/properties").then((res) => res.data);
    },
  });
};

export const useGetProperty = (id: string) => {
  return useQuery({
    queryKey: ["properties", id],
    queryFn: async (): Promise<Property> => {
      return axiosInstance.get(`/properties/${id}`).then((res) => res.data);
    },
    enabled: !!id,
  });
};

export const useGetPublicProperties = (token: string) => {
  return useQuery({
    queryKey: ["public-properties", token],
    queryFn: async (): Promise<Property[]> => {
      return axiosInstance
        .get("/public/property", { params: { token } })
        .then((res) => res.data);
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
      const { data } = await axiosInstance.get(
        `/analytics/user?${filterQuery}`
      );
      return data;
    },
  });
};

export const useGetPreviousUserAnalytics = (filterQuery: string) => {
  return useQuery({
    queryKey: ["previous-user-analytics", filterQuery],
    queryFn: async (): Promise<{
      userAnalytics: dahsboardCardData;
      percentageChange: dahsboardCardData;
    }> => {
      const { data } = await axiosInstance.get(
        `/analytics/previous/user?${filterQuery}`
      );
      return data;
    },
  });
};

export const useGetUserDailyAnalytics = (filterQuery: string) => {
  return useQuery({
    queryKey: ["user-daily-analytics", filterQuery],
    queryFn: async (): Promise<dashboardGraphData[]> => {
      const { data } = await axiosInstance.get(
        `/analytics/user/daily?${filterQuery}`
      );
      return data;
    },
  });
};

export const useGetPreviousUserDailyAnalytics = (filterQuery: string) => {
  return useQuery({
    queryKey: ["previous-user-daily-analytics", filterQuery],
    queryFn: async (): Promise<dashboardGraphData[]> => {
      const { data } = await axiosInstance.get(
        `/analytics/previous/user/daily?${filterQuery}`
      );
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
      ? `?filterType=custom_date_range&customStartDate=${moment(
          startDate
        ).format("YYYY-MM-DD")}&customEndDate=${moment(endDate).format(
          "YYYY-MM-DD"
        )}`
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
      return data;
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
      ? `?filterType=custom_date_range&customStartDate=${moment(
          startDate
        ).format("YYYY-MM-DD")}&customEndDate=${moment(endDate).format(
          "YYYY-MM-DD"
        )}`
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
      const url = id ? `/booking/property/${id}` : "/booking";
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

export const useGetUser = (staffId?: string) => {
  return useQuery({
    queryKey: ["user", staffId],
    queryFn: async (): Promise<EditUser> => {
      const url = staffId ? `/users/${staffId}` : "/users";
      const response = await axiosInstance.get(url);
      return response.data;
    },
    enabled: !!staffId,
  });
};

export const useGetStaffs = (isAgent?: boolean) => {
  return useQuery({
    queryKey: ["staffs", isAgent],
    queryFn: async (): Promise<Staff[]> => {
      const response = await axiosInstance.get(isAgent ? "/agents" : "/staff");
      return response.data;
    },
  });
};

export const useGetAgentLink = (id: string) => {
  return useQuery({
    queryKey: ["agent-link", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/agents/${id}/url`);
      navigator.clipboard.writeText(response.data.agentLink);
      toast.success("Public URL copied to clipboard");
    },
    enabled: false,
  });
};

export const useGetPortfolioLink = (id?: string) => {
  return useQuery({
    queryKey: ["portfolio-link", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/public/url`, {
        params: { propertyId: id },
      });
      navigator.clipboard.writeText(response.data);
      toast.success("Public URL copied to clipboard");
    },
    enabled: false,
  });
};

export const useGetBookedDates = (propertyId: string) => {
  return useQuery({
    queryKey: ["booked-dates", propertyId],
    queryFn: async (): Promise<{ start: string; end: string }[]> => {
      const response = await axiosInstance.get(
        `/properties/${propertyId}/booked-dates`
      );
      return response.data;
    },
    enabled: !!propertyId,
  });
};
