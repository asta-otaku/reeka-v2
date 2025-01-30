import { PricingCardProps } from "@/lib/types";

const PricingCard = ({
  title,
  planType,
  description,
  price,
  features,
  bgColor,
  secondaryBgColor,
  textColor,
  btnColor,
  btnTextColor,
  onSelectPlan,
}: PricingCardProps) => {
  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
      className="p-2 rounded-[32px]"
    >
      <div
        style={{ backgroundColor: secondaryBgColor }}
        className="p-4 rounded-3xl"
      >
        <h6 className="text-xs">{title}</h6>
        <h3 className="mt-2 font-medium text-base">{planType}</h3>
        <p className="text-xs max-w-[280px]">{description}</p>
        <div className="mt-6 flex w-full justify-between items-center">
          <h2 className="text-xs">
            ₦ <span className="text-xl font-bold">{price}</span> /Month
          </h2>
          <button
            onClick={() =>
              onSelectPlan(planType.toLowerCase().replace(" ", "_"))
            }
            style={{
              backgroundColor: btnColor,
              color: btnTextColor,
            }}
            className="w-24 py-2 text-sm rounded-3xl"
          >
            Get Started
          </button>
        </div>
      </div>
      <ul className="mt-6 mb-2 grid grid-cols-2 gap-2 px-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-xs list-disc">
            <div
              style={{
                backgroundColor: textColor,
              }}
              className="w-1 h-1 rounded-full"
            ></div>
            <span className="text-xs">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PricingCard;
