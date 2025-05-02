import { useCurrency } from "../../helpers/getCurrency";
import buy from "../../assets/Buy.svg";

export default function Apartments({
  properties,
  setCurrentStep,
}: {
  properties: any[];
  setCurrentStep: (step: number) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
      {properties.map((property, index) => (
        <div key={index} className="flex flex-col">
          <Card property={property} setCurrentStep={setCurrentStep} />
        </div>
      ))}
    </div>
  );
}

export function Card({
  property,
  setCurrentStep,
}: {
  property: {
    price: number;
    rating: number;
    name: string;
    location: string;
    image: string;
    amenities: string[];
  };
  setCurrentStep: (step: number) => void;
}) {
  const handleCardClick = () => {
    // Handle card click event
    console.log(`Clicked on ${property.name}`);
    setCurrentStep(0);
  };
  const currency = useCurrency();
  return (
    <div
      onClick={handleCardClick}
      className="rounded-3xl p-2 pb-4 border border-[#ECECEC50] cursor-pointer space-y-2"
    >
      <img
        src={property.image}
        alt={property.name}
        className="h-[245px] object-cover rounded-2xl"
      />
      <div className="flex justify-between items-center">
        <p className="text-secondary/70 font-semibold">
          <span className="text-primary font-semibold">
            {currency}
            {property.price}
          </span>{" "}
          Night
        </p>
        <div className="flex items-center gap-1">
          <span>★</span>
          <span>{property.rating}</span>
        </div>
      </div>
      <h3 className="font-semibold">{property.name}</h3>
      <p className="text-secondary/70">{property.location}</p>

      <ul className="flex items-center gap-1 flex-wrap">
        {property.amenities.map((amenity, index) => (
          <li
            key={index}
            className="text-sm px-2.5 py-0.5 rounded-full border flex items-center gap-0.5"
          >
            <img src={buy} alt="buy" />
            {amenity}
          </li>
        ))}
      </ul>
    </div>
  );
}
