import exportIcon from "../assets/sent.svg";
import deleteIcon from "../assets/delete-01.svg";
import share from "../assets/share-08.svg";
import miniprop from "../assets/miniprop.svg";

function BookingTable({ data }: { data: any[] }) {
  return (
    <div className="flex flex-col gap-6 overflow-x-auto no-scrollbar">
      {data.map((item, i) => (
        <div key={i}>
          <div className="bg-[#F2F2F2] rounded-xl shadow">
            <table className="min-w-full text-left text-xs border-collapse">
              <thead className="text-[#BDBDBD] text-sm">
                <tr className="capitalize">
                  <th
                    scope="col"
                    className="px-6 py-4 whitespace-nowrap font-bold"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 whitespace-nowrap font-bold"
                  >
                    Apartment
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 whitespace-nowrap font-bold"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 whitespace-nowrap font-bold"
                  >
                    Amount Paid
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 whitespace-nowrap font-bold"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 whitespace-nowrap font-bold"
                  >
                    Guest
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 whitespace-nowrap font-bold"
                  />
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="px-0.5 py-4 rounded-2xl bg-[#34C759]" />
                      <div>
                        <div className="text-sm text-[#121212] font-medium">
                          {item.date}
                        </div>
                        <div className="text-[10px] text-[#808080] font-light">
                          {item.time}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <img src={miniprop} />
                      <div>
                        <div className="text-sm text-[#121212] font-medium">
                          {item.apartment}
                        </div>
                        <div className="text-[10px] text-[#808080] font-light">
                          {item.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#121212] font-medium">
                      {item.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#121212] font-medium">
                      {item.amount}
                    </div>
                    <div className="text-[10px] text-[#808080] font-light">
                      {item.duration}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      style={{
                        color:
                          item.status === "Ongoing" ? "#34C759" : "#007AFF",
                        backgroundColor:
                          item.status === "Ongoing" ? "#DBFFE4" : "#DFEEFF",
                      }}
                      className="text-xs p-1.5 rounded-lg font-medium"
                    >
                      {item.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#121212] font-medium">
                      {item.guest}
                    </div>
                    <div className="text-[10px] text-[#808080] font-light">
                      {item.child} Child
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <button>
                        <img src={exportIcon} />
                      </button>
                      <button>
                        <img src={deleteIcon} />
                      </button>
                      <button>
                        <img src={share} />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {i !== data.length - 1 && (
            <div className="border-b border-gray-200 mt-5" key={i} />
          )}
        </div>
      ))}
    </div>
  );
}

export default BookingTable;
