import { z } from "zod";

export const SignInFormSchema = z.object({
  email: z.string().email().min(4, {
    message: "Enter a valid email address",
  }),
  password: z.string().min(4, {
    message: "Password must contain at least 4 character(s)",
  }),
});

export const SignUpFormSchema = z.object({
  lastName: z.string().min(1, { message: "Last Name is required" }),
  firstName: z.string().min(1, { message: "First Name is required" }),
  email: z.string().email({ message: "Enter a valid email address" }),
  address: z.string().min(1, { message: "Address is required" }),
  countryCode: z.string().min(1, { message: "Country code is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
});

export const ResetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(4, "Password must be at least 4 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
