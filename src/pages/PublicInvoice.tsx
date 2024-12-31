import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { CONSTANT } from "../util";
import toast from "react-hot-toast";
import StepThree from "../components/PublicBooking/StepThree";
import moment from "moment";

function PublicInvoice() {
  const { id } = useParams<{ id: string }>();
  const [invoiceId, _] = useState<string>(id || "");
  const [bookingId, setBookingId] = useState("");
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
    propertyName: "",
    propertyAddress: "",
    property: "",
    paymentStatus: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${CONSTANT.BASE_URL}/invoice/${id}`);
      if (res.status === 200) {
        const {
          endDate,
          startDate,
          firstName,
          lastName,
          guestEmail,
          guestPhone,
          numberOfGuests,
          price,
          propertyName,
          propertyAddress,
          property,
          paymentStatus,
        } = res.data.additionalInfo.booking;
        setFormDetails({
          firstName,
          lastName,
          noOfGuests: numberOfGuests,
          email: guestEmail,
          phoneNumber: guestPhone,
          checkIn: moment(startDate).format("YYYY-MM-DD"),
          checkOut: moment(endDate).format("YYYY-MM-DD"),
          price,
          propertyName,
          propertyAddress,
          property,
          countryCode: "",
          paymentStatus,
        });
        setBookingId(res.data.additionalInfo.booking._id);
      } else {
        toast.error("An error occured");
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen w-screen items-center justify-center relative">
      <Link
        to="/"
        className="absolute top-4 md:top-8 left-8 text-primary font-modak text-4xl"
      >
        Reeka
      </Link>
      <div className="flex flex-col lg:flex-row gap-6 items-start justify-center lg:justify-between max-w-4xl mx-auto w-full px-4 md:px-6 my-24 lg:my-5">
        <StepThree
          formDetails={formDetails}
          invoiceId={invoiceId}
          bookingId={bookingId}
        />
      </div>
    </div>
  );
}

export default PublicInvoice;
