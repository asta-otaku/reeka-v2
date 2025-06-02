import { useState, useEffect } from "react";
import searchIcon from "../../assets/search-01.svg";
import { useLocation, useParams } from "react-router-dom";
import apiClient from "../../helpers/apiClient";

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

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const apiEndpoint = location.pathname.includes("/agent")
          ? `/agents/property`
          : `/public/property/${token}`;

        const params = location.pathname.includes("/agent")
          ? { publicKey: id }
          : {};

        const response = await apiClient.get(apiEndpoint, { params });
        setProperties(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProperties();
  }, [id, location.pathname]);

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
      <div className="flex items-center gap-2 p-2 rounded-3xl bg-[#FAFAFA] w-full md:w-4/5 lg:w-3/5">
        <img src={searchIcon} alt="search" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="w-full bg-transparent outline-none placeholder:text-xs placeholder:text-[#6D6D6D]"
        />
      </div>

      <div className="grid gap-6 px-6 grid-cols-1 lg:grid-cols-2 w-full">
        {properties
          ?.filter(
            (property: any) =>
              property?.propertyName
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
              property?.address?.toLowerCase().includes(search.toLowerCase())
          )
          .map((property: any) => (
            <div
              key={property._id}
              onClick={() => {
                setSelectedApartment(property._id);
                setProperty(property);
                setStep(1);
              }}
              className={`bg-[#FAFAFA] rounded-xl shadow-sm shadow-black/10 p-3 cursor-pointer ${
                selectedApartment === property._id
                  ? "border-2 border-primary"
                  : "border-2"
              }`}
            >
              <div>
                <img
                  src={property?.images[0]}
                  alt="property"
                  className="h-48 w-full object-cover rounded-xl"
                />
                <div className="mt-2 flex flex-wrap justify-between items-center gap-2">
                  <div>
                    <h3 className="text-[#808080] font-medium text-xs">
                      {property?.propertyName}
                    </h3>
                    <p className="text-secondary text-[10px]">
                      {property?.address}
                    </p>
                  </div>
                  <div>
                    <p className="text-secondary text-[10px] font-medium">
                      {property?.price?.basePrice?.toLocaleString()}/ night
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default StepZero;
