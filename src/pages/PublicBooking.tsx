import { useEffect, useState } from "react";
// import StepOne from "../components/PublicBooking/StepOne";
import StepTwo from "../components/PublicBooking/StepTwo";
import StepZero from "../components/PublicBooking/StepZero";
import Details from "../components/PublicBooking/Details";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import apiClient from "../helpers/apiClient";
import grayCheck from "../assets/graycheck.svg";
import orangeCheck from "../assets/orangecheck.svg";

function PublicBooking() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formDetails, setFormDetails] = useState({
    firstName: "",
    lastName: "",
    noOfGuests: "",
    email: "",
    phoneNumber: "",
    checkIn: "",
    checkOut: "",
    price: "",
    rateName: "",
    rateId: "",
    note: "",
    includeNote: false,
    userId: "",
    countryCode: "",
  });
  const [property, setProperty] = useState<any>(null);
  const { token, rateId } = useParams<{ token: string; rateId: string }>();
  const [steps, setSteps] = useState<string[]>([]);
  const [paymentLink, setPaymentLink] = useState("");
  const [bookingId, setBookingId] = useState("");

  useEffect(() => {
    if (rateId) {
      setSteps(["Enter Details", "Confirmation"]);
    } else {
      setSteps(["Choose Apartment", "Enter Details", "Confirmation"]);
    }
  }, [rateId]);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        if (token && rateId) {
          const response = await apiClient.get(`/public/property/${token}`, {
            params: { signedRateId: rateId },
          });
          setProperty(response.data[0]);
          setFormDetails((prev) => ({
            ...prev,
            price: response.data[0].defaultRate.ratePrice?.toString(),
            rateId: response.data[0].defaultRate._id,
            rateName: response.data[0].defaultRate.rateName,
            userId: response.data[0].id,
          }));
          setCurrentStep(1);
        }
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Failed to load property");
        console.error("Failed to fetch property:", error);
      }
    };

    if (token && rateId) {
      fetchProperty();
    } else {
      setCurrentStep(0);
    }
  }, [token, rateId]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "checkIn") {
      // Compare checkIn date with current date
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (new Date(value) < yesterday) {
        toast.error("Check-In Date cannot be earlier than today");
        return;
      }
    }

    // Check if it's the Check-Out Date field
    if (name === "checkOut") {
      // Compare checkOut date with checkIn date or current date
      const checkInDate =
        formDetails.checkIn || new Date().toLocaleDateString("en-CA");
      if (new Date(value) < new Date(checkInDate)) {
        toast.error("Check-Out Date cannot be earlier than Check-In Date");
        return;
      }
    }

    // Update form details
    setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center relative">
      <Link
        to="/"
        className="absolute top-4 md:top-8 left-8 text-primary font-modak text-4xl"
      >
        Reeka
      </Link>
      <div className="flex flex-col gap-6 items-start justify-center lg:justify-between max-w-4xl mx-auto w-full px-4 md:px-6 my-24 lg:my-5">
        <div className="flex items-center gap-0.5 md:gap-3 w-full">
          {steps.map((step, index) => (
            <div
              key={step}
              onClick={() => setCurrentStep(index)}
              className="flex-1 flex flex-col items-center cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className={`font-medium text-[10px] md:text-xs whitespace-nowrap ${
                    index <= currentStep ? "text-primary" : "text-[#808080]"
                  }`}
                >
                  {step}
                </span>
                {index < currentStep + 1 ? (
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
                  index < currentStep + 1 ? "bg-primary" : "bg-gray-200"
                }`}
              />
            </div>
          ))}
        </div>

        <div
          className={`border border-[#C0C0C0] rounded-2xl p-1.5 bg-[#FAFAFA w-full ${
            currentStep === 0 || currentStep === 3 ? "hidden" : "block"
          }`}
        >
          {property && currentStep === 1 && (
            <Details
              formDetails={formDetails}
              setFormDetails={setFormDetails}
              setCurrentStep={setCurrentStep}
              property={property}
              handleChange={handleChange}
              setPaymentLink={setPaymentLink}
              setBookingId={setBookingId}
            />
          )}
          {property && currentStep === 2 && (
            <StepTwo
              formDetails={formDetails}
              property={property}
              paymentLink={paymentLink}
              bookingId={bookingId}
            />
          )}
        </div>

        {currentStep === 0 && (
          <StepZero
            setStep={setCurrentStep}
            setProperty={setProperty}
            setFormDetails={setFormDetails}
          />
        )}
      </div>
    </div>
  );
}

export default PublicBooking;
