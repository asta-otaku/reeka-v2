import { useState, useEffect } from "react";
import searchIcon from "../../assets/search-01.svg";
import apiClient from "../../helpers/apiClient";

function StepZero({
  setStep,
  setProperty,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setProperty: React.Dispatch<React.SetStateAction<any>>;
}) {
  const [search, setSearch] = useState<string>("");
  const [selectedApartment, setSelectedApartment] = useState<string | null>();
  const [properties, setProperties] = useState<any>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await apiClient.get(`/properties`);
        setProperties(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProperties();
  }, []);

  return (
    <div className="flex flex-col gap-5 items-center w-full">
      <h3 className="text-xl font-medium text-center">Choose Apartment</h3>
      <div className="flex items-center gap-2 p-2 rounded-3xl bg-[#FAFAFA] w-4/5 lg:w-3/5">
        <img src={searchIcon} alt="search" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="w-full bg-transparent outline-none placeholder:text-xs placeholder:text-[#6D6D6D]"
        />
      </div>

      <div className="grid gap-6 px-6 grid-cols-1 lg:grid-cols-2">
        {properties
          .filter(
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
                <div className="mt-2">
                  <h3 className="text-[#808080] font-medium text-xs">
                    {property?.propertyName}
                  </h3>
                  <p className="text-secondary text-[10px]">
                    {property?.address}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default StepZero;
