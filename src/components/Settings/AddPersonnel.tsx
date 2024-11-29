import { useState } from "react";
import { ArrowLongLeftIcon, ChevronDownIcon } from "../../assets/icons";
import DropdownForm from "./DropdownForm";
import { getCurrentDate } from "../../helpers/getDate";
import apiClient from "../../helpers/apiClient";
import toast, { Toaster } from "react-hot-toast";

function AddPersonnel({
  data,
  setStep,
  setData,
}: {
  data: {}[];
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setData: React.Dispatch<any>;
}) {
  const [formDetails, setFormDetails] = useState({
    email: "",
    role: "Property Manager",
    name: "",
    phone: "",
  });
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormDetails({
      ...formDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();

    const { email, role } = formDetails;

    if (!role || !email) {
      toast.error("All fields are required!");
      return;
    }

    if (selectedProperties.length === 0) {
      toast.error("Please select at least one property.");
      return;
    }

    try {
      if (selectedProperties.length === 1) {
        // Single property API call
        const propertyId = selectedProperties[0];
        await apiClient.post(`/properties/${propertyId}/invite-employee`, {
          email,
          role,
        });
        toast.success("Personnel successfully added to the property!");
      } else {
        // Multiple properties API call
        await apiClient.post(`/properties/invite-employees`, {
          email,
          role,
          propertyIds: selectedProperties,
        });
        toast.success(
          "Personnel successfully added to the selected properties!"
        );
      }

      // Update local data and reset form
      setData([
        ...data,
        {
          ...formDetails,
          date: getCurrentDate(),
        },
      ]);
      setStep(1); // Navigate back to the previous step
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response.data.error ||
          "Failed to add personnel. Please try again."
      );
    }
  };

  return (
    <div>
      <Toaster />
      <div className="w-full flex justify-between items-center p-4">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setStep(1)}
        >
          <ArrowLongLeftIcon className="w-5 text-secondary cursor-pointer" />
          <h2 className="text-deepBlue font-medium text-sm md:text-base">
            Back
          </h2>
        </div>
      </div>

      <div>
        <div className="max-w-lg mx-auto w-full bg-[#FAFAFA] px-1 py-4 rounded-xl flex flex-col gap-4">
          <h3 className="px-4 text-deepBlue font-medium">Personal Details</h3>
          <form
            onSubmit={handleFormSubmit}
            className="flex flex-col gap-2 bg-white rounded-3xl shadow-sm shadow-black/10 p-4"
          >
            <div className="flex flex-col gap-2 w-full">
              <h4 className="text-[#344054] text-sm font-medium">Name*</h4>
              <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-md p-2 w-full">
                <input
                  name="name"
                  placeholder="Name"
                  className="w-full outline-none bg-transparent"
                  onChange={handleChange}
                />
                <ChevronDownIcon width={16} />
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <h4 className="text-[#344054] text-sm font-medium">Email*</h4>
              <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-md p-2 w-full">
                <input
                  name="email"
                  placeholder="Email"
                  className="w-full outline-none bg-transparent"
                  onChange={handleChange}
                />
                <ChevronDownIcon width={16} />
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <h4 className="text-[#344054] text-sm font-medium">Phone No*</h4>
              <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-md p-2 w-full">
                <input
                  name="phone"
                  placeholder="Phone No"
                  className="w-full outline-none bg-transparent"
                  onChange={handleChange}
                />
                <ChevronDownIcon width={16} />
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <h4 className="text-[#344054] text-sm font-medium">Role</h4>
              <div className="flex items-center justify-between bg-white border border-solid rounded-md p-2 w-full">
                <select
                  onChange={(e) => {
                    setFormDetails({
                      ...formDetails,
                      role: e.target.value,
                    });
                  }}
                  className="outline-none text-secondary text-xs md:text-sm w-full font-medium appearance-none border-none bg-transparent"
                >
                  <option value="Property Manager">Property Manager</option>
                  <option value="Administrator">Administrator</option>
                  <option value="Building and Maintenance">
                    Building and Maintenance
                  </option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Associate Manager">Associate Manager</option>
                  <option value="Front Desk">Front Desk</option>
                </select>
                <ChevronDownIcon width={12} />
              </div>
            </div>
            <DropdownForm
              selectedProperties={selectedProperties}
              setSelectedProperties={setSelectedProperties}
            />
          </form>
          <button
            onClick={handleFormSubmit}
            className="bg-primary border border-solid border-primary text-sm shadow-primary/40 font-semibold text-white px-4 py-2.5 rounded-md"
          >
            Add Personnel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddPersonnel;
