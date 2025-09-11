import { useEffect, useState } from "react";
import buy from "../../assets/Buy.svg";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import PhoneInput from "../PhoneInput";
import MapComponent from "../MapComponent";
import axios from "axios";
import { CONSTANT } from "../../util";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO, addDays } from "date-fns";

import {
  BedDouble,
  Bath,
  Wifi,
  Tv,
  Dumbbell,
  Utensils,
  AirVent,
  Flower2,
  Laptop,
  Dog,
  Flame,
  Home,
  ArrowBigUpDash,
  Shield,
  Shirt,
  Car,
  Waves,
  Heater,
} from "lucide-react";
import ImageCarousel from "./ImageCarousel";
import { formatTimestamp } from "./StepTwo";
import Spinner from "../Spinner";
import { useParams } from "react-router-dom";
import apiClient from "../../helpers/apiClient";
import { Calendar } from "../../assets/icons";

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

const amenityIconMap: Record<string, React.ReactNode> = {
  wifi: <Wifi size={18} />,
  television: <Tv size={18} />,
  gym: <Dumbbell size={18} />,
  kitchen: <Utensils size={18} />,
  "air conditioner": <AirVent size={18} />,
  "swimming pool": <Waves size={18} />,
  parking: <Car size={18} />,
  laundry: <Shirt size={18} />,
  security: <Shield size={18} />,
  elevator: <ArrowBigUpDash size={18} />,
  balcony: <Home size={18} />,
  bbq: <Flame size={18} />,
  "pet friendly": <Dog size={18} />,
  workspace: <Laptop size={18} />,
  garden: <Flower2 size={18} />,
  heater: <Heater size={18} />,
  "heat extractor": <Heater size={18} />,
  oven: <Heater size={18} />,
  griller: <Heater size={18} />,
};

function getCurrencySymbolFromProperty(property: any): string {
  // Check if property has baseCurrency and return appropriate symbol
  if (property?.baseCurrency === "NGN") {
    return "₦";
  }
  // Default to dollar symbol for USD or any other currency
  return "$";
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
    lat: parseFloat(property.latitude) || 6.5244,
    lng: parseFloat(property.longitude) || 3.3792,
  });

  const { id } = useParams();

  // Update selectedLocation when property coordinates change
  useEffect(() => {
    if (property.latitude && property.longitude) {
      setSelectedLocation({
        lat: parseFloat(property.latitude),
        lng: parseFloat(property.longitude),
      });
    }
  }, [property.latitude, property.longitude]);

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
  const isDateBooked = (date: Date) => {
    return bookedDates.some(({ start, end }) => {
      const s = dayjs(start, "YYYY-MM-DD").toDate();
      const e = dayjs(end, "YYYY-MM-DD").toDate();
      return date >= s && date <= e;
    });
  };

  const getNextBookedDate = (checkInDate: Date) => {
    const futureBookings = bookedDates.filter(({ start }) => {
      const bookingStart = dayjs(start, "YYYY-MM-DD").toDate();
      return bookingStart > checkInDate;
    });

    if (futureBookings.length > 0) {
      futureBookings.sort((a, b) => {
        const aStart = dayjs(a.start, "YYYY-MM-DD").toDate();
        const bStart = dayjs(b.start, "YYYY-MM-DD").toDate();
        return aStart.getTime() - bStart.getTime();
      });
      return dayjs(futureBookings[0].start, "YYYY-MM-DD").toDate();
    }
    return null;
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
  const calculateNights = (checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut) return 0;
    const start = dayjs(checkIn, "YYYY-MM-DD");
    const end = dayjs(checkOut, "YYYY-MM-DD");
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

  // --- Amenities logic ---
  const { amenities = {} } = property;

  // Use direct count fields for bedrooms and bathrooms
  const bedroomCount = property.bedroomCount || 0;
  const bathroomCount = property.bathroomCount || 0;
  const restAmenities = Object.entries(amenities).filter(
    ([key]) =>
      !["bedroom", "bedrooms", "bathroom", "bathrooms"].includes(
        key.toLowerCase()
      )
  );

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="space-y-2">
        <h2 className="font-semibold text-base md:text-xl">
          {property.propertyName}
        </h2>
        <p className="text-secondary font-thin text-sm">
          {property.city}, {property.country}
        </p>
      </div>
      <ImageCarousel
        images={property.images.length ? property.images : []}
        className="md:h-[400px] w-full"
        navigationSize="medium"
        paginationSize="medium"
      />
      <div className="grid grid-cols-1 md:grid-cols-10 gap-5 w-full">
        <div className="col-span-1 md:col-span-6 flex flex-col gap-4 w-full">
          <h2 className="font-semibold text-xl md:text-2xl">
            {property.propertyName}
          </h2>
          {/* Bedrooms and Bathrooms only */}
          <div className="flex gap-2 my-4 flex-wrap">
            {bedroomCount > 0 && (
              <div className="bg-[#FAFAFA] text-[#808080] border flex items-center gap-1 p-2 rounded-lg text-xs">
                <BedDouble size={16} />
                <span>
                  {bedroomCount} Bedroom{bedroomCount > 1 ? "s" : ""}
                </span>
              </div>
            )}
            {bathroomCount > 0 && (
              <div className="bg-[#FAFAFA] text-[#808080] border flex items-center gap-1 p-2 rounded-lg text-xs">
                <Bath size={16} />
                <span>
                  {bathroomCount} Bathroom{bathroomCount > 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
          {/* Amenities Section */}
          {restAmenities.length > 0 && (
            <>
              <h3 className="font-medium text-base mb-4">
                Amenities or features are available at this location
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {restAmenities.map(([facility], idx) => (
                  <div key={idx} className="flex items-center gap-4 text-xs">
                    {amenityIconMap[facility.toLowerCase()] || (
                      <img src={buy} alt="" className="w-4 h-4" />
                    )}
                    <span>{facility}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          <div className="space-y-2">
            <h2 className="text-base md:text-lg">Calendar and Availability</h2>
            <p className="text-xs text-[#3A3A3A]">
              For precise pricing, please input your travel dates.
            </p>
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
                      formDetails.checkOut
                        ? parseISO(formDetails.checkOut)
                        : null
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
          </div>
        </div>
        <div className="col-span-1 md:col-span-4 border bg-white rounded-xl shadow-black/20 shadow-sm p-4">
          <h2 className="text-[#3A3A3A] text-base md:text-lg font-medium">
            {getCurrencySymbolFromProperty(property)}
            {property.defaultRate.ratePrice.toLocaleString()}/<span>night</span>
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
              You won't be charged yet
            </p>
            <div className="space-y-2">
              <div className="flex justify-between gap-2">
                <h2 className="underline underline-offset-4 text-sm text-[#222222]">
                  {getCurrencySymbolFromProperty(property)}
                  {property.defaultRate.ratePrice.toLocaleString()} x{" "}
                  {priceDetails.nights} night
                  {priceDetails.nights !== 1 ? "s" : ""}
                </h2>
                <h5 className="">
                  {getCurrencySymbolFromProperty(property)}
                  {priceDetails.basePrice.toLocaleString()}
                </h5>
              </div>
              <div className="flex justify-between gap-2">
                <h2 className="underline underline-offset-4 text-sm text-[#222222]">
                  Caution fee
                </h2>
                <h5 className="">
                  {getCurrencySymbolFromProperty(property)}
                  {priceDetails.cautionFee.toLocaleString()}
                </h5>
              </div>
            </div>
            <hr />
            <div className="flex justify-between gap-2">
              <h2 className="font-medium text-sm text-[#222222]">
                Total before taxes
              </h2>
              <h5 className="">
                {getCurrencySymbolFromProperty(property)}
                {priceDetails.total.toLocaleString()}
              </h5>
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
