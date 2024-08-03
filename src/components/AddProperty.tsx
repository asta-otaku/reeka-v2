import { useState } from "react";
import {
  ArrowLongLeftIcon,
  ChevronDownIcon,
  NotificationIcon,
} from "../assets/icons";
import DropdownForm from "./DropdownForm";
import { getCurrentDate } from "../helpers/getDate";

function AddProperty({
  data,
  setStep,
  setData,
}: {
  data: {}[];
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setData: React.Dispatch<any>;
}) {
  const [formDetails, setFormDetails] = useState<any>({});
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormDetails({
      ...formDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    if (!formDetails.name || !formDetails.email || !formDetails.phone) return;
    setData([
      ...data,
      {
        ...formDetails,
        date: getCurrentDate(),
      },
    ]);
    setStep(1);
  };

  return (
    <div>
      <div className="w-full border-0 border-solid border-b flex justify-between items-center py-4 px-6">
        <div className="flex items-center gap-5">
          <ArrowLongLeftIcon
            className="w-5 text-secondary cursor-pointer"
            onClick={() => setStep(1)}
          />
          <h3 className="text-lg font-medium text-deepBlue">
            Personnel Management
          </h3>
        </div>
        <NotificationIcon className="w-5 h-5 cursor-pointer" />
      </div>

      <div className="my-4 px-6">
        <h3 className="text-deepBlue font-medium text-2xl">Personnel</h3>
        <p className="text-xs text-[#6D6D6D]">
          Manage your managers and their account permissions here.
        </p>
      </div>

      <div className="px-4">
        <div className="max-w-lg mx-auto w-full bg-[#FAFAFA] px-1 py-4 rounded-xl flex flex-col gap-4">
          <h3 className="px-4 text-deepBlue font-medium">Personal Details</h3>
          <form className="flex flex-col gap-2 bg-white rounded-3xl shadow-sm shadow-black/10 p-4">
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
              <h4 className="text-[#344054] text-sm font-medium">Email</h4>
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
              <h4 className="text-[#344054] text-sm font-medium">Phone No</h4>
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
              <div className="flex items-center justify-between bg-white border border-solid shadow-sm shadow-gray-400 rounded-md p-2 w-full">
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
                </select>
                <ChevronDownIcon width={12} />
              </div>
            </div>
            <DropdownForm />
          </form>
          <button
            onClick={handleFormSubmit}
            className="bg-primary border border-solid border-primary shadow-sm shadow-primary/40 font-semibold text-white p-2 rounded-md"
          >
            Add Personnel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddProperty;
