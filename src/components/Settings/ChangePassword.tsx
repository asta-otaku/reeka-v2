import { useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../Spinner";
import apiClient from "../../helpers/apiClient";

function ChangePassword() {
  const [formDetails, setFormDetails] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const userSessionDetails = JSON.parse(sessionStorage.getItem("user") || "{}");
  const { staffId } = userSessionDetails;

  const url = staffId
    ? `/auth/change-password/${staffId}`
    : "/auth/change-password";

  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formDetails.oldPassword === "" || formDetails.newPassword === "") {
      return toast.error("Please fill in all fields");
    }
    setLoading(true);
    if (formDetails.newPassword !== confirmPassword) {
      setLoading(false);
      return toast.error("Passwords do not match");
    }
    try {
      const response = await apiClient.post(url, {
        oldPassword: formDetails.oldPassword,
        newPassword: formDetails.newPassword,
      });
      setLoading(false);
      if (response.data.status === "success") {
        toast.success("Password changed successfully");
        setFormDetails({
          oldPassword: "",
          newPassword: "",
        });
        setConfirmPassword("");
      }
    } catch (error: any) {
      setLoading(false);
      toast.error(
        error.response.data.error || "An error occurred. Please try again."
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormDetails({
      ...formDetails,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-lg mx-auto bg-white border rounded-lg p-6 mt-12">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Change Your Password
      </h2>
      <form onSubmit={handlePasswordReset}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Current Password
          </label>
          <input
            type="password"
            value={formDetails.oldPassword}
            name="oldPassword"
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            value={formDetails.newPassword}
            name="newPassword"
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/70 focus:outline-none"
        >
          {loading ? <Spinner /> : "Change Password"}
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
