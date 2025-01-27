import axiosInstance from "../services/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { SignIn, SignUp } from "../types";

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
      }
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
    mutationFn: ({ token, formDetails }: { token: string; formDetails: {
      newPassword: string;
      confirmPassword: string;
    } }) =>
      axiosInstance.post(`/auth/reset-password-finish?token=${token}`, { newPassword: formDetails.newPassword}),
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
      const response = await axiosInstance.post("/subscriptions/init-user-subscription", { planType });
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success(`You have selected the ${variables} plan`);
      if (data.data.authorizationUrl) {
        setTimeout(() => {
          window.location.href = data.data.authorizationUrl;
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
    mutationFn: async (bookingId: string) => await axiosInstance.delete(`/booking/${bookingId}`),
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