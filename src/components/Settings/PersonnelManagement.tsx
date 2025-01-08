import { useEffect, useState } from "react";
import { ChevronDownIcon } from "../../assets/icons";
import searchIcon from "../../assets/search.svg";
import AddPersonnel from "./AddPersonnel";
import apiClient from "../../helpers/apiClient";
import useStore from "../../store";
import StaffTable from "./StaffTable";

function PersonnelManagement() {
  interface Staff {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    phoneNumber: string;
    joinedAt: string;
  }

  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const setModal = useStore((state: any) => state.setModal);

  const handleUpdateStaff = (id: string, updatedData: Partial<Staff>) => {
    setStaffs(
      staffs.map((staff: any) =>
        staff.id === id ? { ...staff, ...updatedData } : staff
      )
    );
  };

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const response = await apiClient.get(`/staff`);
        setStaffs(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStaffs();
  }, []);

  const roleTypes = [
    "All Roles",
    "Property Manager",
    "Building and Maintenance",
    "Administrator",
    "Cleaning",
    "Associate Manager",
    "Front Desk",
  ];

  const filteredData = staffs?.filter((item: any) => {
    const matchesSearch =
      item.firstName?.toLowerCase().includes(search?.toLowerCase()) ||
      item.lastName?.toLowerCase().includes(search?.toLowerCase()) ||
      item.role?.toLowerCase().includes(search?.toLowerCase()) ||
      item.email?.toLowerCase().includes(search?.toLowerCase()) ||
      item.phoneNumber?.toLowerCase().includes(search?.toLowerCase());

    const matchesRole =
      selectedRole === "All Roles" || item.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  const handleDeleteStaff = async (id: string) => {
    try {
      await apiClient.delete(`/staff/${id}`);
      const updatedStaffs = staffs.filter((staff: any) => staff.id !== id);
      setStaffs(updatedStaffs);
      setModal(null);
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
                      placeholder="Search staff"
                      className="outline-none text-secondary text-xs bg-transparent md:w-full"
                    />
                  </div>

                  <div className="flex items-center justify-center gap-2 bg-white border border-solid shadow-sm shadow-gray-400 rounded-md p-2 w-fit">
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
                  Add Staff
                </button>
              </div>

              <StaffTable
                filteredData={filteredData}
                setModal={setModal}
                handleUpdateStaff={handleUpdateStaff}
                handleDeleteStaff={handleDeleteStaff}
              />
            </div>
          ),
          2: <AddPersonnel setStep={setStep} />,
        }[step]
      }
    </>
  );
}

export default PersonnelManagement;
