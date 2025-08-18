export interface Property {
  _id: string;
  propertyName: string;
  address: string;
  images: string[];
  isLinkedProperty?: boolean;
  propertyLinkType?: "master" | "constituent";
  masterPropertyId?: string;
  linkedPropertyIds?: string[];
}

// The API returns an array of all linked properties (both master and constituents)
export type LinkedPropertyResponse = Property[];
