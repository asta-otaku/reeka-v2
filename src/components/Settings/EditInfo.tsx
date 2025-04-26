import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import apiClient from "../../helpers/apiClient";
import Spinner from "../Spinner";
import EditContact from "./EditContact";

function EditInfo() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const userSessionDetails = JSON.parse(sessionStorage.getItem("user") || "{}");
  const { staffId } = userSessionDetails;

  const url = staffId ? `/users/${staffId}` : "/users";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get(url);
        setUser(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [staffId]);

  const handleInfoUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.put(url, {
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        address: user.address,
      });
      toast.success("Information updated successfully");
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response.data.error || "An error occurred. Please try again."
      );
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="max-w-lg w-full mx-auto bg-white border rounded-lg p-6 mt-12">
        <h2 className="md:text-xl font-semibold text-gray-800 mb-4">
          Edit Your Account Information
        </h2>
        <form onSubmit={handleInfoUpdate}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              value={user.firstName}
              name="firstName"
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              value={user.lastName}
              name="lastName"
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              value={user.address}
              name="address"
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              required
              autoComplete="email"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              value={user.phoneNumber}
              name="phoneNumber"
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              required
              autoComplete="tel"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/70 focus:outline-none"
          >
            {loading ? <Spinner /> : "Save Changes"}
          </button>
        </form>
      </div>
      <EditContact />
    </div>
  );
}

export default EditInfo;
