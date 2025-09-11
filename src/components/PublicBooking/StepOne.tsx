import { useEffect, useState } from "react";
import { Calendar } from "../../assets/icons";
import toast from "react-hot-toast";
import PhoneInput from "../PhoneInput";
import { CONSTANT } from "../../util";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO, isWithinInterval, parse, addDays } from "date-fns";
import axios from "axios";
import prop from "../../assets/prop1.svg";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Property } from "./Details";

function getCurrencySymbolFromProperty(property: any): string {
  // Check if property has baseCurrency and return appropriate symbol
  if (property?.baseCurrency === "NGN") {
    return "₦";
  }
  // Default to dollar symbol for USD or any other currency
  return "$";
}

function StepOne({
  handleChange,
  formDetails,
  setFormDetails,
  setStep,
  property,
}: {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formDetails: Property;
  setFormDetails: React.Dispatch<React.SetStateAction<Property>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  property: any;
}) {
  const [bookedDates, setBookedDates] = useState<
    { start: string; end: string }[]
  >([]);
  const emailRegex = new RegExp(
    `^(([^<>()[\\]\\\\.,;:\\s@"]+(\\.[^<>()[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$`
  );

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `${CONSTANT.BASE_URL}/properties/${property._id}/booked-dates`
        );
        setBookedDates(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch bookings");
      }
    };
    fetchBookings();
  }, [property._id]);

  const isDateBooked = (date: Date) => {
    return bookedDates.some(({ start, end }) =>
      isWithinInterval(date, {
        start: parse(start, "yyyy-MM-dd", new Date()),
        end: parse(end, "yyyy-MM-dd", new Date()),
      })
    );
  };

  const getNextBookedDate = (checkInDate: Date) => {
    const futureBookings = bookedDates.filter(({ start }) => {
      const bookingStart = parse(start, "yyyy-MM-dd", new Date());
      return bookingStart > checkInDate;
    });

    if (futureBookings.length > 0) {
      futureBookings.sort((a, b) => {
        const aStart = parse(a.start, "yyyy-MM-dd", new Date());
        const bStart = parse(b.start, "yyyy-MM-dd", new Date());
        return aStart.getTime() - bStart.getTime();
      });
      return parse(futureBookings[0].start, "yyyy-MM-dd", new Date());
    }
    return null;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (
      !formDetails.firstName ||
      !formDetails.lastName ||
      !formDetails.noOfGuests ||
      !formDetails.email ||
      !formDetails.phoneNumber ||
      !formDetails.checkIn ||
      !formDetails.checkOut ||
      !formDetails.countryCode
    ) {
      return toast.error("Please fill all fields");
    }
    if (formDetails.email && !emailRegex.test(formDetails.email)) {
      return toast.error("Invalid email address");
    }

    const checkInDate = new Date(formDetails.checkIn);
    const checkOutDate = new Date(formDetails.checkOut);

    if (checkOutDate < checkInDate) {
      return toast.error("Check-out date cannot be before check-in date");
    }

    setStep(2);
  };

  return (
    <>
      <div className="border border-[#C0C0C0] rounded-xl p-4 bg-white">
        <h3 className="text-[#808080] font-medium text-sm">
          {property?.propertyName}
        </h3>
        <h3 className="text-[#808080] text-xs my-2">{property?.city}</h3>
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
          pagination={{
            clickable: true,
          }}
          modules={[Autoplay]}
          className="h-[120px]"
        >
          {property.images.length ? (
            property.images.map((image: any, index: number) => (
              <SwiperSlide key={index}>
                <img
                  src={image}
                  alt=""
                  className="w-full h-full object-cover rounded-lg"
                />
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <img
                src={prop}
                alt=""
                className="w-full h-full object-cover rounded-lg"
              />
            </SwiperSlide>
          )}
        </Swiper>
      </div>
      <div className="border border-[#C0C0C0] rounded-xl p-4 bg-white">
        <h4 className="font-light text-center">
          Enter the correct details required
        </h4>
        <form className="flex flex-col gap-4 my-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-[#121212] text-sm font-medium mb-2">
                Phone Number*
              </h4>
              <PhoneInput
                formDetails={formDetails}
                setFormDetails={setFormDetails}
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <h4 className="text-[#121212] text-sm font-medium">Rate</h4>
              <div className="flex items-center justify-between gap-1 bg-gray-100 border border-solid border-[#D0D5DD] rounded-lg p-2 w-full">
                <input
                  readOnly
                  value={`${getCurrencySymbolFromProperty(property)}${
                    formDetails.price
                  }`}
                  className="w-full outline-none bg-transparent text-[#667085]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 w-full">
              <h4 className="text-[#121212] text-sm font-medium">
                Check In Date
              </h4>
              <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-lg p-2 w-fit">
                <Calendar className="w-6" />
                <DatePicker
                  selected={
                    formDetails.checkIn ? parseISO(formDetails.checkIn) : null
                  }
                  onChange={(date: Date | null) =>
                    setFormDetails({
                      ...formDetails,
                      checkIn: date ? format(date, "yyyy-MM-dd") : "",
                    })
                  }
                  minDate={new Date()}
                  filterDate={(date) => !isDateBooked(date)}
                  placeholderText="Check In Date"
                  dateFormat="dd/MM/yyyy"
                  className="w-full text-[#667085]"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <h4 className="text-[#121212] text-sm font-medium">
                Check Out Date
              </h4>
              <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-lg p-2 w-fit">
                <Calendar className="w-6" />
                <DatePicker
                  selected={
                    formDetails.checkOut ? parseISO(formDetails.checkOut) : null
                  }
                  onChange={(date: Date | null) =>
                    setFormDetails({
                      ...formDetails,
                      checkOut: date ? format(date, "yyyy-MM-dd") : "",
                    })
                  }
                  minDate={
                    formDetails.checkIn
                      ? addDays(parseISO(formDetails.checkIn), 1)
                      : new Date()
                  }
                  filterDate={(date) => {
                    if (!formDetails.checkIn) return true;

                    const checkInDate = parseISO(formDetails.checkIn);
                    const nextBookedDate = getNextBookedDate(checkInDate);

                    if (nextBookedDate) {
                      return date <= nextBookedDate;
                    }
                    return !isDateBooked(date);
                  }}
                  placeholderText="Check Out Date"
                  dateFormat="dd/MM/yyyy"
                  className="w-full text-[#667085]"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="my-3 w-full flex justify-center">
        <button
          onClick={handleSubmit}
          className="w-[160px] rounded-lg bg-primary text-white font-medium text-sm py-2"
        >
          Continue
        </button>
      </div>
    </>
  );
}

export default StepOne;
