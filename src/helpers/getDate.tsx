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
  const currentDate = new Date(Date.now());

  // Calculate the start date (30 days ago)
  const startDate = new Date();
  startDate.setDate(currentDate.getDate() - 29);

  // Format the start and end dates
  const startMonthName = monthNames[startDate.getMonth()];
  const endMonthName = monthNames[currentDate.getMonth()];
  const startDateOfMonth = startDate.getDate();
  const endDateOfMonth = currentDate.getDate();

  // Format the result
  const dateRange = `${startMonthName} ${startDateOfMonth} - ${endMonthName} ${endDateOfMonth}`;

  return dateRange;
}
