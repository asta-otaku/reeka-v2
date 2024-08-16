import { Calendar, ChevronDownIcon, NotificationIcon } from "../assets/icons";
import DashboardLayout from "../layouts/DashboardLayout";
import { getDate, getDateRange } from "../helpers/getDate";
import { useEffect, useState } from "react";
import DashboardCharts from "../components/DashboardCharts";
import NotificationModal from "../components/NotificationModal";
import { useNavigate } from "react-router-dom";

const propertyCardData = [
  {
    title: "Booked",
    amount: "21",
    percentage: 200,
  },
  {
    title: "Occupied",
    amount: "33",
    percentage: -200,
  },
  {
    title: "Vacant",
    amount: "24",
    percentage: 200,
  },
];

function Dashboard() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (Object.keys(user).length === 0) {
      navigate("/signin");
    }
  }, [user]);

  console.log(user);

  return (
    <DashboardLayout>
      <div className="no-scrollbar">
        <div className="w-full border-0 border-solid border-b flex justify-between items-center py-4 px-6">
          <div>
            <span className="text-[#808080] text-xs">{getDate()}</span>
            <h3 className="mt-1 text-deepBlue font-medium text-2xl">
              Welcome {user?.firstName || "Deborah"}
            </h3>
          </div>
          <NotificationIcon
            onClick={() => setOpenModal(!openModal)}
            className="w-5 h-5 cursor-pointer"
          />

          {openModal && <NotificationModal setOpenModal={setOpenModal} />}
        </div>
        <div className="p-4">
          <section>
            <div className="flex flex-wrap gap-2 items-center justify-between w-full pb-4">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setSelected(0)}
                  className={`text-sm p-2 ${
                    selected === 0
                      ? "font-medium text-[#121212] rounded-lg border bg-[#FAFAFA] shadow"
                      : "text-[#808080]"
                  }`}
                >
                  Overview
                </button>
                {/* <button
                  onClick={() => setSelected(1)}
                  className={`text-sm p-2 ${
                    selected === 1
                      ? "font-medium text-[#121212] rounded-lg border bg-[#FAFAFA] shadow"
                      : "text-[#808080]"
                  }`}
                >
                  Properties
                </button> */}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center gap-2 bg-white border border-solid rounded-md p-2 w-fit">
                  <select className="outline-none text-secondary text-xs md:text-sm appearance-none border-none bg-transparent">
                    <option>Monthly</option>
                  </select>
                  <ChevronDownIcon width={12} />
                </div>
                <div className="flex items-center justify-center gap-2 bg-white border border-solid rounded-md p-2 w-fit">
                  <Calendar width={12} />
                  <select className="outline-none text-secondary text-xs md:text-sm appearance-none border-none bg-transparent">
                    <option>{getDateRange()}</option>
                  </select>
                </div>
              </div>
            </div>

            {
              {
                0: <DashboardCharts />,
                1: (
                  <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-4">
                    {propertyCardData.map((data, index) => (
                      <div
                        key={index}
                        className={`border shadow-sm rounded-xl space-y-6 p-4
                  ${
                    data.percentage > 0
                      ? "bg-[linear-gradient(220deg,_#D5FFE7,_#FFFF_45%)]"
                      : "bg-[linear-gradient(220deg,_#FFEEEE,_#FFFF_45%)]"
                  }`}
                      >
                        <div className="w-full flex items-center justify-between">
                          <h4 className="text-[#808080] font-medium">
                            {data.title}
                          </h4>
                          <h6
                            className={`${
                              data.percentage > 0
                                ? "text-[#219653]"
                                : "text-[#E90000]"
                            } font-medium text-sm`}
                          >
                            {data.percentage > 0 ? "+" : ""}
                            {data.percentage}%
                          </h6>
                        </div>
                        <div>
                          <h2 className="text-[#121212] text-2xl font-medium">
                            {data.amount}
                          </h2>
                          <p className="text-xs text-[#808080]">
                            1,000 previous period
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ),
              }[selected]
            }
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
