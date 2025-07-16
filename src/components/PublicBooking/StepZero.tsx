import { useState, useEffect } from "react";
import searchIcon from "../../assets/search-01.svg";
import { useLocation, useParams } from "react-router-dom";
import apiClient from "../../helpers/apiClient";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { BedDouble, Bath } from "lucide-react";
import ImageCarousel from "./ImageCarousel";

const { RangePicker } = DatePicker;

function getAmenityValue(property: any, keys: string[]): number {
  // Check for direct count fields only
  if (keys.some((key) => key.toLowerCase().includes("bedroom"))) {
    return property.bedroomCount || 0;
  }

  if (keys.some((key) => key.toLowerCase().includes("bathroom"))) {
    return property.bathroomCount || 0;
  }

  return 0;
}

function StepZero({
  setStep,
  setProperty,
  setFormDetails,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setProperty: React.Dispatch<React.SetStateAction<any>>;
  setFormDetails: React.Dispatch<React.SetStateAction<any>>;
}) {
  const [search, setSearch] = useState<string>("");
  const [selectedApartment, setSelectedApartment] = useState<string | null>();
  const { id, propId, token } = useParams();
  const location = useLocation();
  const [properties, setProperties] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null]
  >([null, null]);
  const [bedroomFilter, setBedroomFilter] = useState<number | null>(null);

  // Handle date range change
  const handleDateChange = (dates: any) => {
    setDateRange(dates);
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const apiEndpoint = location.pathname.includes("/agent")
          ? `/agents/property`
          : `/public/property/${token}`;

        // Prepare query parameters
        const params: any = {};

        if (location.pathname.includes("/agent")) {
          params.publicKey = id;
        }

        // Add date range if selected
        if (dateRange && dateRange[0] && dateRange[1]) {
          params.startDate = dateRange[0].format("YYYY-MM-DD");
          params.endDate = dateRange[1].format("YYYY-MM-DD");
        }

        const response = await apiClient.get(apiEndpoint, { params });
        setProperties(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProperties();
  }, [id, location.pathname, dateRange]);

  useEffect(() => {
    if (propId && properties.length > 0) {
      const matchingProperty = properties.find(
        (property: any) => property._id === propId
      );

      if (matchingProperty) {
        setSelectedApartment(propId);
        setProperty(matchingProperty);
        setFormDetails((prev: any) => ({
          ...prev,
          price: matchingProperty?.defaultRate?.ratePrice?.toString(),
          rateId: matchingProperty.defaultRate._id,
          rateName: matchingProperty.defaultRate.rateName,
          userId: matchingProperty.id,
        }));
        setStep(1);
      } else {
        console.error("Property with propId not found");
      }
    }
  }, [propId, properties]);

  return (
    <div className="flex flex-col gap-5 items-center w-full">
      <h3 className="text-xl font-medium text-center">Choose Apartment</h3>

      {/* Date Range Picker and Bedroom Filter */}
      <div className="w-full md:w-4/5">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-sm text-gray-600 mb-1">
              Search by availability
            </label>
            <RangePicker
              format="DD/MM/YYYY"
              placeholder={["Start Date", "End Date"]}
              className="w-full rounded-xl border border-gray-300 p-3"
              onChange={handleDateChange}
              minDate={dayjs().startOf("day")}
              value={dateRange}
            />
          </div>
          <div className="flex-1">
            <label className="text-sm text-gray-600 mb-1">Bedrooms</label>
            <select
              value={bedroomFilter === null ? "" : bedroomFilter}
              onChange={(e) =>
                setBedroomFilter(e.target.value ? Number(e.target.value) : null)
              }
              className="w-full rounded-xl border border-gray-300 p-3 text-sm bg-white"
            >
              <option value="">Filter by Bedrooms</option>
              <option value="0">Studio</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="4">4 Bedrooms</option>
              <option value="5">5+ Bedrooms</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 p-2 rounded-3xl bg-[#FAFAFA] w-full md:w-4/5 lg:w-3/5">
        <img src={searchIcon} alt="search" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by property name or address"
          className="w-full bg-transparent outline-none placeholder:text-xs placeholder:text-[#6D6D6D]"
        />
      </div>

      <div className="grid gap-6 px-6 grid-cols-1 lg:grid-cols-2 w-full">
        {properties
          ?.filter((property: any) => {
            // Text search filter
            const textMatch =
              property?.propertyName
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
              property?.address?.toLowerCase().includes(search.toLowerCase());

            if (!textMatch) return false;

            // Get bedroom count
            const bedroomCount = getAmenityValue(property, [
              "Bedroom",
              "Bedrooms",
              "bedroom",
              "bedrooms",
            ]);

            // Bedroom filter
            if (bedroomFilter !== null) {
              if (bedroomFilter === 5) {
                // 5+ bedrooms
                if (bedroomCount < 5) return false;
              } else {
                // Exact match
                if (bedroomCount !== bedroomFilter) return false;
              }
            }

            return true;
          })
          .map((property: any) => {
            const bedroomCount = getAmenityValue(property, [
              "Bedroom",
              "Bedrooms",
              "bedroom",
              "bedrooms",
            ]);
            const bathroomCount = getAmenityValue(property, [
              "Bathroom",
              "Bathrooms",
              "bathroom",
              "bathrooms",
            ]);
            return (
              <div
                key={property._id}
                onClick={() => {
                  setSelectedApartment(property._id);
                  setProperty(property);
                  setStep(1);
                }}
                className={`rounded-2xl bg-white shadow-sm p-0 cursor-pointer transition border ${
                  selectedApartment === property._id
                    ? "border-primary"
                    : "border-[#E4E4E4]"
                }`}
              >
                {/* Image Carousel */}
                <div className="rounded-2xl overflow-hidden relative">
                  <ImageCarousel
                    images={
                      property.images && property.images.length > 0
                        ? property.images
                        : []
                    }
                    className="h-60"
                    navigationSize="small"
                    paginationSize="small"
                  />
                </div>
                <div className="p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[#FF5A1F] font-semibold text-base">
                      ₦{property.defaultRate.ratePrice.toLocaleString()}
                      <span className="text-xs font-normal text-[#808080]">
                        /Night
                      </span>
                    </span>
                  </div>
                  <div className="font-semibold text-base mb-1">
                    {property.propertyName}
                  </div>
                  <div className="text-xs text-[#808080] mb-2 line-clamp-1">
                    {property.address}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="flex items-center gap-1 px-2 py-1 bg-[#FAFAFA] rounded-full border text-xs">
                      <BedDouble size={14} /> {bedroomCount} Bedroom
                      {bedroomCount === 1 ? "" : "s"}
                    </span>
                    <span className="flex items-center gap-1 px-2 py-1 bg-[#FAFAFA] rounded-full border text-xs">
                      <Bath size={14} /> {bathroomCount} Bathroom
                      {bathroomCount === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default StepZero;
