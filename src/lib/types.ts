export type SignIn = {
  email: string;
  password: string;
};
export type SignUp = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  country: string;
  countryCode: string;
  phoneNumber: string;
  invitationToken?: string;
};
export interface PricingCardProps {
  title: string;
  planType: string;
  description: string;
  price: number | string;
  features: string[];
  bgColor: string;
  secondaryBgColor: string;
  textColor: string;
  btnColor: string;
  btnTextColor: string;
  onSelectPlan: (plan: string) => void;
}
export type PricingPlan = {
  _id: string;
  userId: string;
  planType: string;
  paystackSubscriptionId: string;
  authCode: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export interface Property {
  _id: string;
  propertyName: string;
  address: string;
  city: string;
  country: string;
  baseCurrency: string;
  owner: string;
  employees: any[];
  price: {
    airbnbPrice: number;
    basePrice: number;
    discountPercentage: number;
    boostPercentage: number;
    _id: string;
  };
  pricingState: string;
  bedroomCount: number;
  bathroomCount: number;
  amenities: {
    [key: string]: number;
  };
  images: string[];
  email: string;
  phoneNumber: string;
  zipCode: string;
  longtitude: number;
  latitude: number;
  timezone: string;
  type: string;
  logo: string;
  description: string;
  channexId: string | null;
  channexRatePlans: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface dahsboardCardData {
  totalNightsBooked: number;
  totalRevenue: number;
  averageNightlyRate: number;
  occupancyRate: number;
}

export interface dashboardGraphData {
  totalRevenue: number;
  totalNightsBooked: number;
  date: string;
  averageNightlyRate: number;
}

export interface dashboardPropertyCardData {
  totalBookings: number;
  revenue: number;
  averageNightlyRate: number;
  occupancyRate: number;
}

export interface dashboardPropertyGraphData {
  date: string;
  bookings: number;
  revenue: number;
  averageNightlyRate: number;
}

export interface Bookings {
  agentId: string | null;
  _id: string;
  propertyId: Property;
  userId: string;
  startDate: string;
  endDate: string;
  status: string;
  sourcePlatform: string;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  guestPhone: string;
  invoices: string[];
  totalBookingValue: number;
  paymentStatus: string;
  numberOfGuests: number;
  numberOfChildren: number;
  priceState: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  nightsBooked: number;
  id: string;
  color?: string;
}

export interface EditUser {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
}

export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  joinedAt: string;
  properties: string[];
  propertyNames: string[];
  role?: string;
  isActive?: boolean;
}

export type EditFormState = {
  name: string;
  role?: string;
  phoneNumber: string;
};

export type EditStaffModalProps = {
  staff: Staff;
  onUpdate: (id: string, updatedData: Partial<Staff>) => void;
  isAgent?: boolean;
};
