import { useEffect, useState } from "react";
import apiClient from "../../helpers/apiClient";
import toast from "react-hot-toast";
import Spinner from "../Spinner";

function EditStaffModal({ staff, setModal, onUpdate, isAgent }: any) {
  const [activeTab, setActiveTab] = useState("details");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: staff.role,
    phoneNumber: staff.phoneNumber,
    name: staff.firstName + " " + staff.lastName,
  });

  const [properties, setProperties] = useState<any[]>([]);
  const [assignedPropertyIds, setAssignedPropertyIds] = useState<string[]>(
    staff.properties || []
  );

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await apiClient.get(`/properties`);
        setProperties(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProperties();
  }, []);

  const roleTypes = [
    "Property Manager",
    "Building and Maintenance",
    "Administrator",
    "Cleaning",
    "Associate Manager",
    "Front Desk",
  ];
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isAgent) {
        await apiClient.patch(`/agents/${staff.id}`, {
          name: formData.name,
          phoneNumber: formData.phoneNumber,
        });
        onUpdate(staff.id, {
          firstName: formData.name.split(" ")[0],
          lastName: formData.name.split(" ").slice(1).join(" "),
          phoneNumber: formData.phoneNumber,
        });
      } else {
        await apiClient.put(`/staff/${staff.id}`, {
          role: formData.role,
          phoneNumber: formData.phoneNumber,
        });
        onUpdate(staff.id, {
          role: formData.role,
          phoneNumber: formData.phoneNumber,
        });
      }
      setModal(null);
      toast.success("Staff details updated successfully!");
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update staff details.");
      setLoading(false);
    }
  };

  const handleGenerateAgentLink = async (id: string) => {
    try {
      const response = await apiClient.get(`/agents/${id}/url`);
      navigator.clipboard.writeText(response.data.agentLink);
      toast.success("Public URL copied to clipboard");
    } catch (error) {
      console.error(error);
    }
  };

  const handlePropertyUpdate = async () => {
    setLoading(true);
    try {
      if (isAgent) {
        await apiClient.patch(`/agents/${staff.id}/properties`, {
          properties: assignedPropertyIds,
        });
        onUpdate(staff.id, {
          properties: assignedPropertyIds,
          propertyNames: properties
            .filter((property) => assignedPropertyIds.includes(property._id))
            .map((property) => property.propertyName),
        });
      } else {
        await apiClient.post(`/staff/${staff.id}/properties`, {
          propertyId: assignedPropertyIds,
        });
        onUpdate(staff.id, { properties: assignedPropertyIds });
      }
      setModal(null);
      setLoading(false);
      toast.success("Properties updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update properties.");
      setLoading(false);
    }
  };

  const togglePropertyAssignment = (propertyId: string) => {
    setAssignedPropertyIds((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="border border-[#C0C0C0] rounded-2xl p-1.5 bg-[#FAFAFA] max-w-xl w-full relative"
    >
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <h3 className="text-[#121212] font-medium text-sm">
          Edit Staff Details
        </h3>
        <span
          onClick={() => setModal(null)}
          className="cursor-pointer text-[#808080]"
        >
          X
        </span>
      </div>
      <div className="flex border-b">
        <button
          className={`p-2 flex-1 ${
            activeTab === "details"
              ? "border-b-2 border-primary"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("details")}
        >
          Details
        </button>
        <button
          className={`p-2 flex-1 ${
            activeTab === "properties"
              ? "border-b-2 border-primary"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("properties")}
        >
          Properties
        </button>
      </div>

      {activeTab === "details" && (
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div className={`${isAgent && "hidden"}`}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {roleTypes.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div className={`${!isAgent && "hidden"}`}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 mt-6">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleGenerateAgentLink(staff.id)}
              className={`px-4 py-2 text-sm font-medium text-white whitespace-nowrap bg-secondary rounded-xl hover:bg-secondary/90 ${
                !isAgent && "hidden"
              }`}
            >
              {loading ? <Spinner /> : "Generate agent link"}
            </button>
            <div className="flex gap-4 w-full justify-end">
              <button
                type="button"
                onClick={() => setModal(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary/90"
              >
                {loading ? <Spinner /> : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      )}

      {activeTab === "properties" && (
        <div className="p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Assign Properties
          </h4>
          <div className="mt-5 text-secondary">
            <div className="flex flex-col gap-4">
              {properties.map((property: any) => (
                <div
                  key={property._id}
                  className="py-2 px-4 border-b border-solid border-gray-300 flex items-center gap-4"
                >
                  <input
                    type="checkbox"
                    checked={assignedPropertyIds.includes(property._id)}
                    onChange={() => togglePropertyAssignment(property._id)}
                    id={`property-${property._id}`}
                    className="accent-primary"
                  />
                  <label
                    htmlFor={`property-${property._id}`}
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    {property.propertyName}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => setModal(null)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handlePropertyUpdate}
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary/90"
            >
              {loading ? <Spinner /> : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditStaffModal;
