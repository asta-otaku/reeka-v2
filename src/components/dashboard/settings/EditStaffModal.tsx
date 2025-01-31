import { useState } from "react";
import { EditFormState, EditStaffModalProps, Property } from "@/lib/types";
import { roleTypes } from "@/lib/utils";
import { useGetProperties } from "@/lib/api/queries";
import {
  useUpdateStaffInfo,
  useUpdateStaffProperties,
} from "@/lib/api/mutations";
import { DialogClose } from "@/components/ui/dialog";
import Spinner from "../../Spinner";

const EditStaffModal = ({ staff, onUpdate, isAgent }: EditStaffModalProps) => {
  const [activeTab, setActiveTab] = useState<"details" | "properties">(
    "details"
  );
  const [formData, setFormData] = useState<EditFormState>({
    name: `${staff.firstName} ${staff.lastName}`,
    role: staff.role,
    phoneNumber: staff.phoneNumber,
  });

  const [assignedPropertyIds, setAssignedPropertyIds] = useState<string[]>(
    staff.properties || []
  );

  const { data: properties = [] } = useGetProperties();
  const { mutateAsync: updateInfo, isPending: isUpdatingInfo } =
    useUpdateStaffInfo();
  const { mutateAsync: updateProperties, isPending: isUpdatingProperties } =
    useUpdateStaffProperties();

  const handleFormChange = (field: keyof EditFormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateInfo({
        id: staff.id,
        name: formData.name,
        role: formData.role || "",
        phoneNumber: formData.phoneNumber,
        isAgent,
      });

      onUpdate(staff.id, {
        firstName: formData.name.split(" ")[0],
        lastName: formData.name.split(" ").slice(1).join(" "),
        role: formData.role || "",
        phoneNumber: formData.phoneNumber,
      });
    } catch (error) {
      console.error("Failed to update staff info:", error);
    }
  };

  const handlePropertyUpdate = async () => {
    try {
      await updateProperties({
        id: staff.id,
        assignedPropertyIds,
        isAgent,
      });
      onUpdate(staff.id, { properties: assignedPropertyIds });
    } catch (error) {
      console.error("Failed to update properties:", error);
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
      </div>

      <div className="flex border-b">
        {(["details", "properties"] as const).map((tab) => (
          <button
            key={tab}
            className={`p-2 flex-1 ${
              activeTab === tab ? "border-b-2 border-primary" : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "details" && (
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            {!isAgent && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleFormChange("role", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {roleTypes.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {isAgent && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  placeholder="Enter name"
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                placeholder="Phone Number"
                onChange={(e) =>
                  handleFormChange("phoneNumber", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <FormActions
            isLoading={isUpdatingInfo}
            onCancel={() => setActiveTab("details")}
          />
        </form>
      )}

      {activeTab === "properties" && (
        <div className="p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Assign Properties
          </h4>

          <div className="mt-5 text-secondary">
            <div className="flex flex-col gap-4">
              {properties.map((property) => (
                <PropertyItem
                  key={property._id}
                  property={property}
                  isChecked={assignedPropertyIds.includes(property._id)}
                  onToggle={togglePropertyAssignment}
                />
              ))}
            </div>
          </div>

          <FormActions
            isLoading={isUpdatingProperties}
            onCancel={() => setActiveTab("properties")}
            onSave={handlePropertyUpdate}
          />
        </div>
      )}
    </div>
  );
};

const PropertyItem = ({
  property,
  isChecked,
  onToggle,
}: {
  property: Property;
  isChecked: boolean;
  onToggle: (id: string) => void;
}) => (
  <div className="py-2 px-4 border-b border-solid border-gray-300 flex items-center gap-4">
    <input
      type="checkbox"
      checked={isChecked}
      onChange={() => onToggle(property._id)}
      id={`property-${property._id}`}
      className="accent-primary"
    />
    <label
      htmlFor={`property-${property._id}`}
      className="text-sm text-gray-600 cursor-pointer w-full"
    >
      {property.propertyName}
    </label>
  </div>
);

const FormActions = ({
  isLoading,
  onSave,
  onCancel,
}: {
  isLoading: boolean;
  onSave?: () => void;
  onCancel?: () => void;
}) => (
  <div className="flex items-center justify-end gap-4 mt-6">
    <DialogClose asChild>
      <button
        type="button"
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200"
        onClick={onCancel}
      >
        Cancel
      </button>
    </DialogClose>

    {onSave ? (
      <button
        type="button"
        onClick={onSave}
        disabled={isLoading}
        className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary/90"
      >
        {isLoading ? <Spinner /> : "Save Changes"}
      </button>
    ) : (
      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary/90"
      >
        {isLoading ? <Spinner /> : "Save Changes"}
      </button>
    )}
  </div>
);

export default EditStaffModal;
