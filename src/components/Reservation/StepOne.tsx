import { useEffect, useState } from "react";
import { Calendar, ChevronDownIcon } from "../../assets/icons";
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
import apiClient from "../../helpers/apiClient";
import CustomPriceModal from "./CustomPriceModal";
import useStore from "../../store";
import { useCurrency } from "../../helpers/getCurrency";

export interface PropertyDetails {
  firstName: string;
  lastName: string;
  noOfGuests: string;
  email: string;
  phoneNumber: string;
  checkIn: string;
  checkOut: string;
  price: string;
  rateId: string;
  note: string;
  includeNote: boolean;
  countryCode: string;
  agentName: string;
  agentFee: string;
}

function StepOne({
  handleChange,
  formDetails,
  setFormDetails,
  setStep,
  property,
}: {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formDetails: PropertyDetails;
  setFormDetails: React.Dispatch<React.SetStateAction<PropertyDetails>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  property: any;
}) {
  const currency = useCurrency();
  const [bookedDates, setBookedDates] = useState<
    { start: string; end: string }[]
  >([]);
  const [rates, setRates] = useState<
    { rateName: string; ratePrice: number; _id: string }[] | null
  >(null);
  const [customPriceSelected, setCustomPriceSelected] = useState(false);
  const [customAgencySelected, setCustomAgencySelected] = useState(false);
  const emailRegex = new RegExp(
    `^(([^<>()[\\]\\\\.,;:\\s@"]+(\\.[^<>()[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$`
  );
  const setModal = useStore((state: any) => state.setModal);

  useEffect(() => {
    if (!formDetails.rateId && !formDetails.price) {
      setCustomPriceSelected(false);
    }
  }, [formDetails.rateId, formDetails.price]);

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
    const fetchRates = async () => {
      try {
        const response = await apiClient.get(
          `/properties/${property._id}/rates`
        );
        setRates(response.data.rateCards);
      } catch (error) {
        console.error("Failed to fetch rates:", error);
      }
    };
    fetchBookings();
    fetchRates();
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
        <form className="flex flex-col gap-4 my-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phone Number */}
            <div>
              <h4 className="text-[#121212] text-sm font-medium mb-1">
                Phone Number*
              </h4>
              <PhoneInput
                formDetails={formDetails}
                setFormDetails={setFormDetails}
              />
            </div>

            {/* Price */}
            <div className="flex flex-col gap-1 w-full">
              <h4 className="text-[#121212] text-sm font-medium">Rate*</h4>
              {!customPriceSelected ? (
                <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-lg p-2 w-full">
                  <select
                    name="price"
                    value={formDetails.rateId}
                    onChange={(e: any) => {
                      const selectedId = e.target.value;
                      if (selectedId === "custom") {
                        setModal(
                          <CustomPriceModal
                            defaultValue={formDetails.price}
                            onCancel={() => setModal(null)}
                            onConfirm={(value) => {
                              setFormDetails({
                                ...formDetails,
                                price: value,
                                rateId: "",
                              });
                              setCustomPriceSelected(true);
                              setModal(null);
                            }}
                          />
                        );
                      } else {
                        const selectedRate = rates?.find(
                          (rate) => rate._id === selectedId
                        );
                        setFormDetails({
                          ...formDetails,
                          rateId: selectedId,
                          price: selectedRate?.ratePrice.toString() || "",
                        });
                        setCustomPriceSelected(false);
                      }
                    }}
                    className="outline-none text-secondary text-xs md:text-sm font-light py-0.5 appearance-none border-none bg-transparent w-full"
                  >
                    <option value="">Select a rate</option>
                    {rates?.map((rate, index) => (
                      <option key={index} value={rate._id}>
                        {rate.rateName} - {currency}
                        {rate.ratePrice.toLocaleString()}
                      </option>
                    ))}
                    <option value="custom">Enter custom price</option>
                  </select>
                  <ChevronDownIcon width={12} />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-lg p-2 w-full -mt-1">
                    <input
                      type="number"
                      placeholder="Enter your custom price"
                      value={formDetails.price}
                      onChange={(e) =>
                        setFormDetails({
                          ...formDetails,
                          price: e.target.value,
                          rateId: "",
                        })
                      }
                      className="w-full outline-none bg-transparent text-[#667085]"
                    />
                  </div>
                  <div className="mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setCustomPriceSelected(false);
                        setFormDetails({
                          ...formDetails,
                          rateId: "",
                          price: "",
                        });
                      }}
                      className="text-xs text-primary underline hover:text-primary/80 transition"
                    >
                      Use default rate instead
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 w-full">
              <h4 className="text-[#121212] text-sm font-medium">Agent Fee*</h4>
              {!customAgencySelected ? (
                <div className="flex items-center justify-between gap-1 bg-white border border-[#D0D5DD] rounded-lg p-2 w-full">
                  <select
                    value={formDetails.agentFee}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "custom") {
                        setCustomAgencySelected(true);
                        setModal(
                          <CustomPriceModal
                            defaultValue={formDetails.agentFee}
                            onCancel={() => setModal(null)}
                            onConfirm={(value) => {
                              setFormDetails({
                                ...formDetails,
                                agentFee: value,
                              });
                              setCustomAgencySelected(true);
                              setModal(null);
                            }}
                            isAgentFee
                          />
                        );
                      } else {
                        setFormDetails({ ...formDetails, agentFee: val });
                      }
                    }}
                    className="outline-none w-full py-0.5 bg-transparent text-secondary text-sm appearance-none"
                  >
                    <option disabled>Select agent fee</option>
                    <option value="">No agent fee</option>
                    {property.agentFee != null && (
                      <option value={property.agentFee.toString()}>
                        {currency}
                        {property.agentFee.toLocaleString()}
                      </option>
                    )}
                    <option value="custom">Enter custom fee</option>
                  </select>
                  <ChevronDownIcon width={12} />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-1 bg-white border border-[#D0D5DD] rounded-lg p-2 w-full">
                    <input
                      type="number"
                      placeholder="Custom agent fee"
                      value={formDetails.agentFee}
                      onChange={(e) =>
                        setFormDetails({
                          ...formDetails,
                          agentFee: e.target.value,
                        })
                      }
                      className="w-full outline-none bg-transparent text-[#667085]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomAgencySelected(false);
                      setFormDetails({ ...formDetails, agentFee: "" });
                    }}
                    className="text-xs text-primary underline mt-1"
                  >
                    Use built-in fee instead
                  </button>
                </>
              )}
            </div>

            {/* Agency Name Row */}
            <div className="flex flex-col gap-1 w-full">
              <h4 className="text-[#121212] text-sm font-medium">Agent Name</h4>
              <div className="bg-white border border-[#D0D5DD] rounded-lg p-2 w-full">
                <input
                  type="text"
                  placeholder="Enter agent name"
                  value={formDetails.agentName}
                  onChange={(e) =>
                    setFormDetails({
                      ...formDetails,
                      agentName: e.target.value,
                    })
                  }
                  className="w-full outline-none text-[#667085]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  dateFormat="dd/MM/yyyy"
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
          {/* Note Field */}
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
      {customPriceSelected && (
        <p className="text-xs text-[#FF8C00] italic mt-2 text-center">
          Note: You have selected a custom price for this booking.
        </p>
      )}
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