import editIcon from "../../assets/edit-01.svg";
import prop from "../../assets/prop1.svg";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { CONSTANT } from "../../util";

const bookings = localStorage.getItem("bookings");
const bookingsArray = bookings ? JSON.parse(bookings) : [];

function StepTwo({
  formDetails,
  hideFeatures,
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
  hideFeatures?: boolean;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const handleReserve = () => {
    axios
      .post(`${CONSTANT.BASE_URL}/booking`, {
        propertyId: window.crypto.randomUUID(),
        userId: "41dbe035-5d64-45ed-9b07-fb00d421080f",
        startDate: formDetails.checkIn,
        endDate: formDetails.checkOut,
        status: "Ongoing",
        sourcePlatform: "Web",
        guestFirstName: formDetails.firstName,
        guestLastName: formDetails.lastName,
        guestEmail: formDetails.email,
        guestPhone: formDetails.number,
        totalBookingValue: 200,
      })
      .then((res) => {
        bookingsArray.push(res.data);
        localStorage.setItem("bookings", JSON.stringify(bookingsArray));
        console.log(res);
        toast.success("Reservation successful");
        setStep(3);
      })
      .catch((err) => {
        console.log(err);
        toast.error("An error occured");
      });
  };
  return (
    <>
      <div
        className={`border border-[#C0C0C0] rounded-xl p-4 bg-white ${
          hideFeatures && "border-x-0 shadow"
        }`}
      >
        <Toaster />
        <h5 className="text-[#808080] font-light text-xs">Apartment</h5>
        <div className="flex w-full justify-between items-center my-3">
          <div>
            <h2 className="text-[#121212] font-semibold text-xs">Ama's Nest</h2>
            <p className="text-[#3A3A3A] font-light text-[10px]">
              24 Drive, Lagos Island, Nigeria
            </p>
          </div>
          <img
            src={editIcon}
            alt="edit"
            style={{ display: hideFeatures ? "none" : "block" }}
          />
        </div>
        <div className="w-full h-40">
          <img className="w-full h-full object-cover rounded-xl" src={prop} />
        </div>
      </div>

      <div
        className={`border border-[#C0C0C0] rounded-xl p-4 bg-white mt-1 ${
          hideFeatures && "border-x-0 shadow"
        }`}
      >
        <div className="flex w-full justify-between items-center">
          <h3 className="text-[#808080] text-xs">Details</h3>
          <img
            src={editIcon}
            alt="edit"
            style={{ display: hideFeatures ? "none" : "block" }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-3 my-2">
          <div>
            <h2 className="text-[#808080] text-xs">First Name</h2>
            <h4 className="text-[#121212] text-xs mt-0.5">
              {formDetails.firstName}
            </h4>
          </div>
          <div>
            <h2 className="text-[#808080] text-xs">Last Name</h2>
            <h4 className="text-[#121212] text-xs mt-0.5">
              {formDetails.lastName}
            </h4>
          </div>
          <div>
            <h2 className="text-[#808080] text-xs">Phone no</h2>
            <h4 className="text-[#121212] text-xs mt-0.5">
              {formDetails.number}
            </h4>
          </div>
          <div>
            <h2 className="text-[#808080] text-xs">Email</h2>
            <h4 className="text-[#121212] text-xs mt-0.5">
              {formDetails.email}
            </h4>
          </div>
          <div>
            <h2 className="text-[#808080] text-xs">Price per night</h2>
            <h4 className="text-[#121212] text-xs mt-0.5">
              {formDetails.price}
            </h4>
          </div>
          <div>
            <h2 className="text-[#808080] text-xs">Number of guest</h2>
            <h4 className="text-[#121212] text-xs mt-0.5">
              {formDetails.noOfGuests}
            </h4>
          </div>
          <div>
            <h2 className="text-[#808080] text-xs">Check-in</h2>
            <h4 className="text-[#121212] text-xs mt-0.5">
              {formDetails.checkIn}
            </h4>
          </div>
          <div>
            <h2 className="text-[#808080] text-xs">Check-out</h2>
            <h4 className="text-[#121212] text-xs mt-0.5">
              {formDetails.checkOut}
            </h4>
          </div>
        </div>
      </div>
      <div
        className={`my-3 w-full flex justify-center ${
          hideFeatures && "hidden"
        }`}
      >
        <button
          onClick={handleReserve}
          className="w-[160px] rounded-lg bg-primary text-white font-medium text-sm py-2"
        >
          Reserve
        </button>
      </div>
    </>
  );
}

export default StepTwo;
