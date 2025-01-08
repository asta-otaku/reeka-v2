import { useEffect, useState } from "react";
import apiClient from "../../helpers/apiClient";

function EditStaffModal({ staff, setModal, onUpdate }: any) {
  const [activeTab, setActiveTab] = useState("details");
  const [formData, setFormData] = useState({
    role: staff.role,
    phoneNumber: staff.phoneNumber,
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
    try {
      await apiClient.put(`/staff/${staff.id}`, formData);
      onUpdate(staff.id, formData);
      setModal(null);
    } catch (error) {
      console.error(error);
    }
  };

  console.log(assignedPropertyIds);

  const handlePropertyUpdate = async () => {
    try {
      await apiClient.post(`/staff/${staff.id}/properties`, {
        propertyId: assignedPropertyIds,
      });
      onUpdate(staff.id, { properties: assignedPropertyIds });
      setModal(null);
    } catch (error) {
      console.error(error);
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
            <div>
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
          <div className="flex items-center justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => setModal(null)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary/90"
            >
              Save Changes
            </button>
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
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditStaffModal;
