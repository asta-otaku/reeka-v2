import StepTwo from "./StepTwo";

function StepThree({
  formDetails,
  setStep,
}: {
  formDetails: {
    firstName: string;
    lastName: string;
    noOfGuests: string;
    email: string;
    number: string;
    checkIn: string;
    checkOut: string;
    price: string;
  };
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <div className="border border-[#C0C0C0] rounded-2xl py-5 bg-[#E6FFF1] max-w-xl w-full">
      <h4 className="font-medium text-center text-[#219653] text-xl">
        Reservation successful!
      </h4>
      <p className="text-center text-[#6D6D6D] tetx-sm mb-2">
        Email containing payment link sent to the provided email
      </p>

      <StepTwo setStep={setStep} formDetails={formDetails} hideFeatures />

      <div className="my-3 w-full flex gap-4 justify-center">
        <button className="w-[130px] rounded-lg bg-[#6D6D6D] text-white font-medium text-sm py-2">
          View in calendar
        </button>
        <button className="w-[130px] rounded-lg bg-[#6D6D6D] text-white font-medium text-sm py-2">
          Copy Link
        </button>
      </div>
    </div>
  );
}

export default StepThree;
