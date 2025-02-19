import authBg from "@/assets/authBg.png";
import Spinner from "@/components/Spinner";
import { isTokenExpired } from "@/lib/utils";

import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignInFormSchema } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usePostSignIn } from "@/lib/api/mutations";
import { Input } from "../ui/input";

function SignInForm() {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const accessToken = sessionStorage.getItem("accessToken");
  const { mutateAsync: logIn, isPending } = usePostSignIn();

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      user &&
      Object.keys(user).length > 0 &&
      accessToken &&
      !isTokenExpired(accessToken)
    ) {
      navigate("/dashboard");
    }
  }, [user, accessToken]);

  const { handleSubmit, register, formState } = useForm<
    z.infer<typeof SignInFormSchema>
  >({
    resolver: zodResolver(SignInFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { errors } = formState;

  async function onSubmit(data: z.infer<typeof SignInFormSchema>) {
    const response = await logIn({
      email: data.email,
      password: data.password,
    });
    const {
      accessToken,
      refreshToken,
      firstName,
      lastName,
      userRole,
      country,
      staffId,
    } = response.data;
    sessionStorage.setItem("accessToken", accessToken);
    sessionStorage.setItem("refreshToken", refreshToken);
    sessionStorage.setItem(
      "user",
      JSON.stringify({ firstName, lastName, userRole, country, staffId })
    );

    setTimeout(() => navigate("/dashboard"), 2000);
  }

  return (
    <div>
      <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative px-8">
        <Link
          to="/"
          className="absolute top-4 md:top-8 left-8 text-primary font-modak text-4xl"
        >
          Reeka
        </Link>
        <div className="w-full md:w-[30%] mt-24 lg:mt-16">
          <h4 className="text-[#121212] text-2xl lg:text-4xl font-semibold">
            Sign In
          </h4>
          <p className="mt-1 text-[#808080]">Enter the correct details</p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-4 flex flex-col gap-4 w-full"
          >
            <div className="flex flex-col gap-1">
              <label
                className="text-[#3A3A3A] text-sm font-medium"
                htmlFor="email"
              >
                Email Address
              </label>
              <Input
                placeholder="Email"
                className="!rounded-lg !h-12"
                {...register("email")}
              />
              {errors.email && (
                <div className="text-red-500 text-sm font-normal pt-1">
                  {errors.email?.message}
                </div>
              )}
            </div>
            <div className="w-full relative flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <label className="font-medium text-sm text-[#141920]">
                  Password
                </label>
                <Input
                  placeholder="Password"
                  className="!rounded-lg !h-12"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                />
                {errors.password && (
                  <div className="text-red-500 text-sm font-normal pt-1">
                    {errors.password?.message}
                  </div>
                )}
              </div>

              <span
                onClick={togglePassword}
                className=" absolute top-[40px] right-4"
              >
                {!showPassword ? (
                  <Eye className="cursor-pointer w-4 text-[#6D6D6D]" />
                ) : (
                  <EyeOff className="cursor-pointer w-4 text-[#6D6D6D]" />
                )}
              </span>
            </div>
            <Link
              to="/forgot-password"
              className="text-right text-[#808080] font-medium"
            >
              Forgot Password?
            </Link>
            <button
              disabled={isPending}
              type="submit"
              className="bg-primary text-white rounded-lg p-2.5 font-semibold mt-3"
            >
              {isPending ? <Spinner /> : "Sign In"}
            </button>
            <p className="text-[#808080] text-center font-semibold">
              Don't have an account?
              <Link to="/signup" className="text-primary font-semibold ml-1">
                Signup
              </Link>
            </p>
          </form>
        </div>
        <div className="w-full md:w-[65%] hidden md:block">
          <img src={authBg} />
        </div>
      </div>
    </div>
  );
}

export default SignInForm;
