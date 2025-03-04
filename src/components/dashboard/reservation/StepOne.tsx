import { Calendar, ChevronDownIcon } from "@/assets/icons";
import toast from "react-hot-toast";
import PhoneInput from "@/components/PhoneInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO, addDays, isWithinInterval, parse } from "date-fns";
import prop from "@/assets/prop1.svg";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Property, ReservationForm } from "@/lib/types";
import { emailRegex } from "@/lib/utils";
import { useGetBookedDates } from "@/lib/api/queries";

function StepOne({
  handleChange,
  formDetails,
  setFormDetails,
  setStep,
  property,
}: {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formDetails: ReservationForm;
  setFormDetails: React.Dispatch<React.SetStateAction<ReservationForm>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  property: Property;
}) {
  const { data: bookedDates = [] } = useGetBookedDates(property._id);

  const isDateBooked = (date: Date) => {
    return bookedDates.some(({ start, end }) =>
      isWithinInterval(date, {
        start: parse(start, "yyyy-MM-dd", new Date()),
        end: parse(end, "yyyy-MM-dd", new Date()),
      })
    );
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
      !formDetails.price ||
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
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {/* First Name */}
          <div className="flex flex-col gap-1 w-full">
            <h4 className="text-[#121212] text-sm font-medium">First Name*</h4>
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

          {/* Last Name */}
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

          {/* No. of Guests */}
          <div className="flex flex-col gap-1 w-full">
            <h4 className="text-[#121212] text-sm font-medium">
              Number of Guests*
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

          {/* Email */}
          <div className="flex flex-col gap-1 w-full">
            <h4 className="text-[#121212] text-sm font-medium">
              Email Address*
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

          {/* Phone Number */}
          <div>
            <h4 className="text-[#121212] text-sm font-medium">
              Phone Number*
            </h4>
            <PhoneInput
              countryCode={formDetails.countryCode}
              phoneNumber={formDetails.phoneNumber}
              onCountryCodeChange={(code) =>
                setFormDetails({ ...formDetails, countryCode: code })
              }
              onPhoneNumberChange={(number) =>
                setFormDetails({ ...formDetails, phoneNumber: number })
              }
            />
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1 w-full">
            <h4 className="text-[#121212] text-sm font-medium">
              Price per Night*
            </h4>
            <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-lg p-2 w-full">
              <select
                name="price"
                value={formDetails.price}
                onChange={(e: any) =>
                  setFormDetails({ ...formDetails, price: e.target.value })
                }
                className="outline-none text-secondary text-xs md:text-sm font-light appearance-none border-none bg-transparent w-full"
              >
                <option value="">Select price</option>
                <option value="base">Base</option>
                <option value="low">Low</option>
                <option value="high">High</option>
              </select>
              <ChevronDownIcon width={12} />
            </div>
          </div>

          {/* Check In Date */}
          <div className="flex flex-col gap-1 w-full">
            <h4 className="text-[#121212] text-sm font-medium">
              Check In Date
            </h4>
            <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-lg p-2 w-full">
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
                className="w-full text-[#667085]"
              />
            </div>
          </div>

          {/* Check Out Date */}
          <div className="flex flex-col gap-1 w-full">
            <h4 className="text-[#121212] text-sm font-medium">
              Check Out Date
            </h4>
            <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-lg p-2 w-full">
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
                filterDate={(date) => !isDateBooked(date)}
                placeholderText="Check Out Date"
                className="w-full text-[#667085]"
              />
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
