import { Link, useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import authBg from "../assets/authBg.png";
import axios from "axios";
import { CONSTANT } from "../util";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";

function SignIn() {
  const user = JSON.parse(Cookies.get("user") || "{}");
  const accessToken = Cookies.get("accessToken");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to check if the token is expired
  const isTokenExpired = (token: string | null) => {
    if (!token) return true;
    try {
      // Decode the JWT token to get expiration
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace("-", "+").replace("_", "/");
      const payload = JSON.parse(window.atob(base64));
      // Check if the token is expired
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return true;
    }
  };

  // Read the redirect URL from query parameters (default to dashboard)
  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get("redirectUrl") || "/dashboard";

  useEffect(() => {
    // If the user is already logged in, redirect immediately
    if (
      user &&
      Object.keys(user).length > 0 &&
      accessToken &&
      !isTokenExpired(accessToken)
    ) {
      navigate(redirectUrl);
    }
  }, [user, accessToken, navigate, redirectUrl]);

  const [formDetails, setFormDetails] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: any) =>
    setFormDetails({
      ...formDetails,
      [e.target.name]: e.target.value,
    });

  const handleSignIn = (e: any) => {
    e.preventDefault();
    if (!formDetails.email || !formDetails.password) {
      return toast.error("All fields are required");
    }
    setLoading(true);

    axios
      .post(
        `${CONSTANT.BASE_URL}/auth/login`,
        { email: formDetails.email, password: formDetails.password },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((res) => {
        if (res.status === 200) {
          setLoading(false);
          toast.success("Logged in successfully");

          const {
            accessToken,
            refreshToken,
            firstName,
            lastName,
            userRole,
            country,
            staffId,
          } = res.data;
          Cookies.set("accessToken", accessToken, { expires: 1 });
          Cookies.set("refreshToken", refreshToken, { expires: 1 });
          Cookies.set(
            "user",
            JSON.stringify({ firstName, lastName, userRole, country, staffId }),
            { expires: 1 }
          );

          // Redirect the user back to the original URL (or dashboard by default)
          setTimeout(() => navigate(redirectUrl), 2000);
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data.error || "Invalid credentials");
        console.log(err);
      });
  };

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
            className="mt-4 flex flex-col gap-4 w-full"
            onSubmit={handleSignIn}
          >
            <div className="flex flex-col gap-1">
              <label
                className="text-[#3A3A3A] text-sm font-medium"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                placeholder="Email"
                type="email"
                name="email"
                onChange={handleChange}
                className="p-2 rounded-lg bg-transparent border border-[#808080] w-full focus-within:border-primary outline-none"
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
                placeholder="Password"
                name="password"
                onChange={handleChange}
                type="password"
                className="p-2 rounded-lg bg-transparent border border-[#808080] w-full focus-within:border-primary outline-none"
              />
            </div>
            <Link
              to="/forgot-password"
              className="text-right text-[#808080] font-medium"
            >
              Forgot Password?
            </Link>
            <button
              disabled={loading}
              type="submit"
              className="bg-primary text-white rounded-lg p-2.5 font-semibold mt-3"
            >
              {loading ? <Spinner /> : "Sign In"}
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
          <img src={authBg} alt="Authentication Background" />
        </div>
      </div>
    </div>
  );
}

export default SignIn;
