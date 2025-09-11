import Cookies from "js-cookie";

export const getCurrencySymbol = (): string => {
  try {
    const user = JSON.parse(Cookies.get("user") || "{}");
    const currency = user.currency;
    return currency === "NGN" ? "₦" : "$";
  } catch (error) {
    console.error("Error getting currency symbol:", error);
    return "$";
  }
};

export const getCurrencyCode = (): "NGN" | "USD" => {
  try {
    const user = JSON.parse(Cookies.get("user") || "{}");
    const currency = user.currency;
    
    // Return NGN if currency is NGN, otherwise default to USD
    return currency === "NGN" ? "NGN" : "USD";
  } catch (error) {
    console.error("Error getting currency code:", error);
    
    return "USD";
  }
};