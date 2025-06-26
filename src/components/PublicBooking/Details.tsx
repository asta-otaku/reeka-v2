import { useEffect, useState } from "react";
import buy from "../../assets/Buy.svg";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import PhoneInput from "../PhoneInput";
import MapComponent from "../MapComponent";
import axios from "axios";
import { CONSTANT } from "../../util";
import toast from "react-hot-toast";
import prop from "../../assets/prop1.svg";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import { Autoplay } from "swiper/modules";
import { formatTimestamp } from "./StepTwo";
import Spinner from "../Spinner";
import { useParams } from "react-router-dom";
import apiClient from "../../helpers/apiClient";

const { RangePicker } = DatePicker;
interface BookingRange {
  start: string;
  end: string;
}
export interface Property {
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
  paymentStatus?: string;
}

function Details({
  property,
  setCurrentStep,
  formDetails,
  setFormDetails,
  handleChange,
  setPaymentLink,
  setBookingId,
}: {
  property: any;
  setCurrentStep: (step: number) => void;
  formDetails: Property;
  setFormDetails: React.Dispatch<React.SetStateAction<Property>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setPaymentLink: React.Dispatch<React.SetStateAction<string>>;
  setBookingId: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [bookedDates, setBookedDates] = useState<BookingRange[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    lat: property.latitude || 6.5244,
    lng: property.longtitude || 3.3792,
  });

  const { id } = useParams();

  useEffect(() => {
    axios
      .get<BookingRange[]>(
        `${CONSTANT.BASE_URL}/properties/${property._id}/booked-dates`
      )
      .then((res) => setBookedDates(res.data))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch existing bookings");
      });
  }, [property._id]);
  const isDateBooked = (date: Date) =>
    bookedDates.some(({ start, end }) => {
      const s = dayjs(start, "YYYY-MM-DD").toDate();
      const e = dayjs(end, "YYYY-MM-DD").toDate();
      return date >= s && date <= e;
    });

  const getNextBookedDate = (checkIn: Date): Date | null => {
    const future = bookedDates
      .map((b) => ({
        start: dayjs(b.start, "YYYY-MM-DD").toDate(),
        end: dayjs(b.end, "YYYY-MM-DD").toDate(),
      }))
      .filter((b) => b.start > checkIn)
      .sort((a, b) => a.start.getTime() - b.start.getTime());

    return future.length ? future[0].start : null;
  };
  const disabledDate = (current: Dayjs) => {
    const date = current.toDate();
    if (date < dayjs().startOf("day").toDate()) return true;
    if (isDateBooked(date)) return true;
    if (formDetails.checkIn) {
      const checkInDate = dayjs(formDetails.checkIn, "YYYY-MM-DD").toDate();
      if (date <= checkInDate) return true;
      const next = getNextBookedDate(checkInDate);
      if (next && date > next) return true;
    }
    return false;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      firstName,
      lastName,
      noOfGuests,
      email,
      phoneNumber,
      checkIn,
      checkOut,
      countryCode,
      price,
      rateId,
      note,
      includeNote,
    } = formDetails;

    if (
      !firstName ||
      !lastName ||
      !noOfGuests ||
      !email ||
      !phoneNumber ||
      !checkIn ||
      !checkOut ||
      !countryCode
    ) {
      return toast.error("Please fill in all required fields");
    }

    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
      return toast.error("Invalid email address");
    }

    if (dayjs(checkOut).isBefore(dayjs(checkIn))) {
      return toast.error("Check-out must be after check-in");
    }

    const payload = {
      propertyId: property?._id,
      startDate: formatTimestamp(checkIn),
      endDate: formatTimestamp(checkOut),
      guestFirstName: firstName,
      guestLastName: lastName,
      guestEmail: email,
      guestPhone: `(${countryCode})${phoneNumber}`,
      countryCode,
      numberOfChildren: 0,
      numberOfGuests: noOfGuests,
      priceState: Number(price) || 0,
      rateId,
      note,
      includeNote,
    };

    setLoading(true);
    const apiEndpoint = location.pathname.includes("/agent")
      ? `/agents/${id}/booking`
      : `/public/booking`;

    try {
      // Step 1: Create booking
      const res = await apiClient.post(apiEndpoint, payload);
      const invoiceId = res.data.invoices[res.data.invoices.length - 1];

      // Step 2: Fetch booking details using the invoice ID
      const fetchRes = await axios.get(
        `${CONSTANT.BASE_URL}/invoice/${invoiceId}`
      );

      if (fetchRes.status === 200) {
        const { propertyName, propertyAddress, paymentStatus } =
          fetchRes.data.booking;

        setFormDetails((prev) => ({
          ...prev,
          propertyName,
          propertyAddress,
          paymentStatus,
        }));

        setPaymentLink(fetchRes.data.paymentLink);
        setBookingId(fetchRes.data.booking._id);

        // Now proceed to next step
        setCurrentStep(2);
      } else {
        toast.error("An error occurred while fetching invoice data");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const onRangeChange = (_: any, [start, end]: [string, string]) => {
    setFormDetails((f) => ({
      ...f,
      checkIn: start,
      checkOut: end,
    }));
  };
  const calculateNights = (checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut) return 0;
    const start = dayjs(checkIn, "DD/MM/YYYY");
    const end = dayjs(checkOut, "DD/MM/YYYY");
    return end.diff(start, "day");
  };

  const calculatePrices = (
    price: number,
    checkIn: string,
    checkOut: string
  ) => {
    const nights = calculateNights(checkIn, checkOut);
    const basePrice = nights * price;
    const cautionFee = property.price.cautionFee || 0;
    const total = basePrice + cautionFee;

    return {
      nights,
      basePrice,
      cautionFee,
      total,
    };
  };

  const priceDetails = calculatePrices(
    property.defaultRate.ratePrice,
    formDetails.checkIn,
    formDetails.checkOut
  );

  useEffect(() => {
    setFormDetails((prev) => ({
      ...prev,
      price: property.defaultRate.ratePrice.toString(),
    }));
  }, [property]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="space-y-2">
        <h2 className="font-semibold text-base md:text-xl">
          {property.propertyName}
        </h2>
        <p className="text-secondary font-thin text-sm">{property.city}</p>
      </div>
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
        className="md:h-[400px] w-full rounded-lg"
      >
        {property.images.length ? (
          property.images.map((image: any, index: number) => (
            <SwiperSlide key={index}>
              <img
                src={image}
                alt=""
                className="object-cover max-w-screen-2xl rounded-lg w-full"
              />
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <img
              src={prop}
              alt=""
              className="object-cover max-w-screen-2xl w-full rounded-lg"
            />
          </SwiperSlide>
        )}
      </Swiper>
      <div className="grid grid-cols-1 md:grid-cols-10 gap-5 w-full">
        <div className="col-span-1 md:col-span-6 flex flex-col gap-4 w-full">
          <h2 className="font-semibold text-xl md:text-2xl">
            {property.propertyName}
          </h2>
          <div className="flex gap-2 my-4 flex-wrap">
            {Object.keys(property?.amenities).length > 0
              ? Object.keys(property?.amenities).map((facility, index) => (
                  <div
                    key={index}
                    className="bg-[#FAFAFA] text-[#808080] border flex items-center gap-1 p-2 rounded-lg text-xs"
                  >
                    <img src={buy} alt="buy" />
                    <span>{facility}</span>
                  </div>
                ))
              : null}
          </div>
          <hr />
          <div className="space-y-2">
            <h2 className="text-base md:text-lg">Calendar and Availability</h2>
            <p className="text-xs text-[#3A3A3A]">
              For precise pricing, please input your travel dates.
            </p>
            <RangePicker
              format="DD/MM/YYYY"
              className="w-full"
              onChange={onRangeChange}
              disabledDate={disabledDate}
            />
          </div>
        </div>
        <div className="col-span-1 md:col-span-4 border bg-white rounded-xl shadow-black/20 shadow-sm p-4">
          <h2 className="text-[#3A3A3A] text-base md:text-lg font-medium">
            ₦{property.defaultRate.ratePrice.toLocaleString()}/
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
              {loading ? <Spinner /> : "Continue"}
            </button>
            <p className="text-center text-secondary text-xs">
              You won’t be charged yet
            </p>
            <div className="space-y-2">
              <div className="flex justify-between gap-2">
                <h2 className="underline underline-offset-4 text-sm text-[#222222]">
                  ₦{property.defaultRate.ratePrice.toLocaleString()} x{" "}
                  {priceDetails.nights} night
                  {priceDetails.nights !== 1 ? "s" : ""}
                </h2>
                <h5 className="">₦{priceDetails.basePrice.toLocaleString()}</h5>
              </div>
              <div className="flex justify-between gap-2">
                <h2 className="underline underline-offset-4 text-sm text-[#222222]">
                  Caution fee
                </h2>
                <h5 className="">
                  ₦{priceDetails.cautionFee.toLocaleString()}
                </h5>
              </div>
            </div>
            <hr />
            <div className="flex justify-between gap-2">
              <h2 className="font-medium text-sm text-[#222222]">
                Total before taxes
              </h2>
              <h5 className="">₦{priceDetails.total.toLocaleString()}</h5>
            </div>
          </form>
        </div>
        <div className="flex w-full"></div>
      </div>
      <div>
        <MapComponent
          selectedLocation={selectedLocation}
          onLocationChange={(newLocation) => setSelectedLocation(newLocation)}
          interactive={true}
        />
      </div>
    </div>
  );
}

export default Details;
