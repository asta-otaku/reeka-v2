import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { pricingPlans } from "@/lib/utils";
import PricingCard from "./PricingCard";
import { usePostUserSubscription } from "@/lib/api/mutations";

function Pricing() {
  const navigate = useNavigate();
  const [_, setPricingPlan] = useState("");
  const { mutate: initSubscription } = usePostUserSubscription();

  const handlePlanSelection = (planType: string) => {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    if (Object.keys(user).length === 0) {
      navigate("/signin");
    } else {
      setPricingPlan(planType);
      initSubscription(planType);
    }
  };

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
            {pricingPlans.map((plan, index) => (
              <PricingCard
                key={index}
                {...plan}
                onSelectPlan={handlePlanSelection}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
