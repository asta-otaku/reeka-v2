import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLongLeftIcon, NotificationIcon } from "../../assets/icons";
// import NotificationModal from "./NotificationModal";
import DashboardLayout from "../../layouts/DashboardLayout";
import toast from "react-hot-toast";
import Spinner from "../Spinner";
import useStore from "../../store";
import apiClient from "../../helpers/apiClient";
import { useCurrency } from "../../helpers/getCurrency";
import { AirbnbModal, DeleteModal } from "./Modals";

import BookingsTab from "./Tabs/BookingsTab";
import PropertyTab from "./Tabs/PropertyTab";
import RateCardsTab from "./Tabs/RateCardsTab";

const tabs = [
  { name: "Property Details", id: "property_details" },
  { name: "Booking & Reservation", id: "booking_reservation" },
  { name: "Reeka Rate Cards", id: "reeka_rate_cards" },
];

function ViewProperty() {
  const [activeTab, setActiveTab] = useState("property_details");
  const { id } = useParams(); // Get property ID from the URL
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [loadingSync, setLoadingSync] = useState(false);
  const [newImages, setNewImages] = useState<File[]>([]);
  const navigate = useNavigate();
  const setModal = useStore((state: any) => state.setModal);
  const currency = useCurrency();

  const [property, setProperty] = useState<any>({
    propertyName: "",
    address: "",
    city: "",
    country: "",
    baseCurrency: "",
    owner: "",
    employees: [],
    bedroomCount: 0,
    bathroomCount: 0,
    amenities: [],
    price: {
      basePrice: 0,
      airbnbPrice: 0,
    },
    images: [],
  });
  const [bookedStatus, setBookedStatus] = useState(false);
  const [edit, setEdit] = useState(false);
  const [bookings, setBookings] = useState<any>([]);

  // Fetch property details
  useEffect(() => {
    apiClient
      .get(`/properties/${id}`)
      .then((response) => {
        setProperty(response.data);
      })
      .catch((error) => {
        console.error("Property not found", error);
        navigate("/listing");
      });
  }, [id, pending]);

  // Fetch bookings
  useEffect(() => {
    apiClient
      .get(`/booking/property/${id}`)
      .then((response) => {
        setBookings(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  useEffect(() => {
    setBookedStatus(bookings.length > 0);
  }, [bookings]);

  // Delete property function
  const handleDelete = async () => {
    try {
      const res = await apiClient.delete(`/properties/${id}`);
      if (res.status === 204) {
        toast.success("Property deleted successfully");
        setModal(null);
        setTimeout(() => {
          navigate("/listing");
        }, 2000);
      } else {
        toast.error("An error occurred");
      }
    } catch (error) {
      toast.error("Failed to delete property");
      console.error(error);
    }
  };

  // Update property function
  const handleUpdate = async (property: any) => {
    const formData = new FormData();
    formData.append("propertyName", property.propertyName);
    formData.append("address", property.address);
    formData.append("city", property.city);
    formData.append("country", property.country);
    formData.append("baseCurrency", property.baseCurrency);
    formData.append("owner", property.owner);
    formData.append("bedroomCount", property.bedroomCount.toString() || "0");
    formData.append("bathroomCount", property.bathroomCount.toString() || "0");
    formData.append("amenities", JSON.stringify(property.amenities));
    formData.append("price", JSON.stringify(property.price));
    if (property.images && property.images.length > 0) {
      formData.append("images", JSON.stringify(property.images));
    } else {
      formData.append("images", JSON.stringify([]));
    }
    if (newImages.length > 0) {
      newImages.forEach((image) => {
        formData.append("images", image);
      });
    }

    try {
      setLoading(true);
      const res = await apiClient.put(`/properties/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status === 200) {
        toast.success("Property updated successfully");
        setLoading(false);
        setTimeout(() => {
          navigate(`/listing/${id}`);
        }, 2000);
        setEdit(false);
      } else {
        toast.error("An error occurred");
        setLoading(false);
        window.location.reload();
      }
    } catch (error) {
      toast.error("Failed to update property");
      setLoading(false);
      console.error(error);
    }
  };

  // Handle Full Sync
  const handleFullSync = async () => {
    try {
      setLoadingSync(true);
      const response = await apiClient.post(`/properties/full-sync`, {
        propertyId: id,
      });
      if (response.status === 200) {
        toast.success("Property synced successfully");
      } else {
        toast.error("An error occurred during syncing");
      }
    } catch (error: any) {
      toast(error.response.data.error || "Couldn't sync property");
    } finally {
      setLoadingSync(false);
    }
  };

  const openAirbnbModal = () => {
    setModal(
      <AirbnbModal
        initialPrice={property.price.airbnbPrice}
        onCancel={() => setModal(null)}
        onProceed={async (newPrice: number, weekendPrice: number) => {
          const updatedProperty = {
            ...property,
            price: {
              ...property.price,
              airbnbPrice: newPrice,
              airbnbWeekendPrice: weekendPrice,
            },
          };

          await handleUpdate(updatedProperty);
          setProperty(updatedProperty);
          try {
            setPending(true);
            const response = await apiClient.post(
              `/properties/process-property-on-channex`,
              {
                propertyId: id,
              }
            );
            if (response.status === 200) {
              toast.success("Property linked with Airbnb successfully");
              setModal(null);
            } else {
              toast.error("An error occurred during linking");
            }
          } catch (error: any) {
            toast(error.response.data.error || "Couldn't link with Airbnb");
          } finally {
            setPending(false);
            setModal(null);
          }
        }}
      />
    );
  };

  return (
    <DashboardLayout>
      <div>
        <div className="w-full flex justify-between items-center py-4 px-6">
          <div className="flex items-center gap-5">
            <span className="p-2 rounded-full border border-[#DCDCDC]">
              <ArrowLongLeftIcon
                className="w-4 text-secondary cursor-pointer"
                onClick={() => navigate("/listing")}
              />
            </span>
            <h3 className="text-[#808080] font-light text-xs">
              Listing Management /{" "}
              <span className="text-[#121212]">{property?.propertyName}</span>
            </h3>
          </div>
          <NotificationIcon
            onClick={() => setOpenModal(!openModal)}
            className="w-5 h-5 cursor-pointer"
          />
          {/* {openModal && <NotificationModal setOpenModal={setOpenModal} />} */}
        </div>

        <div className="my-4 px-6">
          <h3 className="text-deepBlue font-medium">Listing Management</h3>
          <p className="text-xs text-[#808080]">
            Manage your bookings with ease.
          </p>
        </div>

        <div className="px-6 flex justify-between items-center gap-4 flex-wrap mt-6">
          <div className="flex items-center gap-4">
            <span className="hidden md:block w-32 h-24 bg-[#D9D9D9] rounded-2xl">
              <img
                src={property?.images[0]}
                alt="property"
                className="w-full h-full object-cover rounded-2xl"
              />
            </span>
            <div className="flex flex-col items-start gap-1">
              <span className="bg-[#DBFFE4] rounded-lg font-medium text-xs text-[#34C759] py-1 px-2">
                {bookedStatus ? "Booked" : "Available"}
              </span>
              <h2 className="text-[#121212] font-medium text-lg max-w-[300px] md:max-w-full truncate">
                {property?.propertyName},{" "}
                <span className="text-base">{property?.address}</span>
              </h2>
              <div className="flex items-center gap-2 text-sm text-[#808080]">
                <span>Apartment</span>
                <span className="w-2 h-2 rounded-full bg-[#808080]" />
                <span>
                  {currency}
                  {property?.defaultRate?.ratePrice} per night (
                  {property?.defaultRate?.rateName})
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 relative">
            <div className="flex items-center gap-2">
              {property.channexId ? (
                <button className="px-3 py-2 text-white rounded-lg bg-green-500 text-sm font-medium">
                  Linked with Airbnb
                </button>
              ) : (
                <button
                  onClick={openAirbnbModal}
                  disabled={pending}
                  className="px-3 py-2 text-white rounded-lg bg-secondary text-sm font-medium"
                >
                  {pending ? <Spinner /> : "Link with Airbnb"}
                </button>
              )}
              <button
                onClick={() =>
                  setModal(
                    <DeleteModal
                      handleDelete={handleDelete}
                      setModal={setModal}
                    />
                  )
                }
                className="px-3 py-2 text-white rounded-lg bg-[#FF3B30] text-sm font-medium"
              >
                Delete Property
              </button>
            </div>
            {property.channexId && (
              <button
                onClick={handleFullSync}
                disabled={loadingSync}
                className="bg-blue-500 py-2 px-5 rounded-xl text-white font-medium text-sm border min-w-[150px]"
              >
                {loadingSync ? <Spinner /> : "Full Sync"}
              </button>
            )}
          </div>
        </div>

        <div className="flex border-b border-gray-200 m-4 overflow-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 text-xs md:text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-b-2 border-primary text-primary"
                  : "text-[#808080]"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="my-12">
          {
            {
              property_details: (
                <PropertyTab
                  property={property}
                  setProperty={setProperty}
                  handleUpdate={handleUpdate}
                  newImages={newImages}
                  setNewImages={setNewImages}
                  loading={loading}
                  loadingSync={loadingSync}
                  edit={edit}
                  setEdit={setEdit}
                />
              ),
              booking_reservation: <BookingsTab bookings={bookings} />,
              reeka_rate_cards: <RateCardsTab property={property} />,
            }[activeTab]
          }
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ViewProperty;
