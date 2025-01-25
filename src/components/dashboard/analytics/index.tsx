import { useEffect, useState } from "react";
import { DatePicker } from "antd";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import DashboardCharts from "@/components/DashboardCharts";
import DashboardPropertyChart from "@/components/DashboardPropertyChart";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, ChevronDownIcon, NotificationIcon } from "@/assets/icons";
import { getDate, getDateRange } from "@/lib/utils";
import { useGetProperties } from "@/lib/api/queries";
import { Property } from "@/lib/types";

const { RangePicker } = DatePicker;

function Dashboard() {
  const { data: propertiesData } = useGetProperties();

  const [selectedTab, setSelectedTab] = useState("overview");
  const [properties, setProperties] = useState<Property[]>([]);
  const [activePropertyId, setActivePropertyId] = useState("");
  const [filterType, setFilterType] = useState("last_30_days");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  // Load properties and set defaults
  useEffect(() => {
    if (propertiesData?.length) {
      setProperties(propertiesData);
      setActivePropertyId(propertiesData[0]?._id);
    }
  }, [propertiesData]);

  // Update active property based on selected property
  const handlePropertyChange = (propertyId: string) => {
    setActivePropertyId(propertyId);
  };

  const handleFilterChange = (value: string) => {
    if (value === "custom_date_range") {
      setFilterType(value);
    } else {
      setFilterType(value);
      setStartDate(undefined);
      setEndDate(undefined);
    }
  };

  return (
    <DashboardLayout>
      <div className="no-scrollbar">
        {/* Header Section */}
        <div className="w-full border-b flex justify-between items-center py-4 px-6">
          <div>
            <span className="text-[#808080] text-xs">{getDate()}</span>
            <h3 className="mt-1 text-deepBlue font-medium text-2xl">
              Welcome {user?.firstName || "User"}
            </h3>
          </div>
          <NotificationIcon className="w-5 h-5 cursor-pointer" />
        </div>

        <div className="p-4">
          {/* Tabs for Navigation */}
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <div className="flex flex-wrap w-full gap-4 justify-between items-center mb-4">
              <TabsList className="flex gap-2 w-fit">
                <TabsTrigger value="overview" className="text-sm">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="properties" className="text-sm">
                  Properties
                </TabsTrigger>
              </TabsList>

              {/* Filters and Dropdowns */}
              <div className="flex flex-wrap gap-4 items-center justify-between">
                {selectedTab === "properties" && (
                  <div className="relative flex items-center bg-white border rounded-xl p-2">
                    <select
                      onChange={(e) => handlePropertyChange(e.target.value)}
                      className="outline-none text-secondary text-xs md:text-sm font-light appearance-none border-none bg-transparent pr-6"
                    >
                      {properties.length ? (
                        properties.map((property) => (
                          <option key={property._id} value={property._id}>
                            {property.propertyName}
                          </option>
                        ))
                      ) : (
                        <option value="">No properties available</option>
                      )}
                    </select>
                    <ChevronDownIcon
                      className="absolute pointer-events-none right-2"
                      width={12}
                    />
                  </div>
                )}

                <div className="flex items-center bg-white border rounded-md p-2">
                  <Calendar width={12} />
                  {filterType === "custom_date_range" ? (
                    <div className="flex items-center gap-2">
                      <RangePicker
                        onChange={(_, dateStrings) => {
                          setStartDate(new Date(dateStrings[0]));
                          setEndDate(new Date(dateStrings[1]));
                        }}
                        className="outline-none text-secondary text-xs md:text-sm border-none bg-transparent"
                      />
                      <button
                        onClick={() => setFilterType("last_30_days")}
                        className="text-[10px] text-primary hover:underline"
                      >
                        Switch to Predefined Options
                      </button>
                    </div>
                  ) : (
                    <select
                      onChange={(e) => handleFilterChange(e.target.value)}
                      className="outline-none text-secondary text-xs md:text-sm border-none bg-transparent"
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

            {/* Tab Contents */}
            <TabsContent value="overview">
              <DashboardCharts
                filterType={filterType}
                startDate={startDate}
                endDate={endDate}
              />
            </TabsContent>

            <TabsContent value="properties">
              <DashboardPropertyChart
                activePropertyId={activePropertyId}
                filterType={filterType}
                startDate={startDate}
                endDate={endDate}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
