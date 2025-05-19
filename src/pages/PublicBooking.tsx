import { useEffect, useState } from "react";
import StepOne from "../components/PublicBooking/StepOne";
import StepTwo from "../components/PublicBooking/StepTwo";
import StepZero from "../components/PublicBooking/StepZero";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import apiClient from "../helpers/apiClient";

const steps = ["Apartment", "Details", "Confirmation"];

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

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        if (token && rateId) {
          const response = await apiClient.get(
            `/public/property/${token}/${rateId}`
          );
          setProperty(response.data.propertyDetails);
          setFormDetails((prev) => ({
            ...prev,
            price: response.data.ratePrice.toString(),
            rateId: response.data._id,
            rateName: response.data.rateName,
            userId: response.data.userId,
          }));
          setCurrentStep(1);
        }
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Failed to load property");
        console.error("Failed to fetch property:", error);
      }
    };

    fetchProperty();
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
      <div className="flex flex-col lg:flex-row gap-6 items-start justify-center lg:justify-between max-w-4xl mx-auto w-full px-4 md:px-6 my-24 lg:my-5">
        <div className="relative flex lg:flex-col items-start mx-auto gap-3 lg:w-2/5 lg:gap-14">
          {steps.map((step, index) => (
            <div
              onClick={() => setCurrentStep(index)}
              key={index}
              className="flex items-center cursor-pointer"
            >
              <div className="relative flex items-center">
                <div
                  className={`flex items-center justify-center h-8 w-8 text-sm rounded-full border z-10 ${
                    currentStep >= index
                      ? "border-[#C4C4C4] bg-[#F3F3F3] text-gray-500"
                      : "border-gray-300 bg-white text-[#C4C4C4]"
                  }`}
                >
                  {index + 1}
                </div>
                {index !== steps.length - 1 && (
                  <div
                    className={`absolute invisible lg:visible left-1/2 transform -translate-x-1/2 w-0.5 ${
                      currentStep > index ? "bg-gray-300" : "bg-[#F3F3F3]"
                    }`}
                    style={{
                      top: "50%",
                      height: "calc(100% + 2.5rem)",
                    }}
                  />
                )}
              </div>
              <div className="ml-2 lg:ml-4 text-sm font-light text-[#121212] invisible md:visible">
                {step}
              </div>
            </div>
          ))}
        </div>

        <div
          className={`border border-[#C0C0C0] rounded-2xl p-1.5 bg-[#FAFAFA] w-full ${
            currentStep === 0 || currentStep === 3 ? "hidden" : "block"
          }`}
        >
          {/* Render StepOne only if property is loaded */}
          {property && currentStep === 1 && (
            <StepOne
              handleChange={handleChange}
              formDetails={formDetails}
              setFormDetails={setFormDetails}
              setStep={setCurrentStep}
              property={property}
            />
          )}
          {property && currentStep === 2 && (
            <StepTwo formDetails={formDetails} property={property} />
          )}
        </div>

        {currentStep === 0 && (
          <StepZero setStep={setCurrentStep} setProperty={setProperty} />
        )}
      </div>
    </div>
  );
}

export default PublicBooking;
