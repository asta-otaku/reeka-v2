import { useNavigate } from "react-router-dom";
import { ChevronDownIcon } from "../assets/icons";
import DashboardNav from "../components/DashboardNav";
import DashboardLayout from "../layouts/DashboardLayout";
import CustomCalendar from "../components/CustomCalendar";
import { useEffect, useState } from "react";
import apiClient from "../helpers/apiClient";

function Calendar() {
  const navigate = useNavigate();
  const [bookingsArray, setBookingsArray] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>([]);
  const [showPropertyFilter, setShowPropertyFilter] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await apiClient.get(`/properties`);
        setProperties(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    apiClient
      .get(`/booking`)
      .then((response) => {
        const colorMap: { [key: string]: string } = {};

        const formattedBookings = response.data.map((booking: any) => {
          const propertyName = booking?.propertyDetails?.propertyName;

          if (!colorMap[propertyName]) {
            colorMap[propertyName] =
              "#" + Math.floor(Math.random() * 16777215).toString(16);
          }

          return {
            _id: booking.id,
            propertyName: propertyName,
            propertyId: booking?.propertyDetails?._id,
            guestFirstName: booking.guestFirstName,
            guestLastName: booking.guestLastName,
            startDate: booking.startDate,
            endDate: booking.endDate,
            color: colorMap[propertyName],
            numberOfGuests: booking.numberOfGuests,
            totalBookingValue: booking.totalBookingValue,
            currency: booking.currency,
            ...booking,
          };
        });

        setBookingsArray(formattedBookings);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Handle property selection
  const handleToggleProperty = (propertyId: string) => {
    setSelectedPropertyIds((prev) => {
      if (prev.includes(propertyId)) {
        return prev.filter((id) => id !== propertyId);
      } else if (prev.length < 5) {
        return [...prev, propertyId];
      } else {
        // If trying to select more than 5, show a warning or prevent selection
        return prev;
      }
    });
  };

  // Handle select all/deselect all
  const handleSelectAll = () => {
    if (
      selectedPropertyIds.length === properties.length ||
      selectedPropertyIds.length === 5
    ) {
      setSelectedPropertyIds([]);
    } else {
      // Select up to 5 properties
      setSelectedPropertyIds(properties.slice(0, 5).map((p: any) => p._id));
    }
  };

  // Filter bookings based on selected properties
  const getFilteredBookings = () => {
    if (selectedPropertyIds.length === 0) {
      return bookingsArray;
    }
    return bookingsArray.filter((booking) =>
      selectedPropertyIds.includes(booking.propertyId)
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".property-filter-dropdown")) {
        setShowPropertyFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <DashboardLayout>
      <div>
        <DashboardNav
          title="Calendar"
          description="Create, edit and send reservations."
        />

        <div className="flex flex-wrap gap-4 items-center justify-between w-full my-4 px-6">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="relative property-filter-dropdown">
              <div
                onClick={() => setShowPropertyFilter(!showPropertyFilter)}
                className="relative flex items-center justify-center gap-2 bg-white border border-solid rounded-xl p-2 w-fit cursor-pointer hover:bg-gray-50"
              >
                <span className="text-secondary text-xs md:text-sm font-light">
                  {selectedPropertyIds.length === 0
                    ? "All Properties"
                    : `${selectedPropertyIds.length} Propert${
                        selectedPropertyIds.length !== 1 ? "ies" : "y"
                      } Selected`}
                </span>
                <ChevronDownIcon
                  className={`cursor-pointer transition-transform ${
                    showPropertyFilter ? "rotate-180" : ""
                  }`}
                  width={12}
                />
              </div>

              {showPropertyFilter && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-[#D0D5DD] rounded-xl shadow-lg min-w-[280px] max-w-sm z-50">
                  <div className="p-3 border-b border-[#EAECF0]">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-[#3A3A3A] text-sm font-medium">
                        Select Properties
                      </h4>
                      <button
                        type="button"
                        onClick={handleSelectAll}
                        className="text-xs text-primary underline hover:no-underline"
                        disabled={properties.length === 0}
                      >
                        {selectedPropertyIds.length === properties.length ||
                        selectedPropertyIds.length === 5
                          ? "Deselect all"
                          : "Select all"}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Select up to 5 properties to filter calendar view
                    </p>
                  </div>

                  <div
                    className="max-h-[40vh] overflow-y-auto"
                    onWheel={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    onTouchMove={(e) => e.stopPropagation()}
                    onScroll={(e) => e.stopPropagation()}
                  >
                    {properties.map((property: any) => {
                      const isSelected = selectedPropertyIds.includes(
                        property._id
                      );
                      const isDisabled =
                        !isSelected && selectedPropertyIds.length >= 5;

                      return (
                        <div
                          key={property._id}
                          className={`flex items-center gap-3 p-3 border-b border-[#EAECF0] last:border-b-0 hover:bg-gray-50 ${
                            isDisabled
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                          onClick={() => {
                            if (!isDisabled) {
                              handleToggleProperty(property._id);
                            }
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleProperty(property._id)}
                            disabled={isDisabled}
                            id={`calendar-property-${property._id}`}
                            className="accent-primary h-4 w-4 rounded border-gray-300 cursor-pointer"
                          />
                          <label
                            htmlFor={`calendar-property-${property._id}`}
                            className={`text-sm flex-1 ${
                              isDisabled
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-700 cursor-pointer"
                            }`}
                          >
                            {property.propertyName}
                          </label>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3 border-t border-[#EAECF0] bg-gray-50 rounded-b-xl">
                    <p className="text-xs text-gray-600">
                      {selectedPropertyIds.length} of 5 properties selected
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Show selected properties as tags */}
            {selectedPropertyIds.length > 0 && (
              <div className="hidden md:flex items-center gap-2 flex-wrap">
                {selectedPropertyIds.slice(0, 3).map((propertyId) => {
                  const property = properties.find((p) => p._id === propertyId);
                  return property ? (
                    <div
                      key={propertyId}
                      className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-md"
                    >
                      <span className="truncate max-w-[100px]">
                        {property.propertyName}
                      </span>
                      <button
                        onClick={() => handleToggleProperty(propertyId)}
                        className="hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                        >
                          <path
                            d="M2.5 2.5L7.5 7.5M7.5 2.5L2.5 7.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : null;
                })}
                {selectedPropertyIds.length > 3 && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                    +{selectedPropertyIds.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/reservation")}
              className="bg-primary p-2 rounded-xl text-white font-medium text-sm border border-primary hover:bg-primary/90 transition-colors"
            >
              Create Reservation
            </button>
          </div>
        </div>

        <div className="px-6 my-6">
          <CustomCalendar
            bookings={getFilteredBookings()}
            selectedPropertyIds={selectedPropertyIds}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Calendar;
