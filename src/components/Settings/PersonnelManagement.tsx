import { useEffect, useState } from "react";
import { ChevronDownIcon } from "../../assets/icons";
import deleted from "../../assets/delete-02.svg";
import searchIcon from "../../assets/search.svg";
import AddPersonnel from "./AddPersonnel";
import apiClient from "../../helpers/apiClient";

function PersonnelManagement() {
  const [staffs, setStaffs] = useState([]);
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");

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

  const getColor = (role: string) => {
    switch (role) {
      case "Property Manager":
        return "bg-[#FAF5FF] text-[#9B51E0]";
      case "Building and Maintenance":
        return "bg-[#FFFCF2] text-[#F2C94C]";
      case "Administrator":
        return "bg-[#FFEFE8] text-[#E36B37]";
      case "Cleaning":
        return "bg-[#E9FFF2] text-[#219653]";
      case "Associate Manager":
        return "bg-[#F2F7FF] text-[#2F80ED]";
      case "Front Desk":
        return "bg-[#FFFAF0] text-[#FFA15F]";
      default:
        return "bg-[#FFFAF0] text-[#FFA15F]";
    }
  };

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
                  className="bg-primary px-4 py-2 rounded-xl text-white text-sm border"
                >
                  Add Staff
                </button>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <div className="p-1.5 rounded-xl bg-[#FAFAFA]">
                  <table className="min-w-full text-left text-xs rounded-t-lg  bg-[#FAFAFA] border-collapse">
                    <thead className="text-[#BDBDBD] text-sm">
                      <tr className="capitalize">
                        <th
                          scope="col"
                          className="px-6 py-4 whitespace-nowrap font-bold"
                        >
                          name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 whitespace-nowrap font-bold"
                        >
                          date added
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 whitespace-nowrap font-bold"
                        >
                          role
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 whitespace-nowrap font-bold"
                        >
                          email
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 whitespace-nowrap font-bold"
                        >
                          phone no
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 whitespace-nowrap font-bold"
                        />
                      </tr>
                    </thead>
                    <tbody className="bg-white text-[#828282]">
                      {filteredData.length > 0 ? (
                        filteredData.map((item: any, index: number) => (
                          <tr key={item.id} className="cursor-pointer text-sm">
                            <td className="px-6 py-4 whitespace-nowrap font-semibold text-deepBlue">
                              {item.firstName} {item.lastName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item.joinedAt}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`p-1 rounded ${getColor(item.role)}`}
                              >
                                {item.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item.phoneNumber}
                            </td>
                            <td>
                              <div className="flex items-center gap-4 py-4">
                                <button
                                  onClick={() => {
                                    setStaffs(
                                      staffs.filter(
                                        (_: any, i: number) => i !== index
                                      )
                                    );
                                  }}
                                >
                                  <img src={deleted} alt="Delete" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center py-4 text-secondary"
                          >
                            No personnel found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ),
          2: <AddPersonnel setStep={setStep} />,
        }[step]
      }
    </>
  );
}

export default PersonnelManagement;
