import React from "react";
import prop1 from "../../assets/prop1.svg";

interface ReservationSuccessProps {
  invoice: {
    amount: number;
    dueDate: string;
    status: string;
    paymentLink: string;
    booking: {
      startDate: string;
      endDate: string;
      firstName: string;
      lastName: string;
      numberOfGuests: number;
      guestEmail: string;
      guestPhone: string;
      nightsBooked: number;
      totalBookingValue: number;
      currency: string;
      price: number;
      propertyName: string;
      address: string;
      images: string[];
    };
  };
}

const ReservationSuccess: React.FC<ReservationSuccessProps> = ({ invoice }) => {
  const { booking } = invoice;
  const propertyImage = booking.images?.[0] || "";
  const currencySymbol = booking.currency === "NGN" ? "₦" : "$";

  return (
    <div
      className="rounded-[40px] overflow-hidden max-w-xl w-full mx-auto mt-8 shadow-lg relative bg-white"
      style={{ minHeight: 600 }}
    >
      {/* Background image and overlay */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src={propertyImage || prop1}
          alt="Property"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
        {/* Glassy overlay for text area */}
        <div className="absolute left-0 right-0 z-10 top-[30%] md:top-[55%] bottom-0">
          <div className="w-full h-full bg-white/20 backdrop-blur-md" />
        </div>
      </div>
      {/* Content */}
      <div className="absolute left-0 top-[30%] md:top-[55%] bottom-0 right-0 z-20 flex flex-col items-center justify-end px-3 md:px-6 pb-10 pt-10">
        <h2 className="text-white text-lg md:text-xl font-bold text-center mb-1 drop-shadow">
          Reservation successful!
        </h2>
        <p className="text-white text-sm text-center mb-6 drop-shadow">
          Email containing payment link sent to the provided email
        </p>
        <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-6 text-white text-sm drop-shadow">
          <div className="flex flex-col gap-2">
            <div>
              <span className="font-semibold">Name</span>
              <br />
              {booking.firstName} {booking.lastName}
            </div>
            <div>
              <span className="font-semibold">Duration of stay</span>
              <br />
              {booking.nightsBooked} Night{booking.nightsBooked > 1 ? "s" : ""}
            </div>
            <div>
              <span className="font-semibold">Check-in</span>
              <br />
              {new Date(booking.startDate).toLocaleDateString()}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div>
              <span className="font-semibold">Phone no</span>
              <br />
              {booking.guestPhone}
            </div>
            <div>
              <span className="font-semibold">Price per night</span>
              <br />
              {currencySymbol}
              {booking.price?.toLocaleString()}
            </div>
            <div>
              <span className="font-semibold">Check-out</span>
              <br />
              {new Date(booking.endDate).toLocaleDateString()}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div>
              <span className="font-semibold">Email</span>
              <br />
              {booking.guestEmail}
            </div>
            <div>
              <span className="font-semibold">Number of guest</span>
              <br />
              {booking.numberOfGuests}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationSuccess;
