export interface Property {
  _id: string;
  propertyName: string;
  address: string;
  city: string;
  country: string;
  baseCurrency: string;
  owner: string;
  employees: string[];
  price: {
    airbnbPrice: number;
    airbnbWeekendPrice: number;
    basePrice: number;
    cautionFee: number;
    discountPercentage: number;
    boostPercentage: number;
    _id: string;
  };
  pricingState: string;
  bedroomCount: number;
  bathroomCount: number;
  amenities: Record<string, number>;
  images: string[];
  email: string;
  phoneNumber: string;
  zipCode: string;
  longitude: number;
  latitude: number;
  timezone: string;
  type: string;
  logo: string;
  description: string;
  channexId: string;
  channexRoomId?: string;
  channexRatePlans: string[];
  minStay: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  agentFee: number;
  defaultRate?: {
    _id: string;
    rateName: string;
    ratePrice: number;
    propertyId: string;
    isDefault: boolean;
    id: string;
  };
  supportedCurrencies: string[];
  paymentProviders: {
    [key: string]: string;
  };
  isLinkedProperty?: boolean;
  propertyLinkType?: "master" | "constituent";
  masterPropertyId?: string;
  linkedPropertyIds?: string[];
  id?: string;
}

// The API returns an array of all linked properties (both master and constituents)
export type LinkedPropertyResponse = Property[];
