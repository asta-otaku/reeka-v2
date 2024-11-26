import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function EditInfo() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const userDetails = sessionStorage.getItem("user");
    if (userDetails) {
      const user = JSON.parse(userDetails);
      console.log(user);
      setUser({
        name: user.firstName + " " + user.lastName,
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, []);

  const handleInfoUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (user.name === "" || user.email === "" || user.phone === "") {
      return toast.error("Please fill in all fields.");
    }
    toast.success("Information updated successfully.");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-lg mx-auto bg-white border rounded-lg p-6 mt-12">
      <Toaster />
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Edit Your Information
      </h2>
      <form onSubmit={handleInfoUpdate}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            value={user.name}
            name="name"
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            value={user.email}
            name="email"
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
            value={user.phone}
            name="phone"
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
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditInfo;
