import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { CONSTANT } from "../util";
import toast from "react-hot-toast";
import moment from "moment";
import ReservationSuccess from "../components/PublicBooking/ReservationSuccess";

function PortfolioSuccess() {
  const { id } = useParams<{ id: string }>();
  const [paymentLink, setPaymentLink] = useState("");
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
    cautionFee: "",
    paymentStatus: "",
    images: [],
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
          cautionFee,
          paymentStatus,
          images,
        } = res.data.booking;
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
          cautionFee,
          countryCode: "",
          paymentStatus,
          images,
        });
        setPaymentLink(res.data.paymentLink);
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
        <ReservationSuccess
          invoice={{
            amount: Number(formDetails.price),
            dueDate: "", // or the actual due date if available
            status: formDetails.paymentStatus || "",
            paymentLink: paymentLink,
            booking: {
              startDate: formDetails.checkIn,
              endDate: formDetails.checkOut,
              firstName: formDetails.firstName,
              lastName: formDetails.lastName,
              numberOfGuests: Number(formDetails.noOfGuests),
              guestEmail: formDetails.email,
              guestPhone: formDetails.phoneNumber,
              nightsBooked: 1, // or calculate if available
              totalBookingValue: Number(formDetails.price),
              currency: "NGN", // or your actual currency
              price: Number(formDetails.price),
              propertyName: formDetails.propertyName,
              address: formDetails.propertyAddress,
              images: formDetails.images,
            },
          }}
        />
      </div>
    </div>
  );
}

export default PortfolioSuccess;
