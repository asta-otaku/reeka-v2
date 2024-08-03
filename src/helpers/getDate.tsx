const date = new Date(Date.now());
const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function getCurrentDate() {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export function getDate() {
  const dayOfWeek = dayNames[date.getDay()];
  const month = monthNames[date.getMonth()];
  const dateOfMonth = date.getDate();
  const year = date.getFullYear();
  return `${dayOfWeek}, ${month} ${dateOfMonth} ${year}`;
}

export function getDateRange() {
  const date = new Date(Date.now());

  // Get the year of the timestamp
  const year = date.getFullYear();

  // Calculate the next month and handle the year change if needed
  const nextMonth = date.getMonth() + 1 === 12 ? 0 : date.getMonth() + 1;
  const nextMonthYear = nextMonth === 0 ? year + 1 : year;

  // Construct the start and end dates
  const startDate = new Date(year, date.getMonth(), date.getDate()); // January 4th of the provided year
  const endDate = new Date(nextMonthYear, nextMonth, date.getDate()); // February 4th of the next month/year

  // Format the start and end dates
  const startMonthName = monthNames[startDate.getMonth()];
  const endMonthName = monthNames[endDate.getMonth()];
  const startDateOfMonth = startDate.getDate();
  const endDateOfMonth = endDate.getDate();

  // Format the result
  return `${startMonthName} ${startDateOfMonth} - ${endMonthName} ${endDateOfMonth}`;
}
