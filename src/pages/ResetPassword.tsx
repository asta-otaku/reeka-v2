import { Link, useLocation } from "react-router-dom";
import authBg from "../assets/authBg.png";
import { useState } from "react";
import axios from "axios";
import { CONSTANT } from "../util";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";

function ResetPassword() {
  const [formDetails, setFormDetails] = useState({
    userId: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");

  const handleChange = (e: any) => {
    setFormDetails({ ...formDetails, [e.target.name]: e.target.value });
  };

  const handleResetPassword = (e: any) => {
    e.preventDefault();
    if (!formDetails.newPassword || !formDetails.confirmPassword) {
      return toast.error("Please fill all fields");
    }
    if (formDetails.newPassword !== formDetails.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    setLoading(true);
    axios
      .post(
        `${CONSTANT.BASE_URL}/auth/reset-password-finish?token=${token}`,
        formDetails,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setLoading(false);
          toast.success("Password reset successful, you can now login");
          setTimeout(() => {
            window.location.href = "/signin";
          }, 2000);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error(err.response?.data?.error || "An error occurred");
      });
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
          <form className="mt-4 flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-1">
              <label
                className="text-[#3A3A3A] text-sm font-medium"
                htmlFor="newPassword"
              >
                New Password
              </label>
              <input
                name="newPassword"
                onChange={handleChange}
                placeholder="New Password"
                type="password"
                className="p-2 rounded-lg bg-transparent border border-[#808080] w-full focus-within:border-primary outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                className="text-[#3A3A3A] text-sm font-medium"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                onChange={handleChange}
                placeholder="Confirm Password"
                type="password"
                className="p-2 rounded-lg bg-transparent border border-[#808080] w-full focus-within:border-primary outline-none"
              />
            </div>
            <button
              disabled={loading}
              onClick={handleResetPassword}
              className="bg-primary text-white rounded-lg p-2.5 font-semibold mt-3"
            >
              {loading ? <Spinner /> : "Reset Password"}
            </button>
            <p className="text-[#808080] text-center font-semibold">
              Have an account?
              <Link to="/signin" className="text-primary font-semibold ml-1">
                Sign In
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

export default ResetPassword;
