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
    try {
      const res = await apiClient.get(`/invoice/${invoiceId}`);
      if (res.status === 200) {
        const link = res.data.paymentLink;

        // Check if modern clipboard API is available and we're in a secure context
        const isClipboardSupported =
          navigator.clipboard &&
          typeof navigator.clipboard.writeText === "function" &&
          window.isSecureContext;

        if (isClipboardSupported) {
          try {
            await navigator.clipboard.writeText(link);
            toast.success("Link copied to clipboard");
          } catch (clipboardError) {
            console.warn(
              "Clipboard API failed, falling back to modal:",
              clipboardError
            );
            setCopyUrl(link);
            setShowCopyModal(true);
          }
        } else {
          // Fallback for environments where clipboard API is not available
          setCopyUrl(link);
          setShowCopyModal(true);
        }
      } else {
        toast.error("An error occurred");
      }
    } catch (error) {
      console.error("Error copying payment link:", error);
      toast.error("Failed to copy payment link");
    }
  };

  const handleLegacyCopy = () => {
    const input = document.createElement("input");
    input.value = copyUrl;
    input.style.position = "absolute";
    input.style.left = "-9999px";
    input.style.opacity = "0";
    document.body.appendChild(input);

    try {
      // For mobile browsers, focus and select
      input.focus();
      input.select();
      input.setSelectionRange(0, copyUrl.length);

      // Try the modern clipboard API first
      if (
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function"
      ) {
        navigator.clipboard
          .writeText(copyUrl)
          .then(() => {
            toast.success("Link copied to clipboard");
            setShowCopyModal(false);
          })
          .catch(() => {
            // Fallback to execCommand
            const success = document.execCommand("copy");
            if (success) {
              toast.success("Link copied to clipboard");
            } else {
              toast.error("Could not copy. Please copy manually.");
            }
            setShowCopyModal(false);
          });
      } else {
        // Legacy fallback
        const success = document.execCommand("copy");
        if (success) {
          toast.success("Link copied to clipboard");
        } else {
          toast.error("Could not copy. Please copy manually.");
        }
        setShowCopyModal(false);
      }
    } catch (err) {
      console.error("Copy failed:", err);
      toast.error("Could not copy. Please copy manually.");
      setShowCopyModal(false);
    } finally {
      document.body.removeChild(input);
    }
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
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold mb-3">Copy Payment Link</h3>
            <div className="relative mb-3">
              <input
                type="text"
                value={copyUrl}
                readOnly
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm pr-20"
                onFocus={(e) => e.target.select()}
              />
              <button
                onClick={() => {
                  const input = document.querySelector(
                    "input[readonly]"
                  ) as HTMLInputElement;
                  if (input) {
                    input.select();
                    input.setSelectionRange(0, copyUrl.length);
                  }
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-blue-600 hover:text-blue-800"
              >
                Select All
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleLegacyCopy}
                className="flex-1 text-sm px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={() => setShowCopyModal(false)}
                className="flex-1 text-sm px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StepThree;
