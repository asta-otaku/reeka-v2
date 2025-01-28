import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import apiClient from "../helpers/apiClient";

function Pricing() {
  const [pricingPlan, setPricingPlan] = useState("");

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await apiClient.get(`/subscriptions/user-subscription`);
        if (res.data.planType) {
          // window.location.href = "/dashboard";
        }
      } catch (error) {
        console.error("Error fetching subscription data:", error);
      }
    };

    fetchPricing();
  }, []);

  useEffect(() => {
    if (pricingPlan) {
      apiClient
        .post(`/subscriptions/init-user-subscription`, {
          planType: pricingPlan,
        })
        .then((res: any) => {
          toast.success(`You have selected the ${pricingPlan} plan`);
          if (res.data.data.authorizationUrl) {
            setTimeout(() => {
              window.location.href = res.data.data.authorizationUrl;
            }, 2000);
          }
        })
        .catch((err: any) => {
          console.log(err);
          toast.error(err.response.data.error || "Something went wrong!");
        });
    }
  }, [pricingPlan]);

  return (
    <div>
      <div className="max-w-screen-2xl w-full min-h-screen mx-auto flex flex-col md:flex-row items-center justify-center gap-8 relative px-8 pb-12">
        <Link
          to="/"
          className="absolute top-4 md:top-8 left-8 text-primary font-modak text-4xl"
        >
          Reeka
        </Link>

        <div className="w-full">
          <div className="flex flex-col gap-3 text-center">
            <h5 className="text-[#808080] text-xs">REEKA</h5>
            <h2 className="text-[#121212] font-semibold text-2xl">Pricing</h2>
            <p className="text-[#808080] text-sm">
              Select the pricing models that fit your needs
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-2 w-full">
            {/* Pricing Cards */}

            <div className="p-2 rounded-[32px] bg-primary">
              <div className="p-4 rounded-3xl bg-[#E9895F]">
                <h6 className="text-white text-xs">Trial</h6>
                <h3 className="mt-2 text-white font-medium text-base">
                  Free Trial
                </h3>
                <p className="text-xs text-white max-w-[280px]">
                  Property management built for you to scale
                </p>
                <div className="mt-6 flex w-full justify-between items-center">
                  <h2 className="text-white text-xs">
                    ₦ <span className="text-xl font-bold">0</span> /Month
                  </h2>
                  <button
                    onClick={() => setPricingPlan("trial")}
                    className="bg-white text-[#121212] w-24 py-2 text-sm rounded-3xl"
                  >
                    Get Started
                  </button>
                </div>
              </div>
              <ul className="mt-6 mb-2 grid grid-cols-2 gap-2 px-4">
                <li className="flex items-center gap-2 text-xs">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <span className="text-xs text-white">
                    Up to 25 Properties
                  </span>
                </li>
                <li className="flex items-center gap-2 text-xs">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <span className="text-xs text-white">Payment Processing</span>
                </li>
                <li className="flex items-center gap-2 text-xs">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <span className="text-xs text-white">Calendar Sync</span>
                </li>
                <li className="flex items-baseline gap-2 text-xs">
                  <div className="min-w-1 min-h-1 bg-white rounded-full"></div>
                  <span className="text-xs text-white">
                    0.5% Transaction Fee on Direct Bookings
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-2 rounded-[32px] bg-[#FFE9DF]">
              <div className="p-4 rounded-3xl bg-[#FFEDE5]">
                <h6 className="text-[#121212] text-xs">Basic</h6>
                <h3 className="mt-2 text-[#121212] font-medium text-base">
                  Reeka Light
                </h3>
                <p className="text-xs text-[#121212] max-w-[280px]">
                  Basic tier to help you formalize your short-term rental
                  business
                </p>
                <div className="mt-6 flex w-full justify-between items-center">
                  <h2 className="text-[#121212] text-xs">
                    ₦ <span className="text-xl font-bold">10,000</span> /Month
                  </h2>
                  <button
                    onClick={() => setPricingPlan("reeka_light")}
                    className="bg-[#121212] text-white w-24 py-2 text-sm rounded-3xl"
                  >
                    Get Started
                  </button>
                </div>
              </div>
              <ul className="mt-6 mb-2 grid grid-cols-2 gap-2 px-4">
                <li className="flex items-center gap-2 text-xs">
                  <div className="w-1 h-1 bg-[#121212] rounded-full"></div>
                  <span className="text-xs text-[#121212]">
                    Up to 2 Properties
                  </span>
                </li>
                <li className="flex items-center gap-2 text-xs">
                  <div className="w-1 h-1 bg-[#121212] rounded-full"></div>
                  <span className="text-xs text-[#121212]">
                    Payment Processing
                  </span>
                </li>
                <li className="flex items-center gap-2 text-xs">
                  <div className="w-1 h-1 bg-[#121212] rounded-full"></div>
                  <span className="text-xs text-[#121212]">Calendar Sync</span>
                </li>
                <li className="flex items-baseline gap-2 text-xs">
                  <div className="min-w-1 min-h-1 bg-[#121212] rounded-full"></div>
                  <span className="text-xs text-[#121212]">
                    1% Transaction Fee on Direct Bookings
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-2 rounded-[32px] bg-primary">
              <div className="p-4 rounded-3xl bg-[#E9895F]">
                <h6 className="text-white text-xs">Premier</h6>
                <h3 className="mt-2 text-white font-medium text-base">
                  Reeka Premier
                </h3>
                <p className="text-xs text-white max-w-[280px]">
                  Property management built for you to scale
                </p>
                <div className="mt-6 flex w-full justify-between items-center">
                  <h2 className="text-white text-xs">
                    ₦ <span className="text-xl font-bold">20,000</span> /Month
                  </h2>
                  <button
                    onClick={() => setPricingPlan("reeka_premier")}
                    className="bg-white text-[#121212] w-24 py-2 text-sm rounded-3xl"
                  >
                    Get Started
                  </button>
                </div>
              </div>
              <ul className="mt-6 mb-2 grid grid-cols-2 gap-2 px-4">
                <li className="flex items-center gap-2 text-xs">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <span className="text-xs text-white">
                    Up to 25 Properties
                  </span>
                </li>
                <li className="flex items-center gap-2 text-xs">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <span className="text-xs text-white">Payment Processing</span>
                </li>
                <li className="flex items-center gap-2 text-xs">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <span className="text-xs text-white">Calendar Sync</span>
                </li>
                <li className="flex items-baseline gap-2 text-xs">
                  <div className="min-w-1 min-h-1 bg-white rounded-full"></div>
                  <span className="text-xs text-white">
                    0.5% Transaction Fee on Direct Bookings
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-2 rounded-[32px] bg-[#FFE9DF]">
              <div className="p-4 rounded-3xl bg-[#FFEDE5]">
                <h6 className="text-[#121212] text-xs">Pro</h6>
                <h3 className="mt-2 text-[#121212] font-medium text-base">
                  Reeka Pro
                </h3>
                <p className="text-xs text-[#121212] max-w-[280px]">
                  Our highest tier built for whatever your business could need
                </p>
                <div className="mt-6 flex w-full justify-between items-center">
                  <h2 className="text-[#121212] text-xs">
                    ₦ <span className="text-xl font-bold">50,000</span> /Month
                  </h2>
                  <button
                    onClick={() => setPricingPlan("reeka_pro")}
                    className="bg-[#121212] text-white w-24 py-2 text-sm rounded-3xl"
                  >
                    Get Started
                  </button>
                </div>
              </div>
              <ul className="mt-6 mb-2 grid grid-cols-2 gap-2 px-4">
                <li className="flex items-center gap-2 text-xs">
                  <div className="w-1 h-1 bg-[#121212] rounded-full"></div>
                  <span className="text-xs text-[#121212]">
                    Unlimited Number of Properties
                  </span>
                </li>
                <li className="flex items-center gap-2 text-xs">
                  <div className="w-1 h-1 bg-[#121212] rounded-full"></div>
                  <span className="text-xs text-[#121212]">
                    Payment Processing
                  </span>
                </li>
                <li className="flex items-center gap-2 text-xs">
                  <div className="w-1 h-1 bg-[#121212] rounded-full"></div>
                  <span className="text-xs text-[#121212]">Calendar Sync</span>
                </li>
                <li className="flex items-center gap-2 text-xs">
                  <div className="w-1 h-1 bg-[#121212] rounded-full"></div>
                  <span className="text-xs text-[#121212]">
                    Live staff Onboarding Training
                  </span>
                </li>
                <li className="flex items-baseline gap-2 text-xs">
                  <div className="min-w-1 min-h-1 bg-[#121212] rounded-full"></div>
                  <span className="text-xs text-[#121212]">
                    0.1% Transaction Fee on Direct Bookings
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
