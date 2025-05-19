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

function StepOne({
  handleChange,
  formDetails,
  setFormDetails,
  setStep,
  property,
}: {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
    note: string;
    includeNote: boolean;
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
      note: string;
      includeNote: boolean;
      userId: string;
      countryCode: string;
    }>
  >;
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
              <h4 className="text-[#121212] text-sm font-medium">
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
                  value={`${formDetails.rateName} - ₦${formDetails.price}`}
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
          <div className="mt-2">
            <label className="text-sm font-medium text-[#121212] block mb-1">
              Booking Note
            </label>
            <textarea
              rows={3}
              placeholder="Write any note you want to include (visible on invoice if toggled below)…"
              value={formDetails.note}
              onChange={(e) =>
                setFormDetails((prev) => ({ ...prev, note: e.target.value }))
              }
              className="w-full border border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-lg px-3 py-2 text-sm text-[#667085] outline-none resize-none"
            />
          </div>

          {/* Include Note Toggle */}
          <div className="flex items-center justify-between mt-2">
            <label className="text-sm font-medium text-[#121212]">
              Include note in invoice
            </label>
            <button
              type="button"
              onClick={() =>
                setFormDetails((prev) => ({
                  ...prev,
                  includeNote: !prev.includeNote,
                }))
              }
              className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                formDetails.includeNote ? "bg-primary" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  formDetails.includeNote ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
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
