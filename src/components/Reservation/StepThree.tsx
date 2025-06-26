import { useNavigate } from "react-router-dom";
import StepTwo from "./StepTwo";
import toast from "react-hot-toast";
import apiClient from "../../helpers/apiClient";
import { PropertyDetails } from "./StepOne";

function StepThree({
  formDetails,
  setStep,
  property,
  invoiceId,
  setInvoiceId,
}: {
  formDetails: PropertyDetails;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  property: any;
  invoiceId: string;
  setInvoiceId: React.Dispatch<React.SetStateAction<string>>;
}) {
  const navigate = useNavigate();
  const handleCopy = async () => {
    const res = await apiClient.get(`/invoice/${invoiceId}`);
    if (res.status === 200) {
      const link = res.data.paymentLink;
      navigator.clipboard.writeText(link);
      toast.success("Link copied to clipboard");
    } else {
      toast.error("An error occured");
    }
  };

  return (
    <div className="border border-[#C0C0C0] rounded-2xl py-5 bg-[#E6FFF1] max-w-xl w-full">
      <h4 className="font-medium text-center text-[#219653] text-xl">
        Reservation successful!
      </h4>
      <p className="text-center text-[#6D6D6D] tetx-sm mb-2">
        Email containing payment link sent to the provided email
      </p>

      <StepTwo
        setStep={setStep}
        formDetails={formDetails}
        hideFeatures
        property={property}
        setInvoiceId={setInvoiceId}
      />

      <div className="my-3 w-full flex gap-4 justify-center">
        <button
          onClick={() => navigate("/calendar")}
          className="w-[130px] rounded-lg bg-[#6D6D6D] text-white font-medium text-sm py-2"
        >
          View in calendar
        </button>
        <button
          onClick={handleCopy}
          className="w-[130px] rounded-lg bg-[#6D6D6D] text-white font-medium text-sm py-2"
        >
          Copy Link
        </button>
      </div>
    </div>
  );
}

export default StepThree;
