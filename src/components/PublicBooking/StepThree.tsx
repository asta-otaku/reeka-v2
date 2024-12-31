import StepTwo from "./StepTwo";
import toast from "react-hot-toast";
import axios from "axios";
import { CONSTANT } from "../../util";

function StepThree({
  formDetails,
  invoiceId,
  bookingId,
}: {
  formDetails: {
    firstName: string;
    lastName: string;
    noOfGuests: string;
    email: string;
    phoneNumber: string;
    checkIn: string;
    checkOut: string;
    price: string;
    countryCode: string;
    propertyName: string;
    propertyAddress: string;
    property: string;
    paymentStatus: string;
  };
  invoiceId: string;
  bookingId: string;
}) {
  const handlePay = async () => {
    const res = await axios.get(`${CONSTANT.BASE_URL}/invoice/${invoiceId}`);
    if (res.status === 200) {
      const link = res.data.invoice.paymentLink;
      window.open(link, "_blank");
    } else {
      toast.error("An error occured");
    }
  };

  const handleInvoiceDownload = async () => {
    axios
      .get(`${CONSTANT.BASE_URL}/invoice/${bookingId}/pdf`, {
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `invoice-${bookingId}.pdf`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.log(error);
      });
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
          Pay Now
        </button>
      </div>
    </div>
  );
}

export default StepThree;
