import { Calendar, ChevronDownIcon, NotificationIcon } from "../assets/icons";
import DashboardLayout from "../layouts/DashboardLayout";
import { getDate, getDateRange } from "../helpers/getDate";
import { useEffect, useState } from "react";
import DashboardCharts from "../components/DashboardCharts";
import { useNavigate } from "react-router-dom";
import DashboardPropertyChart from "../components/DashboardPropertyChart";
import { DatePicker } from "antd";
import apiClient from "../helpers/apiClient";

const { RangePicker } = DatePicker;

function Dashboard() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [activePropertyId, setActivePropertyId] = useState("");
  const [filterType, setFilterType] = useState("last_30_days");

  // States for custom date range
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (Object.keys(user).length === 0) {
      navigate("/signin");
    }
  }, [user]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await apiClient.get(`/properties`);
        setProperties(response.data);
        setActivePropertyId(response.data[0]?._id);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    const property = properties.find(
      (property) => property.propertyName === selectedProperty
    );
    setActivePropertyId(property?._id);
  }, [selectedProperty]);

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
                <button
                  onClick={() => setSelected(1)}
                  className={`text-sm p-2 ${
                    selected === 1
                      ? "font-medium text-[#121212] rounded-lg border bg-[#FAFAFA] shadow"
                      : "text-[#808080]"
                  }`}
                >
                  Properties
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div
                  className={`relative flex items-center justify-center gap-2 bg-white border border-solid rounded-xl p-2 w-fit ${
                    selected == 0 && "hidden"
                  }`}
                >
                  <select
                    onChange={(e) => {
                      setSelectedProperty(e.target.value);
                    }}
                    className="outline-none text-secondary text-xs md:text-sm font-light appearance-none border-none bg-transparent pr-6"
                  >
                    {properties.length === 0 ? (
                      <option value="">No properties available</option>
                    ) : (
                      properties.map((property) => (
                        <option
                          key={property._id}
                          value={property.propertyName}
                        >
                          {property.propertyName}
                        </option>
                      ))
                    )}
                  </select>
                  <ChevronDownIcon
                    className="absolute pointer-events-none cursor-pointer right-2 "
                    width={12}
                  />
                </div>
                {/* <div className="flex items-center justify-center gap-2 bg-white border border-solid rounded-md p-2 w-fit">
                  <select className="outline-none text-secondary text-xs md:text-sm appearance-none border-none bg-transparent">
                    <option>Monthly</option>
                  </select>
                  <ChevronDownIcon width={12} />
                </div> */}
                <div className="flex items-center justify-center gap-2 bg-white border border-solid rounded-md p-2 w-fit">
                  <Calendar width={12} />
                  {filterType === "custom_date_range" ? (
                    <div className="overflow-x-auto no-scrollbar max-w-xs md:max-w-full flex ">
                      {/* Date Range Picker */}
                      <div className="flex items-center gap-2">
                        <RangePicker
                          onChange={(dates, dateStrings) => {
                            setStartDate(new Date(dateStrings[0]));
                            setEndDate(new Date(dateStrings[1]));
                            console.log(dates, dateStrings);
                          }}
                          className="outline-none text-secondary text-xs md:text-sm appearance-none border-none bg-transparent"
                        />
                      </div>

                      {/* Button to Switch Back to Predefined Options */}
                      <button
                        className="text-[10px] whitespace-nowrap text-primary hover:underline"
                        onClick={() => setFilterType("last_30_days")}
                      >
                        Switch to Predefined Options
                      </button>
                    </div>
                  ) : (
                    <select
                      onChange={(e) => setFilterType(e.target.value)}
                      className="outline-none text-secondary text-xs md:text-sm appearance-none border-none bg-transparent"
                    >
                      <option value="last_30_days">{getDateRange()}</option>
                      <option value="last_7_days">Last 7 days</option>
                      <option value="last_14_days">Last 14 days</option>
                      <option value="last_90_days">Last 90 days</option>
                      <option value="this_month">This Month</option>
                      <option value="all_time">All Time</option>
                      <option value="year_to_date">Year to Date (YTD)</option>
                      <option value="this_year">This Year</option>
                      <option value="custom_date_range">
                        Custom Date Range
                      </option>
                    </select>
                  )}
                </div>
              </div>
            </div>

            {
              {
                0: (
                  <DashboardCharts
                    filterType={filterType}
                    startDate={startDate}
                    endDate={endDate}
                  />
                ),
                1: (
                  <DashboardPropertyChart
                    activePropertyId={activePropertyId}
                    filterType={filterType}
                    startDate={startDate}
                    endDate={endDate}
                  />
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
