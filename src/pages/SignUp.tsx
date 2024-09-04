import countryList from "react-select-country-list";
import thunder from "../assets/thunder.svg";
import { Link } from "react-router-dom";
import authBg from "../assets/authBg.png";
import { useState, useMemo } from "react";
import Select from "react-select";
import axios from "axios";
import { CONSTANT } from "../util";
import toast, { Toaster } from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function SignUp() {
  const [step, setStep] = useState(0);
  const [formDetails, setFormDetails] = useState({
    lastName: "",
    firstName: "",
    email: "",
    address: "",
    countryCode: "",
    country: "",
    password: "",
    phoneNumber: "",
  });

  const handleChange = (e: any) => {
    setFormDetails({ ...formDetails, [e.target.name]: e.target.value });
  };

  const handleSignUp = (e: any) => {
    e.preventDefault();
    axios
      .post(`${CONSTANT.BASE_URL}/auth/signup`, formDetails)
      .then((res) => {
        if (res.status === 201) {
          toast.success("Account created successfully");
          setTimeout(() => {
            setStep(1);
          }, 2000);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("An error occurred");
      });
  };

  const options = useMemo(() => countryList().getData(), []);

  const changeHandler = (value: any) => {
    setFormDetails({ ...formDetails, country: value?.label });
  };

  return (
    <div>
      <Toaster />
      {
        {
          0: (
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
                <form className="mt-4 flex flex-col gap-4 w-full">
                  <div className="flex flex-col gap-1">
                    <label
                      className="text-[#3A3A3A] font-medium text-sm"
                      htmlFor="lastName"
                    >
                      Last Name
                    </label>
                    <input
                      name="lastName"
                      onChange={handleChange}
                      placeholder="Last Name"
                      className="p-2 rounded-lg bg-transparent border border-[#808080] w-full focus-within:border-primary outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      className="text-[#3A3A3A] font-medium text-sm"
                      htmlFor="firstName"
                    >
                      First Name
                    </label>
                    <input
                      name="firstName"
                      onChange={handleChange}
                      placeholder="First Name"
                      className="p-2 rounded-lg bg-transparent border border-[#808080] w-full focus-within:border-primary outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      className="text-[#3A3A3A] font-medium text-sm"
                      htmlFor="email"
                    >
                      Email Address
                    </label>
                    <input
                      name="email"
                      onChange={handleChange}
                      placeholder="Email"
                      type="email"
                      className="p-2 rounded-lg bg-transparent border border-[#808080] w-full focus-within:border-primary outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      className="text-[#3A3A3A] font-medium text-sm"
                      htmlFor="address"
                    >
                      Address
                    </label>
                    <input
                      name="address"
                      onChange={handleChange}
                      placeholder="Address"
                      className="p-2 rounded-lg bg-transparent border border-[#808080] w-full focus-within:border-primary outline-none"
                    />
                  </div>
                  <div className="flex items-center">
                    <span>
                      <PhoneInput
                        onChange={(e) =>
                          setFormDetails({
                            ...formDetails,
                            countryCode: e,
                          })
                        }
                        countryCodeEditable={false}
                        disableCountryCode
                        enableSearch
                        country={"au"}
                        autoFormat={false}
                        containerStyle={{
                          border: "1px solid #F7F7F7",
                          borderStartStartRadius: 8,
                          borderEndStartRadius: 8,
                        }}
                        buttonStyle={{
                          border: "none",
                          width: 0,
                        }}
                        inputStyle={{
                          width: "80px",
                          border: "none",
                          color: "grey",
                        }}
                      />
                    </span>
                    <input
                      type="text"
                      name="phoneNumber"
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className="bg-transparent w-full py-2 px-4 border border-solid rounded-e-lg text-sm font-semibold outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <h4 className="text-[#3A3A3A] text-sm font-medium">
                      Country
                    </h4>
                    <Select
                      options={options}
                      placeholder="Country"
                      onChange={changeHandler}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      className="text-[#3A3A3A] text-sm font-medium"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                      name="password"
                      onChange={handleChange}
                      placeholder="Password"
                      type="password"
                      className="p-2 rounded-lg bg-transparent border border-[#808080] w-full focus-within:border-primary outline-none"
                    />
                  </div>
                  <button
                    onClick={handleSignUp}
                    className="bg-primary text-white rounded-lg p-2.5 font-semibold mt-3"
                  >
                    Sign Up
                  </button>
                  <p className="text-[#808080] text-center font-semibold">
                    Have an account?
                    <Link
                      to="/signin"
                      className="text-primary font-semibold ml-1"
                    >
                      Sign In
                    </Link>
                  </p>
                </form>
              </div>
              <div className="w-full md:w-[65%] hidden md:block">
                <img src={authBg} />
              </div>
            </div>
          ),
          1: (
            <div className="w-screen h-screen flex items-center justify-center px-4">
              <div className="max-w-lg flex flex-col gap-4 items-center">
                <img src={thunder} />
                <h2 className="text-[#219653] font-semibold text-4xl">
                  Congratulations
                </h2>
                <p className="text-center text-[#808080] text-xl">
                  Your account has been created successfully, you are ready to
                  start managing your properties
                </p>
                <Link to="/signin" className="w-full">
                  <button className="bg-primary text-white rounded-lg p-2.5 font-semibold mt-2 w-full">
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
          ),
        }[step]
      }
    </div>
  );
}

export default SignUp;
