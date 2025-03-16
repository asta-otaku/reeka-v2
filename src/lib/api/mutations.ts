import axiosInstance from "../services/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import {  SignIn, SignUp } from "../types";
import { useNavigate } from "react-router-dom";

// Signin mutation
export const usePostSignIn = () => {
  return useMutation({
    mutationKey: ["post-signin"],
    mutationFn: (
      loginDetails: SignIn
    ): Promise<{
      data: {
        accessToken: string;
        refreshToken: string;
        firstName: string;
        lastName: string;
        userRole: string;
        country: string;
        staffId?: string;
      };
    }> => axiosInstance.post("/auth/login", loginDetails),
    onSuccess: () => toast.success("Logged in successfully"),
    onError: (error: AxiosError) => {
      // @ts-expect-error this is an error from axios
      toast.error(error.response?.data.error || "Invalid credentials");
    },
  });
};
// Signup mutation
export const usePostSignUp = () => {
  return useMutation({
    mutationKey: ["post-signup"],
    mutationFn: (signupDetails: SignUp) => {
      const url = signupDetails.invitationToken
        ? `/auth/signup?invitationToken=${signupDetails.invitationToken}`
        : `/auth/signup`;
      return axiosInstance.post(url, signupDetails);
    },
    onSuccess: () => toast.success("Account created successfully"),
    onError: (error: AxiosError) => {
      // @ts-expect-error this is an error from axios
      toast.error(error.response?.data?.error || "An error occurred");
    },
  });
};
// Forgot password mutation
export const usePostForgotPassword = () => {
  return useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: (email: string) =>
      axiosInstance.post("/auth/reset-password-init", { email }),
    onSuccess: () => {
      toast.success("Password reset link sent to your email");
    },
    onError: (error: AxiosError) => {
      // @ts-expect-error this is an error from axios
      toast.error(error.response?.data?.error || "An error occurred");
    },
  });
};
// Reset password mutation
export const usePostResetPassword = () => {
  return useMutation({
    mutationKey: ["reset-password"],
    mutationFn: ({
      token,
      formDetails,
    }: {
      token: string;
      formDetails: {
        newPassword: string;
        confirmPassword: string;
      };
    }) =>
      axiosInstance.post(`/auth/reset-password-finish?token=${token}`, {
        newPassword: formDetails.newPassword,
      }),
    onSuccess: () => {
      toast.success("Password reset successful, you can now login");
    },
    onError: (error: AxiosError) => {
      // @ts-expect-error this is an error from axios
      toast.error(error.response?.data?.error || "An error occurred");
    },
  });
};
// Subscription mutation
export const usePostUserSubscription = () => {
  return useMutation({
    mutationFn: async (planType: string) => {
      const response = await axiosInstance.post(
        "/subscriptions/init-user-subscription",
        { planType }
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success(`You have selected the ${variables} plan`);
      if (data.data.authorizationUrl || data.data) {
        setTimeout(() => {
          window.location.href = data.data.authorizationUrl ?? data.data;
        }, 2000);
      }
    },
    onError: (error: AxiosError) => {
      // @ts-expect-error this is an error from axios
      toast.error(error.response?.data?.error || "Something went wrong!");
    },
  });
};
// Cancel booking mutation
export const usePostCancelBooking = () => {
  return useMutation({
    mutationFn: async (bookingId: string) =>
      await axiosInstance.delete(`/booking/${bookingId}`),
    onSuccess: () => {
      toast.success("Booking cancelled successfully");
      window.location.reload();
    },
    onError: (error: AxiosError) => {
      // @ts-expect-error this is an error from axios
      toast.error(error.response?.data?.error || "An error occurred");
    },
  });
};
// Change password mutation
export const useChangePassword = () => {
  return useMutation({
    mutationKey: ["change-password"],
    mutationFn: async (data: {
      oldPassword: string;
      newPassword: string;
      staffId?: string;
    }) => {
      const url = data.staffId
        ? `/auth/change-password/${data.staffId}`
        : "/auth/change-password";
      const response = await axiosInstance.post(url, {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data.error || "An error occurred. Please try again."
      );
    },
  });
};
// Update user info mutation
export const useUpdateUserInfo = () => {
  return useMutation({
    mutationKey: ["update-user-info"],
    mutationFn: async (data: {
      firstName: string;
      lastName: string;
      phoneNumber: string;
      address: string;
      staffId?: string;
    }) => {
      const url = data.staffId ? `/users/${data.staffId}` : "/users";
      const response = await axiosInstance.put(url, {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        address: data.address,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Information updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data.error || "An error occurred. Please try again."
      );
    },
  });
};
// Update agent access
export const useUpdateAgentAccess = () => {
  return useMutation({
    mutationKey: ["update-agent-access"],
    mutationFn: async (data: { id: string; isActive: boolean }) => {
      const url = data.isActive
        ? `/agents/${data.id}/revoke`
        : `/agents/${data.id}/restore`;
      const response = await axiosInstance.patch(url);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Agent access updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data.error || "An error occurred. Please try again."
      );
    },
  });
};
// Delete staff mutation
export const useDeleteStaff = () => {
  return useMutation({
    mutationKey: ["delete-staff"],
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/staff/${id}`);
    },
    onSuccess: () => {
      toast.success("Staff deleted successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data.error || "Failed to delete staff details."
      );
    },
  });
};
// Update staff mutation
export const useUpdateStaffInfo = () => {
  return useMutation({
    mutationKey: ["update-staff-info"],
    mutationFn: async (data: {
      id: string;
      name: string;
      role: string;
      phoneNumber: string;
      isAgent?: boolean;
    }) => {
      const url = data.isAgent ? `/agents/${data.id}` : `/staff/${data.id}`;
      const payload = data.isAgent
        ? { phoneNumber: data.phoneNumber, name: data.name }
        : { phoneNumber: data.phoneNumber, role: data.role };
      const response = await axiosInstance[data.isAgent ? "patch" : "put"](
        url,
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Staff details updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data.error || "Failed to update staff details."
      );
    },
  });
};
// Update staff properties mutation
export const useUpdateStaffProperties = () => {
  return useMutation({
    mutationKey: ["update-staff-properties"],
    mutationFn: async (data: {
      id: string;
      assignedPropertyIds: string[];
      isAgent?: boolean;
    }) => {
      if (data.isAgent) {
        await axiosInstance.patch(`/agents/${data.id}/properties`, {
          properties: data.assignedPropertyIds,
        });
      } else {
        await axiosInstance.post(`/staff/${data.id}/properties`, {
          propertyId: data.assignedPropertyIds,
        });
      }
    },
    onSuccess: () => {
      toast.success("Properties updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data.error || "Failed to update properties.");
    },
  });
};
// Update property mutation
export const usePropertyMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["property-mutation"],
    mutationFn: async ({
      id,
      method,
      data,
    }: {
      id?: string;
      method: "delete" | "put" | "post";
      data: any;
    }) => {
      if (method === "delete") {
        return axiosInstance.delete(`/properties/${id}`);
      } else if (method === "put" || (method === "post" && data)) {
        const formData = new FormData();
        formData.append("propertyName", data.propertyName);
        formData.append("address", data.address);
        formData.append("city", data.city);
        formData.append("country", data.country);
        formData.append("baseCurrency", data.baseCurrency);
        formData.append("owner", data.owner);
        formData.append("bedroomCount", data.bedroomCount.toString());
        formData.append("bathroomCount", data.bathroomCount.toString());
        formData.append("amenities", JSON.stringify(data.amenities));
        formData.append("price", JSON.stringify(data.price));
        data.images.forEach((image: string) => {
          formData.append("images", image);
        });

        const url = method === "post" ? "/properties" : `/properties/${id}`;
        return axiosInstance[method](url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      throw new Error("Invalid method or missing data");
    },
    onSuccess: (_, variables) => {
      const action =
        variables.method === "delete"
          ? "deleted"
          : variables.method === "post"
          ? "created"
          : "updated";
      toast.success(`Property ${action} successfully`);
      queryClient.invalidateQueries({ queryKey: ["properties"] });

      setTimeout(() => {
        navigate(`/listing/${variables.id}`);
      }, 2000);
    },
    onError: (error) => {
      const action = error.message.includes("delete")
        ? "delete"
        : error.message.includes("post")
        ? "create"
        : "update";
      toast.error(`Failed to ${action} property`);
      console.error(error);
    },
  });
};
// Create reservation mutation
export const usePostReservation = (isPublic?: boolean) => {
  return useMutation({
    mutationKey: ["post-reservation"],
    mutationFn: async (data: any) => {
      const url = isPublic ? "/public/booking" : "/booking";
      const response = await axiosInstance.post(url, data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Reservation successful");
      return data;
    },
    onError: (error: AxiosError) => {
      // @ts-expect-error this is an error from axios
      toast.error(error.response?.data.error || "An error occurred");
    },
  });
};
