import countryList from "react-select-country-list";
import thunder from "@/assets/thunder.svg";
import { Link, useLocation } from "react-router-dom";
import authBg from "@/assets/authBg.png";
import { useMemo, useState } from "react";
import Select from "react-select";
import { usePostSignUp } from "@/lib/api/mutations";
import PhoneInput from "@/components/PhoneInput";
import Spinner from "@/components/Spinner";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SignUpFormSchema } from "@/lib/schema";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

type SignUpFormType = z.infer<typeof SignUpFormSchema>;

function SignUpForm() {
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("invitationToken");

  const { mutateAsync: signUp, isPending } = usePostSignUp();

  // React Hook Form integration with Zod
  const form = useForm<SignUpFormType>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      lastName: "",
      firstName: "",
      email: "",
      address: "",
      countryCode: "",
      country: "",
      password: "",
      phoneNumber: "",
    },
  });

  const options = useMemo(() => countryList().getData(), []);

  const handleSignUp = async (data: SignUpFormType) => {
    try {
      const payload = {
        ...data,
        phoneNumber: `(${data.countryCode})${data.phoneNumber}`,
        invitationToken: token || undefined,
      };
      const response = await signUp(payload);
      if (response.status === 201) {
        setStep(1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (step === 1) {
    return (
      <div className="w-screen h-screen flex items-center justify-center px-4">
        <div className="max-w-lg flex flex-col gap-4 items-center">
          <img src={thunder} alt="Thunder" />
          <h2 className="text-[#219653] font-semibold text-4xl">
            Congratulations
          </h2>
          <p className="text-center text-[#808080] text-xl">
            Your account has been created successfully. You are ready to start
            managing your properties.
          </p>
          <Link to="/signin" className="w-full">
            <Button className="w-full">Get Started</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-stretch justify-between gap-8 px-8">
      <div className="w-full md:w-[30%] relative pb-6">
        <Link
          to="/"
          className="absolute top-4 md:top-8 left-0 text-primary font-modak text-4xl"
        >
          Reeka
        </Link>
        <h4 className="text-[#121212] text-2xl lg:text-4xl font-semibold mt-24">
          Sign Up
        </h4>
        <p className="mt-1 text-[#808080]">Enter the correct details</p>
        <Form {...form}>
          <form
            className="mt-4 flex flex-col gap-4 w-full"
            onSubmit={form.handleSubmit(handleSignUp)}
          >
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={() => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <PhoneInput
                    countryCode={form.getValues("countryCode")}
                    phoneNumber={form.getValues("phoneNumber")}
                    onCountryCodeChange={(value) =>
                      form.setValue("countryCode", value)
                    }
                    onPhoneNumberChange={(value) =>
                      form.setValue("phoneNumber", value)
                    }
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={() => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select
                    options={options}
                    placeholder="Country"
                    onChange={(value: any) =>
                      form.setValue("country", value.label)
                    }
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                      <span
                        onClick={togglePassword}
                        className="absolute top-2.5 right-3 cursor-pointer text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full text-white my-3 h-10"
              disabled={isPending}
            >
              {isPending ? <Spinner /> : "Sign Up"}
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
        <img src={authBg} />
      </div>
    </div>
  );
}

export default SignUpForm;
