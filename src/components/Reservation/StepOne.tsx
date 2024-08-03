import { Calendar } from "../../assets/icons";

function StepOne({
  handleChange,
  formDetails,
}: {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formDetails: {
    name: string;
    noOfGuests: string;
    email: string;
    number: string;
    duration: string;
    checkIn: string;
    checkOut: string;
    price: string;
  };
}) {
  return (
    <div className="border border-[#C0C0C0] rounded-xl p-4 bg-white">
      <h4 className="font-light text-center">
        Enter the correct details required
      </h4>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div className="flex flex-col gap-1 w-full">
          <h4 className="text-[#121212] text-sm font-medium">Name*</h4>
          <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-lg p-2 w-full">
            <input
              name="name"
              value={formDetails.name}
              placeholder="Name"
              className="w-full outline-none bg-transparent text-[#667085]"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <h4 className="text-[#121212] text-sm font-medium">
            Number of guest*
          </h4>
          <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-lg p-2 w-full">
            <input
              name="noOfGuests"
              value={formDetails.noOfGuests}
              placeholder="No of Guests"
              className="w-full outline-none bg-transparent text-[#667085]"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <h4 className="text-[#121212] text-sm font-medium">Email address*</h4>
          <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-lg p-2 w-full">
            <input
              name="email"
              value={formDetails.email}
              placeholder="Email"
              type="email"
              className="w-full outline-none bg-transparent text-[#667085]"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <h4 className="text-[#121212] text-sm font-medium">Phone no*</h4>
          <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-lg p-2 w-full">
            <input
              name="number"
              value={formDetails.number}
              placeholder="Phone No"
              className="w-full outline-none bg-transparent text-[#667085]"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <h4 className="text-[#121212] text-sm font-medium">
            Duration of stay*
          </h4>
          <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-lg p-2 w-full">
            <input
              name="duration"
              value={formDetails.duration}
              placeholder="Duration of Stay"
              className="w-full outline-none bg-transparent text-[#667085]"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <h4 className="text-[#121212] text-sm font-medium">
            Price per night*
          </h4>
          <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-lg p-2 w-full">
            <input
              name="price"
              value={formDetails.price}
              placeholder="Price per night"
              className="w-full outline-none bg-transparent text-[#667085]"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <h4 className="text-[#121212] text-sm font-medium">Check In Date</h4>
          <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-lg p-2 w-full">
            <Calendar className="w-6" />
            <input
              name="checkIn"
              value={formDetails.checkIn}
              type="date"
              placeholder="Check In Date"
              className="w-full outline-none bg-transparent text-[#667085]"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <h4 className="text-[#121212] text-sm font-medium">Check Out Date</h4>
          <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-lg p-2 w-full">
            <Calendar className="w-6" />
            <input
              name="checkOut"
              value={formDetails.checkOut}
              type="date"
              placeholder="Price per night"
              className="w-full outline-none bg-transparent text-[#667085]"
              onChange={handleChange}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default StepOne;
