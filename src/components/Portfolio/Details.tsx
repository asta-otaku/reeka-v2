import { useEffect } from "react";
import buy from "../../assets/Buy.svg";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import PhoneInput from "../PhoneInput";
import MapComponent from "../MapComponent";

const { RangePicker } = DatePicker;

function Details({
  property,
  setCurrentStep,
  formDetails,
  setFormDetails,
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
  formDetails: {
    firstName: string;
    lastName: string;
    noOfGuests: string;
    email: string;
    phoneNumber: string;
    checkIn: string;
    checkOut: string;
    price: string;
    rateName: string;
    rateId: string;
    userId: string;
    countryCode: string;
  };
  setFormDetails: React.Dispatch<
    React.SetStateAction<{
      firstName: string;
      lastName: string;
      noOfGuests: string;
      email: string;
      phoneNumber: string;
      checkIn: string;
      checkOut: string;
      price: string;
      rateName: string;
      rateId: string;
      userId: string;
      countryCode: string;
    }>
  >;
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Details:", formDetails);
    setCurrentStep(2);
  };

  const handleDateChange = (_: any, dateStrings: [string, string]) => {
    setFormDetails((prev) => ({
      ...prev,
      checkIn: dateStrings[0],
      checkOut: dateStrings[1],
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDetails((prev) => ({
      ...prev,
      [name]: name === "noOfGuests" ? value.replace(/\D/g, "") : value,
    }));
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut) return 0;
    const start = dayjs(checkIn);
    const end = dayjs(checkOut);
    return end.diff(start, "day");
  };

  const calculatePrices = (
    price: number,
    checkIn: string,
    checkOut: string
  ) => {
    const nights = calculateNights(checkIn, checkOut);
    const basePrice = nights * price;
    const cautionFee = 100; // Fixed caution fee
    const total = basePrice + cautionFee;

    return {
      nights,
      basePrice,
      cautionFee,
      total,
    };
  };

  // Inside your component, add this before the return statement
  const priceDetails = calculatePrices(
    property.price,
    formDetails.checkIn,
    formDetails.checkOut
  );

  useEffect(() => {
    setFormDetails((prev) => ({
      ...prev,
      price: priceDetails.total.toString(),
    }));
  }, [priceDetails.total]);

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <h2 className="font-semibold text-base md:text-xl">{property.name}</h2>
        <p className="text-secondary font-thin text-sm">{property.location}</p>
      </div>
      <img src={property.image} alt="" className="w-full rounded-2xl" />
      <div className="grid grid-cols-10 gap-5 w-full">
        <div className="col-span-7 flex flex-col gap-4 w-full">
          <h2 className="font-semibold text-xl md:text-2xl">{property.name}</h2>
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
          <hr />
          <div className="space-y-2">
            <h2 className="text-base md:text-lg">Calendar and Availability</h2>
            <p className="text-xs text-[#3A3A3A]">
              For precise pricing, please input your travel dates.
            </p>
            <RangePicker
              placeholder={["Start Date", "End Date"]}
              className="w-full"
              defaultOpen
              placement="bottomLeft"
              onChange={handleDateChange}
              value={[
                formDetails.checkIn ? dayjs(formDetails.checkIn) : null,
                formDetails.checkOut ? dayjs(formDetails.checkOut) : null,
              ]}
            />
          </div>
        </div>
        <div className="col-span-3 border bg-white rounded-xl shadow-black/20 shadow-sm p-4">
          <h2 className="text-[#3A3A3A] text-base md:text-lg font-medium">
            ${property.price}
            <span>night</span>
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 my-4">
            <div className="flex flex-col gap-1 w-full">
              <h4 className="text-[#121212] text-sm font-medium">
                First Name*
              </h4>
              <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-lg p-2 w-full">
                <input
                  name="firstName"
                  value={formDetails.firstName}
                  placeholder="First Name"
                  className="w-full outline-none bg-transparent text-[#667085]"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <h4 className="text-[#121212] text-sm font-medium">Last Name*</h4>
              <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-lg p-2 w-full">
                <input
                  name="lastName"
                  value={formDetails.lastName}
                  placeholder="Last Name"
                  className="w-full outline-none bg-transparent text-[#667085]"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <h4 className="text-[#121212] text-sm font-medium">
                Number of guest*
              </h4>
              <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-lg p-2 w-full">
                <input
                  name="noOfGuests"
                  value={formDetails.noOfGuests}
                  placeholder="No of Guests"
                  className="w-full outline-none bg-transparent text-[#667085]"
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <h4 className="text-[#121212] text-sm font-medium">
                  Email address*
                </h4>
                <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-lg p-2 w-full">
                  <input
                    name="email"
                    value={formDetails.email}
                    placeholder="Email"
                    type="email"
                    className="w-full outline-none bg-transparent text-[#667085]"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <h4 className="text-[#121212] text-sm font-medium">
                  Phone Number*
                </h4>
                <PhoneInput
                  formDetails={formDetails}
                  setFormDetails={setFormDetails}
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-primary rounded-md py-2 text-white text-sm font-medium"
            >
              Reserve
            </button>
            <p className="text-center text-secondary text-xs">
              You won’t be charged yet
            </p>
            <div className="space-y-2">
              <div className="flex justify-between gap-2">
                <h2 className="underline underline-offset-4 text-sm text-[#222222]">
                  ${property.price} x {priceDetails.nights} night
                  {priceDetails.nights !== 1 ? "s" : ""}
                </h2>
                <h5 className="">${priceDetails.basePrice.toLocaleString()}</h5>
              </div>
              <div className="flex justify-between gap-2">
                <h2 className="underline underline-offset-4 text-sm text-[#222222]">
                  Caution fee
                </h2>
                <h5 className="">
                  ${priceDetails.cautionFee.toLocaleString()}
                </h5>
              </div>
            </div>
            <hr />
            <div className="flex justify-between gap-2">
              <h2 className="font-medium text-sm text-[#222222]">
                Total before taxes
              </h2>
              <h5 className="">${priceDetails.total.toLocaleString()}</h5>
            </div>
          </form>
        </div>
        <div className="flex w-full"></div>
      </div>
      <div className="-mt-40 -translate-y-[200px] -z-20">
        <MapComponent
          selectedLocation={{
            lat: 38.06766106747091,
            lng: -86.57523709349334,
          }}
        />
      </div>
    </div>
  );
}

export default Details;
