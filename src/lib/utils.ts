import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isTokenExpired = (token: string | null) => {
  if (!token) return true;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    const payload = JSON.parse(window.atob(base64));

    // Check if the token is expired
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true;
  }
};

export const pricingPlans = [
  {
    title: "Trial",
    planType: "Free Trial",
    description: "Property management built for you to scale",
    price: "0",
    features: [
      "Up to 25 Properties",
      "Payment Processing",
      "Calendar Sync",
      "0.5% Transaction Fee on Direct Bookings",
    ],
    bgColor: "#E36B37",
    secondaryBgColor: "#E9895F",
    textColor: "#FFFFFF",
    btnColor: "#FFFFFF",
    btnTextColor: "#121212",
  },
  {
    title: "Basic",
    planType: "Reeka Light",
    description:
      "Basic tier to help you formalize your short-term rental business",
    price: "10,000",
    features: [
      "Up to 2 Properties",
      "Payment Processing",
      "Calendar Sync",
      "1% Transaction Fee on Direct Bookings",
    ],
    bgColor: "#FFE9DF",
    secondaryBgColor: "#FFEDE5",
    textColor: "#121212",
    btnColor: "#121212",
    btnTextColor: "#FFFFFF",
  },
  {
    title: "Premier",
    planType: "Reeka Premier",
    description: "Property management built for you to scale",
    price: "20,000",
    features: [
      "Up to 25 Properties",
      "Payment Processing",
      "Calendar Sync",
      "0.5% Transaction Fee on Direct Bookings",
    ],
    bgColor: "#E36B37",
    secondaryBgColor: "#E9895F",
    textColor: "#FFFFFF",
    btnColor: "#FFFFFF",
    btnTextColor: "#121212",
  },
  {
    title: "Pro",
    planType: "Reeka Pro",
    description: "Our highest tier built for whatever your business could need",
    price: "50,000",
    features: [
      "Unlimited Number of Properties",
      "Payment Processing",
      "Calendar Sync",
      "Live Staff Onboarding Training",
      "0.1% Transaction Fee on Direct Bookings",
    ],
    bgColor: "#FFE9DF",
    secondaryBgColor: "#FFEDE5",
    textColor: "#121212",
    btnColor: "#121212",
    btnTextColor: "#FFFFFF",
  },
];

export const getColor = (status: string) => {
  switch (status) {
    case "ongoing":
      return "#E36B37";
    case "upcoming":
      return "#56CCF2";
    case "done":
      return "#219653";
    case "canceled":
      return "#EB5757";
    default:
      return "#E36B37";
  }
};

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

  // Calculate the previous month and handle the year change if needed
  const previousMonth = date.getMonth() === 0 ? 11 : date.getMonth() - 1;
  const previousMonthYear = previousMonth === 11 ? year - 1 : year;

  // Construct the start and end dates
  const startDate = new Date(
    previousMonthYear,
    previousMonth,
    date.getDate() + 1
  ); // First day of the previous month
  const endDate = new Date(year, date.getMonth(), date.getDate()); // Current day

  // Format the start and end dates
  const startMonthName = monthNames[startDate.getMonth()];
  const endMonthName = monthNames[endDate.getMonth()];
  const startDateOfMonth = startDate.getDate();
  const endDateOfMonth = endDate.getDate();

  // Format the result
  const dateRange = `${startMonthName} ${startDateOfMonth} - ${endMonthName} ${endDateOfMonth}`;

  return dateRange;
}
