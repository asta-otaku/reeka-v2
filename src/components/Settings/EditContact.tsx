import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import apiClient from "../../helpers/apiClient";
import Spinner from "../Spinner";

function EditContact() {
  const [contact, setContact] = useState({
    contactEmail: "",
    contactPhone: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await apiClient.get("/users/contact");
        setContact(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load contact information");
      }
    };

    fetchContact();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContact({
      ...contact,
      [e.target.name]: e.target.value,
    });
  };

  const handleInfoUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.put("/users/contact", {
        contactEmail: contact.contactEmail,
        contactPhone: contact.contactPhone,
      });
      toast.success("Contact info updated successfully");
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.error || "An error occurred. Please try again."
      );
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg w-full mx-auto bg-white border rounded-lg p-6 mt-12">
      <h2 className="md:text-xl font-semibold text-gray-800 mb-4">
        Edit Primary Customer Contact Information
      </h2>
      <form onSubmit={handleInfoUpdate}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Contact Email
          </label>
          <input
            type="email"
            name="contactEmail"
            value={contact.contactEmail}
            onChange={handleChange}
            placeholder="Enter Email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            required
            autoComplete="email"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Contact Phone
          </label>
          <input
            type="tel"
            name="contactPhone"
            value={contact.contactPhone}
            onChange={handleChange}
            placeholder="Enter Phone Number"
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
  );
}

export default EditContact;
