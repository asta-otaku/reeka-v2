import { Link, useLocation } from "react-router-dom";
import authBg from "@/assets/authBg.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ResetPasswordSchema } from "@/lib/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { usePostResetPassword } from "@/lib/api/mutations";

type ResetPasswordFormType = z.infer<typeof ResetPasswordSchema>;

function ResetPasswordForm() {
  const form = useForm<ResetPasswordFormType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");

  const { mutateAsync: resetPassword, isPending } = usePostResetPassword();

  const handleResetPassword = async (data: ResetPasswordFormType) => {
    try {
      await resetPassword({ token: token || "", formDetails: data });
      setTimeout(() => {
        window.location.href = "/signin";
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-stretch justify-between gap-8 px-8">
        <div className="w-full md:w-[30%] relative pb-6 flex flex-col justify-center">
          <Link
            to="/"
            className="absolute top-4 md:top-8 left-0 text-primary font-modak text-4xl"
          >
            Reeka
          </Link>
          <h4 className="text-[#121212] text-2xl lg:text-4xl font-semibold mt-24">
            Reset Password
          </h4>
          <p className="mt-1 text-[#808080]">Enter the correct details</p>
          <Form {...form}>
            <form
              className="mt-4 flex flex-col gap-4 w-full"
              onSubmit={form.handleSubmit(handleResetPassword)}
            >
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="New Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Confirm Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isPending}
                className="bg-primary text-white rounded-lg p-2.5 font-semibold my-3"
              >
                {isPending ? <Spinner /> : "Reset Password"}
              </Button>
            </form>
          </Form>
          <p className="text-[#808080] text-center font-semibold">
            Have an account?
            <Link to="/signin" className="text-primary font-semibold ml-1">
              Sign In
            </Link>
          </p>
        </div>
        <div className="w-full md:w-[65%] hidden md:block">
          <img src={authBg} alt="Background" />
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordForm;
