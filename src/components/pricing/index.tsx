import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { pricingPlans } from "@/lib/utils";
import PricingCard from "./PricingCard";
import { usePostUserSubscription } from "@/lib/api/mutations";
import { useGetUserSubscription } from "@/lib/api/queries";

function Pricing() {
  const [_, setPricingPlan] = useState("");
  const { data } = useGetUserSubscription();
  const { mutate: initSubscription } = usePostUserSubscription();

  const handlePlanSelection = (planType: string) => {
    setPricingPlan(planType);
    initSubscription(planType);
  };

  useEffect(() => {
    if (data?.planType) {
      window.location.href = "/dashboard";
    }
  }, [data]);

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
