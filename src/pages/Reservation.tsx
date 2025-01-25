import { useState } from "react";
import DashboardNav from "../components/DashboardNav";
import DashboardLayout from "../components/layouts/DashboardLayout";
import StepOne from "../components/Reservation/StepOne";
import StepTwo from "../components/Reservation/StepTwo";
import StepThree from "../components/Reservation/StepThree";
import StepZero from "../components/Reservation/StepZero";
import toast from "react-hot-toast";

const steps = ["Apartment", "Details", "Confirmation"];

function Reservation() {
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
    countryCode: "",
  });
  const [property, setProperty] = useState<any>(null);
  const [invoiceId, setInvoiceId] = useState("");

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
    <DashboardLayout>
      <div>
        <DashboardNav
          title="Reservation"
          description="Create, edit, and send reservations."
        />

        <div className="flex flex-col lg:flex-row gap-6 items-start justify-center lg:justify-between max-w-4xl mx-auto w-full px-6 my-5">
          <div className="relative flex lg:flex-col items-start gap-3 lg:gap-14">
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
            className={`border border-[#C0C0C0] rounded-2xl p-1.5 bg-[#FAFAFA] max-w-xl w-full ${
              currentStep === 0 || currentStep === 3 ? "hidden" : "block"
            }`}
          >
            {
              {
                1: (
                  <StepOne
                    handleChange={handleChange}
                    formDetails={formDetails}
                    setFormDetails={setFormDetails}
                    setStep={setCurrentStep}
                    property={property}
                  />
                ),
                2: (
                  <StepTwo
                    formDetails={formDetails}
                    setStep={setCurrentStep}
                    property={property}
                    setInvoiceId={setInvoiceId}
                  />
                ),
              }[currentStep]
            }
          </div>

          {currentStep === 0 && (
            <StepZero setStep={setCurrentStep} setProperty={setProperty} />
          )}
          {currentStep === 3 && (
            <StepThree
              setStep={setCurrentStep}
              formDetails={formDetails}
              property={property}
              invoiceId={invoiceId}
              setInvoiceId={setInvoiceId}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Reservation;
