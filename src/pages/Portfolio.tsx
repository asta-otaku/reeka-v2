import { useState } from "react";
import { ArrowLongLeftIcon } from "../assets/icons";
import grayCheck from "../assets/graycheck.svg";
import orangeCheck from "../assets/orangecheck.svg";
import { DatePicker } from "antd";
import Apartments from "../components/Portfolio/Apartments";
import prop1 from "../assets/prop1.svg";
import prop2 from "../assets/prop2.svg";
import prop3 from "../assets/prop3.svg";
import prop4 from "../assets/prop4.svg";

const { RangePicker } = DatePicker;

const dummyProperties = [
  {
    price: 120,
    rating: 4.5,
    name: "Oceanview Resort",
    location: "Miami Beach, FL",
    image: prop1,
    amenities: ["Pool", "Wi-Fi", "Gym", "Spa"],
  },
  {
    price: 95,
    rating: 4.0,
    name: "Mountain Lodge",
    location: "Aspen, CO",
    image: prop2,
    amenities: ["Fireplace", "Breakfast", "Hiking Trails"],
  },
  {
    price: 150,
    rating: 4.8,
    name: "City Central Hotel",
    location: "New York, NY",
    image: prop3,
    amenities: ["Rooftop Bar", "Wi-Fi", "Parking"],
  },
  {
    price: 80,
    rating: 3.9,
    name: "Desert Oasis",
    location: "Phoenix, AZ",
    image: prop4,
    amenities: ["Pool", "Breakfast", "Pet Friendly"],
  },
  {
    price: 110,
    rating: 4.3,
    name: "Lakeside Inn",
    location: "Lake Tahoe, CA",
    image: prop1,
    amenities: ["Lake View", "Boat Rental", "Hot Tub"],
  },
];

function Portfolio() {
  const [currentStep, setCurrentStep] = useState(0);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  console.log(startDate, endDate);
  const steps = ["Choose Apartment", "Enter Details", "Confirmartion"];
  return (
    <div className="max-w-screen-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-4 md:space-y-6">
      <div className="relative">
        <div className="w-full flex justify-between items-center">
          <span
            className="p-2 rounded-full border border-[#DCDCDC] cursor-pointer"
            onClick={() => window.history.back()}
          >
            <ArrowLongLeftIcon className="w-4 text-secondary" />
          </span>
        </div>
      </div>
      {/* Steps */}
      <div className="flex items-center gap-0.5 md:gap-3 w-full">
        {steps.map((step, index) => (
          <div key={step} className="flex-1 flex flex-col items-center">
            <div className="flex items-centr justify-between w-full">
              <span
                className={`font-medium text-[10px] md:text-xs whitespace-nowrap ${
                  index === currentStep ? "text-black" : "text-[#808080]"
                }`}
              >
                {step}
              </span>
              {index <= currentStep ? (
                <img
                  src={orangeCheck}
                  alt="completed"
                  width={16}
                  height={16}
                  className="block"
                />
              ) : (
                <img
                  src={grayCheck}
                  alt="completed"
                  width={16}
                  height={16}
                  className="block"
                />
              )}
            </div>

            {/* underline */}
            <div
              className={`mt-2 h-1.5 w-full rounded-full ${
                index <= currentStep ? "bg-primary" : "bg-gray-200"
              }`}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center flex-wrap">
        <div className="space-y-1">
          <h3 className="text-[#3A3A3A] font-medium text-sm md:text-base">
            Yinka Portfolio
          </h3>
          <p className="text-[#3A3A3A] text-[10px]">25 Properties</p>
        </div>
        <RangePicker
          onChange={(dates, dateStrings) => {
            setStartDate(new Date(dateStrings[0]));
            setEndDate(new Date(dateStrings[1]));
            console.log(dates, dateStrings);
          }}
          placeholder={["Check-in", "Check-out"]}
          className="outline-none text-secondary text-xs md:text-sm rounded-xl py-2 shadow-sm bg-white"
        />
      </div>

      {
        {
          0: (
            <div>
              <Apartments
                setCurrentStep={setCurrentStep}
                properties={dummyProperties}
              />
            </div>
          ),
        }[currentStep]
      }
    </div>
  );
}

export default Portfolio;
