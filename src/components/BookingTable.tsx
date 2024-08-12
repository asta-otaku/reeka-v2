import exportIcon from "../assets/sent.svg";
import deleteIcon from "../assets/delete-01.svg";
import share from "../assets/share-08.svg";

function BookingTable({ data, setData }: { data: any[]; setData?: any }) {
  function formatDate(date: string) {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
  }

  function formatTime(date: string) {
    const d = new Date(date);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

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
                          {formatDate(item?.startDate?.toString())}
                        </div>
                        <div className="text-[10px] text-[#808080] font-light">
                          {formatTime(item?.startDate?.toString())}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <img
                        src={item?.propertyId?.images[0]}
                        className="w-10 h-10"
                      />
                      <div>
                        <div className="text-sm text-[#121212] font-medium">
                          {item?.propertyId?.propertyName}
                        </div>
                        <div className="text-[10px] text-[#808080] font-light">
                          {item?.propertyId.address}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#121212] font-medium">
                      {item.guestFirstName} {item.guestLastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#121212] font-medium">
                      ${item.totalBookingValue}
                    </div>
                    <div className="text-[10px] text-[#808080] font-light">
                      For {item.nightsBooked} days
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
                      className="text-xs p-1.5 rounded-lg font-medium w-fit"
                    >
                      {item.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#121212] font-medium">
                      {item.numberOfGuests}
                    </div>
                    <div className="text-[10px] text-[#808080] font-light">
                      {item.numberOfChildren} Child
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3 w-full">
                      <button className="w-full">
                        <img src={exportIcon} className="min-w-[20px]" />
                      </button>
                      <button
                        onClick={() => {
                          const newData = data.filter(
                            (_, index) => index !== i
                          );
                          setData(newData);
                        }}
                        className="w-full"
                      >
                        <img src={deleteIcon} className="min-w-[20px]" />
                      </button>
                      <button className="w-full">
                        <img src={share} className="min-w-[20px]" />
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
