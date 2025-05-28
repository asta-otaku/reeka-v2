import { useCurrency } from "../../helpers/getCurrency";
import buy from "../../assets/Buy.svg";

export default function Apartments({
  properties,
  setCurrentStep,
  setSelectedProperty,
}: {
  properties: any[];
  setCurrentStep: (step: number) => void;
  setSelectedProperty: (property: any) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
      {properties.map((property, index) => (
        <div key={index} className="flex flex-col">
          <Card
            property={property}
            setCurrentStep={setCurrentStep}
            setSelectedProperty={setSelectedProperty}
          />
        </div>
      ))}
    </div>
  );
}

export function Card({
  property,
  setCurrentStep,
  setSelectedProperty,
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
  setSelectedProperty: (property: any) => void;
}) {
  const handleCardClick = () => {
    setSelectedProperty(property);
    setCurrentStep(1);
  };
  const currency = useCurrency();
  return (
    <div
      onClick={handleCardClick}
      className="rounded-3xl max-w-md w-full p-2 pb-4 border border-[#ECECEC50] bg-[#FAFAFA] cursor-pointer flex flex-col gap-2"
    >
      <img
        src={property.image}
        alt={property.name}
        className="h-[245px] w-full object-cover rounded-2xl"
      />
      <div className="flex justify-between items-center">
        <p className="text-[#9E9E9E]">
          <span className="text-primary">
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
      <h3 className="font-medium">{property.name}</h3>
      <p className="text-[#9E9E9E] -mt-2 text-sm">{property.location}</p>

      <ul className="flex items-center gap-2 overflow-auto no-scrollbar w-full">
        {property.amenities.map((amenity, index) => (
          <li
            key={index}
            className="text-xs px-2.5 py-0.5 rounded-full border flex bg-white items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <img src={buy} alt="buy" />
            {amenity}
          </li>
        ))}
      </ul>
    </div>
  );
}
