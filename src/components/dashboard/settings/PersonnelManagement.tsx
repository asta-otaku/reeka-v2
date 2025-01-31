import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@/assets/icons";
import searchIcon from "@/assets/search.svg";
import AddPersonnel from "./AddPersonnel";
import StaffTable from "./StaffTable";
import { Staff } from "@/lib/types";
import { useDeleteStaff, useUpdateAgentAccess } from "@/lib/api/mutations";
import { roleTypes } from "@/lib/utils";
import { useGetStaffs } from "@/lib/api/queries";

function PersonnelManagement({ isAgent }: { isAgent?: boolean }) {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const { data } = useGetStaffs(isAgent);
  const { mutateAsync: updateAgentAccess } = useUpdateAgentAccess();
  const { mutateAsync: deleteStaff } = useDeleteStaff();

  const handleUpdateStaff = (id: string, updatedData: Partial<Staff>) => {
    setStaffs(
      staffs.map((staff) =>
        staff.id === id ? { ...staff, ...updatedData } : staff
      )
    );
  };

  useEffect(() => {
    if (data) {
      setStaffs(data);
    }
  }, [data]);

  const filteredData = staffs.filter((item) => {
    const matchesSearch =
      item.firstName.toLowerCase().includes(search.toLowerCase()) ||
      item.lastName.toLowerCase().includes(search.toLowerCase()) ||
      item.role?.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.phoneNumber.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      selectedRole === "All Roles" || item.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  const handleDeleteStaff = async (id: string) => {
    try {
      await deleteStaff(id);
      const updatedStaffs = staffs.filter((staff) => staff.id !== id);
      setStaffs(updatedStaffs);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAgent = async (item: Staff) => {
    try {
      await updateAgentAccess({
        id: item.id,
        isActive: item.isActive ?? false,
      });
      const updatedStaffs = staffs.map((staff) =>
        staff.id === item.id ? { ...staff, isActive: !staff.isActive } : staff
      );
      setStaffs(updatedStaffs);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {
        {
          1: (
            <div>
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full my-4">
                <div className="flex items-center justify-between md:max-w-sm lg:max-w-xl w-full gap-4">
                  <div className="w-full flex gap-2 border border-solid border-[#E4E4E4] rounded-xl p-3">
                    <img src={searchIcon} className="w-5" alt="Search Icon" />
                    <input
                      type="search"
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={isAgent ? "Search Agents" : "Search Staff"}
                      className="outline-none text-secondary text-xs bg-transparent md:w-full"
                    />
                  </div>

                  <div
                    className={`flex items-center justify-center gap-2 bg-white border border-solid shadow-sm shadow-gray-400 rounded-md p-2 w-fit ${
                      isAgent && "hidden"
                    }`}
                  >
                    <select
                      className="outline-none text-secondary text-xs md:text-sm font-medium appearance-none border-none bg-transparent"
                      onChange={(e) => setSelectedRole(e.target.value)}
                    >
                      {roleTypes.map((role, index) => (
                        <option key={index} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon width={12} />
                  </div>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="bg-primary px-4 py-2 rounded-xl text-white text-sm border whitespace-nowrap"
                >
                  {isAgent ? "Add Agent" : "Add Staff"}
                </button>
              </div>

              <StaffTable
                filteredData={filteredData}
                handleUpdateStaff={handleUpdateStaff}
                handleDeleteStaff={handleDeleteStaff}
                isAgent={isAgent}
                handleAgent={handleAgent}
              />
            </div>
          ),
          2: <AddPersonnel setStep={setStep} isAgent={isAgent} />,
        }[step]
      }
    </>
  );
}

export default PersonnelManagement;
