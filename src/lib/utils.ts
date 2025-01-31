import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import airbnb from "@/assets/airbnb.svg";
import bookingsIcon from "@/assets/Booking.com_logo 2.svg";
// import expedia from "@/assets/expedia.svg";
import finance from "@/assets/finance.svg";
import mpesa from "@/assets/icons8-mpesa-48.png";
import moment from "moment";
// import vrbo from "@/assets/vrbo-removebg-preview 1.svg";
// import trivago from "@/assets/trivago.svg";

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
  const year = date.getFullYear();
  const previousMonth = date.getMonth() === 0 ? 11 : date.getMonth() - 1;
  const previousMonthYear = previousMonth === 11 ? year - 1 : year;

  const startDate = new Date(
    previousMonthYear,
    previousMonth,
    date.getDate() + 1
  );
  const endDate = new Date(year, date.getMonth(), date.getDate());

  const startMonthName = monthNames[startDate.getMonth()];
  const endMonthName = monthNames[endDate.getMonth()];
  const startDateOfMonth = startDate.getDate();
  const endDateOfMonth = endDate.getDate();

  const dateRange = `${startMonthName} ${startDateOfMonth} - ${endMonthName} ${endDateOfMonth}`;

  return dateRange;
}

export function formatTimestamp(timestamp: string, isEndDate = false) {
  const date = moment(timestamp).tz("Africa/Lagos").format();

  // Set hours and minutes based on whether it's a start or end date
  const hours = isEndDate ? "18" : "06";
  const minutes = "00";

  // Return the formatted string in 'YYYY-MM-DD HH:mm' format (in UTC)
  return `${date.split("T")[0]} ${hours}:${minutes}`;
}

export const defaultAnalytics = {
  totalNightsBooked: 0,
  totalRevenue: 0,
  averageNightlyRate: 0,
  occupancyRate: 0,
};

export const defaultPropertyAnalytics = {
  totalBookings: 0,
  revenue: 0,
  averageNightlyRate: 0,
  occupancyRate: 0,
};

export const formatNumber = (num: number): string =>
  num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const bookings: {
  name: string;
  description: string;
  logo: string;
  status: boolean;
  disabled?: boolean;
}[] = [
  {
    name: "Airbnb",
    description: "Manage your bookings with ease.",
    logo: airbnb,
    status: false,
    disabled: true,
  },
  {
    name: "Booking.com",
    description: "Manage your bookings with ease.",
    logo: bookingsIcon,
    status: false,
    disabled: true,
  },
  // {
  //   name: "Expedia",
  //   description: "Manage your bookings with ease.",
  //   logo: expedia,
  //   status: false,
  //   disabled: true,
  // },
  // {
  //   name: "Vrbo",
  //   description: "Manage your bookings with ease.",
  //   logo: vrbo,
  //   status: false,
  //   disabled: true,
  // },
  // {
  //   name: "Trivago",
  //   description: "Manage your bookings with ease.",
  //   logo: trivago,
  //   status: false,
  //   disabled: true,
  // },
];

export const finances: {
  name: string;
  description: string;
  logo: string;
  status: boolean;
  disabled?: boolean;
}[] = [
  {
    name: "Paystack",
    description: "Manage your payments with ease.",
    logo: finance,
    status: false,
    disabled: true,
  },
  {
    name: "Mpesa",
    description: "Manage your payments with ease.",
    logo: mpesa,
    status: false,
    disabled: true,
  },
];

export function getStatus(startDate: string, endDate: string) {
  const start = moment(startDate).tz("Africa/Lagos");
  const end = moment(endDate).tz("Africa/Lagos");
  const currentDate = moment().tz("Africa/Lagos");

  if (currentDate.isAfter(end)) {
    return "Completed";
  } else if (currentDate.isBefore(start)) {
    return "Upcoming";
  } else {
    return "Ongoing";
  }
}

export const settingsTabs = [
  { name: "Password Reset", id: "change_password" },
  { name: "Edit Info", id: "edit_info" },
  { name: "Staff Management", id: "staff_management" },
  { name: "Agent Management", id: "agent_management" },
];

export const roleTypes = [
  "All Roles",
  "Property Manager",
  "Building and Maintenance",
  "Administrator",
  "Cleaning",
  "Associate Manager",
  "Front Desk",
];

export const getRoleColor = (role: string) => {
  switch (role) {
    case "Property Manager":
      return "bg-[#FAF5FF] text-[#9B51E0]";
    case "Building and Maintenance":
      return "bg-[#FFFCF2] text-[#F2C94C]";
    case "Administrator":
      return "bg-[#FFEFE8] text-[#E36B37]";
    case "Cleaning":
      return "bg-[#E9FFF2] text-[#219653]";
    case "Associate Manager":
      return "bg-[#F2F7FF] text-[#2F80ED]";
    case "Front Desk":
      return "bg-[#FFFAF0] text-[#FFA15F]";
    default:
      return "bg-[#FFFAF0] text-[#FFA15F]";
  }
};
