import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../services/axiosInstance";
import { PricingPlan, Property } from "../types";

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
