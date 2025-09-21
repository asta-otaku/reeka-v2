import React, { useState } from "react";
import moment from "moment";
import { ChevronLeftIcon, ChevronRightIcon, X } from "lucide-react";
import useStore from "../store";

interface Booking {
  _id: string;
  propertyName: string;
  propertyId: string;
  guestFirstName: string;
  guestLastName: string;
  guestEmail?: string;
  guestPhone?: string;
  startDate: string;
  endDate: string;
  color: string;
  numberOfGuests: number;
  numberOfChildren?: number;
  totalBookingValue: number;
  currency: string;
  status?: string;
  paymentStatus?: string;
  nightsBooked?: number;
  cautionFee?: number;
  agentFee?: number;
  agentName?: string;
  note?: string;
  includeNote?: boolean;
  sourcePlatform?: string;
  isVirtualMasterBooking?: boolean;
  originalBookingId?: string;
  originalPropertyName?: string;
  originalBookingIds?: string[];
  originalPropertyNames?: string;
  constituentBookingsCount?: number;
  propertyDetails?: any;
}

interface CustomCalendarProps {
  bookings: Booking[];
  selectedPropertyIds: string[];
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  bookings,
  selectedPropertyIds,
}) => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [_, setSelectedDay] = useState<moment.Moment | null>(null);
  const setModal = useStore((state: any) => state.setModal);

  const getDaysForView = () => {
    switch (viewMode) {
      case "day":
        return [currentDate.clone()];
      case "week":
        const weekStart = currentDate.clone().startOf("week");
        const weekDays = [];
        for (let i = 0; i < 7; i++) {
          weekDays.push(weekStart.clone().add(i, "day"));
        }
        return weekDays;
      case "month":
      default:
        const start = currentDate.clone().startOf("month").startOf("week");
        const end = currentDate.clone().endOf("month").endOf("week");
        const monthDays = [];
        let day = start.clone();
        while (day.isSameOrBefore(end)) {
          monthDays.push(day.clone());
          day.add(1, "day");
        }
        return monthDays;
    }
  };

  const getBookingsForDate = (date: moment.Moment) => {
    return bookings.filter((booking) => {
      const start = moment.utc(booking.startDate);
      const end = moment.utc(booking.endDate);
      return date.isBetween(start, end, "day", "[]");
    });
  };

  const goToPrevious = () => {
    switch (viewMode) {
      case "day":
        setCurrentDate(currentDate.clone().subtract(1, "day"));
        break;
      case "week":
        setCurrentDate(currentDate.clone().subtract(1, "week"));
        break;
      case "month":
        setCurrentDate(currentDate.clone().subtract(1, "month"));
        break;
    }
  };

  const goToNext = () => {
    switch (viewMode) {
      case "day":
        setCurrentDate(currentDate.clone().add(1, "day"));
        break;
      case "week":
        setCurrentDate(currentDate.clone().add(1, "week"));
        break;
      case "month":
        setCurrentDate(currentDate.clone().add(1, "month"));
        break;
    }
  };

  const goToToday = () => {
    setCurrentDate(moment());
  };

  const handleDayClick = (day: moment.Moment) => {
    const dayBookings = getBookingsForDate(day);
    setSelectedDay(day);

    const modalContent = (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-lg shadow-xl max-w-xs md:max-w-sm lg:max-w-xl w-full max-h-[80vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between p-3 sm:p-4 border-b">
            <div>
              <h3 className="text-base sm:text-lg font-semibold">
                Bookings for {day.format("MMMM D, YYYY")}
              </h3>
              {selectedPropertyIds.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Showing bookings for {selectedPropertyIds.length} selected
                  propert{selectedPropertyIds.length !== 1 ? "ies" : "y"}
                </p>
              )}
            </div>
            <button
              onClick={() => setModal(null)}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg"
            >
              <X width={18} className="sm:w-5" />
            </button>
          </div>
          <div className="p-3 sm:p-4 overflow-y-auto max-h-[70vh] sm:max-h-[60vh]">
            {dayBookings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No bookings for this date</p>
                {selectedPropertyIds.length > 0 && (
                  <p className="text-xs mt-1">
                    Try adjusting your property filter
                  </p>
                )}
              </div>
            ) : (
              dayBookings.map((booking) => (
                <div
                  key={booking._id}
                  onClick={() => {
                    setModal(null);
                  }}
                  className="p-3 sm:p-4 border border-gray-200 rounded-lg mb-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  style={{ borderLeft: `4px solid ${booking.color}` }}
                >
                  {booking.isVirtualMasterBooking && (
                    <div className="mb-2 px-2 py-1 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                      {booking.constituentBookingsCount &&
                      booking.constituentBookingsCount > 0
                        ? "Master Property blocked by Constituent Properties"
                        : null}
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm sm:text-base">
                        {booking.guestFirstName} {booking.guestLastName}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {booking.guestEmail}
                      </div>
                      {booking.guestPhone && (
                        <div className="text-xs text-gray-600">
                          {booking.guestPhone}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "Cancelled"
                            ? "bg-red-100 text-red-800"
                            : booking.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs sm:text-sm text-gray-600 mb-2">
                    {booking.propertyName}
                    {booking.isVirtualMasterBooking && (
                      <span className="ml-1 text-blue-600 font-medium">
                        (Master Property)
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-2">
                    <div>
                      <span className="font-medium">Check-in:</span>{" "}
                      {moment.utc(booking.startDate).format("MMM D, YYYY")}
                    </div>
                    <div>
                      <span className="font-medium">Check-out:</span>{" "}
                      {moment.utc(booking.endDate).format("MMM D, YYYY")}
                    </div>
                    <div>
                      <span className="font-medium">Nights:</span>{" "}
                      {booking.nightsBooked ||
                        moment
                          .utc(booking.endDate)
                          .diff(moment.utc(booking.startDate), "days")}
                    </div>
                    <div>
                      <span className="font-medium">Guests:</span>{" "}
                      {booking.numberOfGuests}
                      {booking.numberOfChildren &&
                      booking.numberOfChildren > 0 ? (
                        <span> ({booking.numberOfChildren} children)</span>
                      ) : null}
                    </div>
                  </div>

                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-gray-900">
                        Total: {booking.currency}{" "}
                        {booking.totalBookingValue?.toLocaleString()}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          booking.paymentStatus === "paid"
                            ? "bg-green-100 text-green-800"
                            : booking.paymentStatus === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : booking.paymentStatus === "failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </div>

                    {booking.cautionFee && booking.cautionFee > 0 ? (
                      <div className="text-xs text-gray-500 mt-1">
                        Caution Fee: {booking.currency}{" "}
                        {booking.cautionFee.toLocaleString()}
                      </div>
                    ) : null}
                  </div>

                  {booking.note && booking.includeNote ? (
                    <div className="text-xs text-gray-500 mt-2 pt-2 border-t">
                      <span className="font-medium">Note:</span> {booking.note}
                    </div>
                  ) : null}

                  <div className="text-xs text-gray-400 mt-2 pt-2 border-t">
                    <span className="font-medium">Source:</span>{" "}
                    {booking.sourcePlatform}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );

    setModal(modalContent);
  };

  const days = getDaysForView();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getViewTitle = () => {
    switch (viewMode) {
      case "day":
        return currentDate.format("MMMM D, YYYY");
      case "week":
        const weekStart = currentDate.clone().startOf("week");
        const weekEnd = currentDate.clone().endOf("week");
        return `${weekStart.format("MMM D")} - ${weekEnd.format(
          "MMM D, YYYY"
        )}`;
      case "month":
      default:
        return currentDate.format("MMMM YYYY");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 border-b gap-3 sm:gap-0">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={goToPrevious}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeftIcon width={18} className="sm:w-5" />
          </button>
          <button
            onClick={goToToday}
            className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            TODAY
          </button>
          <button
            onClick={goToNext}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRightIcon width={18} className="sm:w-5" />
          </button>
        </div>

        <div className="text-center">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            {getViewTitle()}
          </h2>
          {selectedPropertyIds.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Filtered by {selectedPropertyIds.length} propert
              {selectedPropertyIds.length !== 1 ? "ies" : "y"}
            </p>
          )}
        </div>

        <div className="flex gap-1">
          {(["day", "week", "month"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                viewMode === mode
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {mode.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-2 sm:p-4">
        {viewMode !== "day" && (
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="p-1 sm:p-2 text-center text-xs sm:text-sm font-medium text-gray-600"
              >
                {day}
              </div>
            ))}
          </div>
        )}

        <div
          className={`grid gap-1 ${
            viewMode === "day" ? "grid-cols-1" : "grid-cols-7"
          }`}
        >
          {days.map((day, index) => {
            const isCurrentMonth = day.month() === currentDate.month();
            const isToday = day.isSame(moment(), "day");
            const dayBookings = getBookingsForDate(day);
            const showMoreButton = dayBookings.length > 5;
            const displayBookings = dayBookings.slice(0, 5);

            return (
              <div
                key={index}
                className={`min-h-[60px] sm:min-h-[80px] p-1 sm:p-2 border border-gray-100 ${
                  isCurrentMonth ? "bg-white" : "bg-gray-50"
                } ${
                  isToday ? "bg-primary/10 border-primary" : ""
                } cursor-pointer hover:bg-gray-50 transition-colors`}
                onClick={() => handleDayClick(day)}
              >
                <div
                  className={`text-xs sm:text-sm font-medium mb-1 ${
                    isCurrentMonth ? "text-gray-900" : "text-gray-400"
                  } ${isToday ? "text-primary" : ""}`}
                >
                  {day.format("D")}
                </div>

                <div className="space-y-0.5 sm:space-y-1">
                  {displayBookings.map((booking) => (
                    <div
                      key={booking._id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDayClick(day);
                      }}
                      className={`text-xs p-0.5 sm:p-1 rounded cursor-pointer hover:opacity-80 transition-opacity ${
                        booking.isVirtualMasterBooking
                          ? "border border-white/30"
                          : ""
                      }`}
                      style={{ backgroundColor: booking.color }}
                    >
                      <div className="font-medium text-white truncate text-xs">
                        {booking.guestFirstName} {booking.guestLastName}
                        {booking.isVirtualMasterBooking && (
                          <span className="ml-1">📋</span>
                        )}
                      </div>
                      <div className="text-white/80 truncate text-xs hidden sm:block">
                        {booking.propertyName}
                        {booking.isVirtualMasterBooking && (
                          <span className="text-white/60 text-xs">
                            {" "}
                            (Master)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {showMoreButton && (
                    <div className="text-xs text-primary font-medium text-center py-0.5 sm:py-1 cursor-pointer hover:text-primary/80">
                      +{dayBookings.length - 5} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {bookings.length === 0 && selectedPropertyIds.length > 0 && (
        <div className="text-center py-8 text-gray-500 border-t">
          <p>No bookings found for the selected properties</p>
          <p className="text-xs mt-1">Try adjusting your property selection</p>
        </div>
      )}
    </div>
  );
};

export default CustomCalendar;
