import EditStaffModal from "./EditStaffModal";
import DeleteStaffModal from "./DeleteStaffModal";
import deleted from "@/assets/delete-02.svg";
import { getRoleColor } from "@/lib/utils";
import { Staff } from "@/lib/types";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DialogContent } from "@/components/ui/dialog";

function StaffTable({
  filteredData,
  handleUpdateStaff,
  handleDeleteStaff,
  handleAgent,
  isAgent,
}: {
  filteredData: Staff[];
  handleUpdateStaff: (id: string, updatedData: Partial<Staff>) => void;
  handleDeleteStaff: (id: string) => void;
  handleAgent: (item: Staff) => void;
  isAgent?: boolean;
}) {
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
                className={`px-6 py-4 whitespace-nowrap font-bold ${
                  !isAgent && "hidden"
                }`}
              >
                properties
              </th>
              <th
                scope="col"
                className="px-6 py-4 whitespace-nowrap font-bold"
              />
            </tr>
          </thead>
          <tbody className="bg-white text-[#828282]">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <Dialog key={item.id}>
                  <DialogTrigger asChild>
                    <tr className="cursor-pointer text-sm">
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
                        <span
                          className={`p-1 rounded ${getRoleColor(
                            item.role || ""
                          )}`}
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
                      <td
                        className={`px-6 py-4 whitespace-nowrap ${
                          !isAgent && "hidden"
                        }`}
                      >
                        {item.propertyNames.map(
                          (value: string, index: number) => (
                            <span
                              className="flex flex-col bg-offwhite py-1 px-2 mb-1 w-fit rounded-3xl"
                              key={index}
                            >
                              {value}
                            </span>
                          )
                        )}
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
                                  item.isActive
                                    ? "text-red-500"
                                    : "text-green-500"
                                } whitespace-nowrap`}
                              >
                                {item.isActive == true ? "Revoke" : "Restore"}
                              </span>
                            </button>
                          ) : (
                            <Dialog key={item.id}>
                              <DialogTrigger asChild>
                                <button>
                                  <img src={deleted} alt="delete" />
                                </button>
                              </DialogTrigger>
                              <DialogContent className="p-0 bg-transparent border-none">
                                <DeleteStaffModal
                                  handleDelete={() =>
                                    handleDeleteStaff(item.id)
                                  }
                                />
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </td>
                    </tr>
                  </DialogTrigger>
                  <DialogContent className="p-0 max-w-xl w-full bg-transparent border-none">
                    <EditStaffModal
                      staff={item}
                      onUpdate={handleUpdateStaff}
                      isAgent={isAgent}
                    />
                  </DialogContent>
                </Dialog>
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
