import { useNavigate } from "react-router-dom";
import StepTwo from "./StepTwo";
import axios from "axios";
import { CONSTANT } from "../../util";
import toast, { Toaster } from "react-hot-toast";

function StepThree({
  formDetails,
  setStep,
  property,
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
  property: any;
}) {
  const navigate = useNavigate();

  const handleDownload = () => {
    axios
      .get(`${CONSTANT.BASE_URL}/report/${CONSTANT.USER_ID}/pdf`, {
        responseType: "blob",
      })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "report.pdf");
        document.body.appendChild(link);
        link.click();
      })
      .catch(() => {
        toast.error("Error copying link");
      });
  };

  return (
    <div className="border border-[#C0C0C0] rounded-2xl py-5 bg-[#E6FFF1] max-w-xl w-full">
      <Toaster />
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
      />

      <div className="my-3 w-full flex gap-4 justify-center">
        <button
          onClick={() => navigate("/calendar")}
          className="w-[130px] rounded-lg bg-[#6D6D6D] text-white font-medium text-sm py-2"
        >
          View in calendar
        </button>
        <button
          onClick={handleDownload}
          className="w-[130px] rounded-lg bg-[#6D6D6D] text-white font-medium text-sm py-2"
        >
          Copy Link
        </button>
      </div>
    </div>
  );
}

export default StepThree;
