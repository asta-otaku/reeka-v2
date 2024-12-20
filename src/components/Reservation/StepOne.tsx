import { useEffect, useState } from "react";
import { Calendar, ChevronDownIcon } from "../../assets/icons";
import toast, { Toaster } from "react-hot-toast";
import PhoneInput from "../PhoneInput";
import axios from "axios";
import { CONSTANT } from "../../util";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO, addDays } from 'date-fns';

function StepOne({
  handleChange,
  formDetails,
  setFormDetails,
  setStep,
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
      countryCode: string;
    }>
  >;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${CONSTANT.BASE_URL}/booking/user/${CONSTANT.USER_ID}`);
        setBookings(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBookings();
  }, []);

  const isDateBooked = (date: Date) => {
    return bookings.some((booking) => {
      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);
      return date >= startDate && date <= endDate;
    });
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
        <Toaster />
        <h4 className="font-light text-center">
          Enter the correct details required
        </h4>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
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

          <div className="flex flex-col gap-1 w-full">
            <h4 className="text-[#121212] text-sm font-medium">
              Price per night*
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
          <div className="flex flex-col gap-1 w-full">
            <h4 className="text-[#121212] text-sm font-medium">
              Check In Date
            </h4>
            <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-lg p-2 w-full">
              <Calendar className="w-6" />
              <DatePicker
                 selected={formDetails.checkIn ? parseISO(formDetails.checkIn) : null}
                 onChange={(date: Date | null) => 
                   setFormDetails({ ...formDetails, checkIn: date ? format(date, 'yyyy-MM-dd') : "" })
                 }
                 minDate={new Date()} // Today or future dates
                 filterDate={(date) => !isDateBooked(date)} // Exclude booked dates
                 placeholderText="Check In Date"
                 className="w-full text-[#667085]"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <h4 className="text-[#121212] text-sm font-medium">
              Check Out Date
            </h4>
            <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-lg p-2 w-full">
              <Calendar className="w-6" />
              <DatePicker
                selected={formDetails.checkOut ? parseISO(formDetails.checkOut) : null}
                onChange={(date: Date | null) => 
                  setFormDetails({ ...formDetails, checkOut: date ? format(date, 'yyyy-MM-dd') : "" })
                }
                minDate={
                  formDetails.checkIn 
                    ? addDays(parseISO(formDetails.checkIn), 1) // At least one day after check-in
                    : new Date()
                }
                filterDate={(date) => !isDateBooked(date)} // Exclude booked dates
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