import StepTwo from "./StepTwo";
import toast from "react-hot-toast";
import { ReservationForm } from "@/lib/types";
import axiosInstance from "@/lib/services/axiosInstance";
import { useState } from "react";
import { useGetReport } from "@/lib/api/queries";
import Spinner from "../Spinner";

function StepThree({
  formDetails,
  invoiceId,
  bookingId,
}: {
  formDetails: ReservationForm & {
    propertyName: string;
    propertyAddress: string;
    property: string;
    paymentStatus: string;
  };
  invoiceId: string;
  bookingId: string;
}) {
  const [reportDetails, setReportDetails] = useState<{
    url: string;
    title: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const { refetch } = useGetReport(
    reportDetails?.url || "",
    reportDetails?.title || ""
  );

  const handlePay = async () => {
    const res = await axiosInstance.get(`/invoice/${invoiceId}`);
    if (res.status === 200) {
      const link = res.data.invoice.paymentLink;
      window.open(link, "_blank");
    } else {
      toast.error("An error occured");
    }
  };

  const handleInvoiceDownload = () => {
    setLoading(true);
    setReportDetails({
      url: `/invoice/${bookingId}/pdf`,
      title: `Invoice-${bookingId}`,
    });
    setTimeout(() => {
      refetch();
      setLoading(false);
    }, 500);
  };

  return (
    <div className="border border-[#C0C0C0] rounded-2xl py-5 bg-[#E6FFF1] max-w-xl mx-auto w-full">
      <h4 className="font-medium text-center text-[#219653] text-xl">
        Reservation successful!
      </h4>
      <p className="text-center text-[#6D6D6D] tetx-sm mb-2">
        Email containing payment link sent to the provided email
      </p>

      <StepTwo formDetails={formDetails} hideFeatures />

      <div className="my-3 w-full flex gap-4 justify-center">
        <button
          onClick={handleInvoiceDownload}
          className="w-[130px] rounded-lg bg-[#6D6D6D] text-white font-medium text-sm py-2"
        >
          Download Invoice
        </button>
        <button
          onClick={handlePay}
          className={`w-[130px] rounded-lg bg-[#6D6D6D] text-white font-medium text-sm py-2 ${
            formDetails.paymentStatus === "paid" ? "hidden" : ""
          }`}
        >
          {loading ? <Spinner /> : "Pay Now"}
        </button>
      </div>
    </div>
  );
}

export default StepThree;
