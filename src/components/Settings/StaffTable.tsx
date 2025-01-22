import EditStaffModal from "./EditStaffModal";
import DeleteStaffModal from "./DeleteStaffModal";
import deleted from "../../assets/delete-02.svg";

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

function StaffTable({
  filteredData,
  setModal,
  handleUpdateStaff,
  handleDeleteStaff,
  handleAgent,
  isAgent,
}: any) {
  return (
    <div className="overflow-x-auto no-scrollbar">
      <div className="p-1.5 rounded-xl bg-[#FAFAFA]">
        <table className="min-w-full text-left text-xs rounded-t-lg  bg-[#FAFAFA] border-collapse">
          <thead className="text-[#BDBDBD] text-sm">
            <tr className="capitalize">
              <th scope="col" className="px-6 py-4 whitespace-nowrap font-bold">
                name
              </th>
              <th scope="col" className="px-6 py-4 whitespace-nowrap font-bold">
                date added
              </th>
              <th
                scope="col"
                className={`px-6 py-4 whitespace-nowrap font-bold ${
                  isAgent && "hidden"
                }`}
              >
                role
              </th>
              <th scope="col" className="px-6 py-4 whitespace-nowrap font-bold">
                email
              </th>
              <th scope="col" className="px-6 py-4 whitespace-nowrap font-bold">
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
              filteredData.map((item: any) => (
                <tr
                  key={item.id}
                  className="cursor-pointer text-sm"
                  onClick={() =>
                    setModal(
                      <EditStaffModal
                        staff={item}
                        setModal={setModal}
                        onUpdate={handleUpdateStaff}
                        isAgent={isAgent}
                      />
                    )
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-deepBlue">
                    {item.firstName} {item.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.joinedAt}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap ${
                      isAgent && "hidden"
                    }`}
                  >
                    <span className={`p-1 rounded ${getColor(item.role)}`}>
                      {item.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.phoneNumber}
                  </td>
                  <td>
                    <div
                      className="flex items-center gap-4 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {isAgent ? (
                        <button onClick={() => handleAgent(item)}>
                          <span
                            className={`${
                              item.isActive ? "text-red-500" : "text-green-500"
                            } whitespace-nowrap`}
                          >
                            {item.isActive == true ? "Revoke" : "Restore"}
                          </span>
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            setModal(
                              <DeleteStaffModal
                                handleDelete={() => handleDeleteStaff(item.id)}
                                setModal={setModal}
                              />
                            )
                          }
                        >
                          <img src={deleted} alt="delete" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-secondary">
                  No personnel found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StaffTable;
