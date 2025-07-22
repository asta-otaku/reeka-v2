import { useNavigate } from "react-router-dom";
import StepTwo from "./StepTwo";
import toast from "react-hot-toast";
import apiClient from "../../helpers/apiClient";
import { PropertyDetails } from "./StepOne";
import { useState } from "react";

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
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [copyUrl, setCopyUrl] = useState("");

  const handleCopy = async () => {
    const res = await apiClient.get(`/invoice/${invoiceId}`);
    if (res.status === 200) {
      const link = res.data.paymentLink;
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(link);
        toast.success("Link copied to clipboard");
      } else {
        setCopyUrl(link);
        setShowCopyModal(true);
      }
    } else {
      toast.error("An error occured");
    }
  };

  const handleLegacyCopy = () => {
    const input = document.createElement("input");
    input.value = copyUrl;
    document.body.appendChild(input);
    input.select();
    try {
      document.execCommand("copy");
      toast.success("Link copied to clipboard");
    } catch (err) {
      toast.error("Could not copy. Please copy manually.");
    }
    document.body.removeChild(input);
    setShowCopyModal(false);
  };

  return (
    <>
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
      {showCopyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md">
            <h3 className="text-lg font-semibold mb-3">Copy Payment Link</h3>
            <input
              type="text"
              value={copyUrl}
              readOnly
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-3"
              onFocus={(e) => e.target.select()}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCopyModal(false)}
                className="text-sm px-4 py-2 rounded-md border border-gray-300"
              >
                Close
              </button>
              <button
                onClick={handleLegacyCopy}
                className="text-sm px-4 py-2 rounded-md bg-primary text-white"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StepThree;
