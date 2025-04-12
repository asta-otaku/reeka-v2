import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLongLeftIcon, NotificationIcon } from "../../assets/icons";
// import NotificationModal from "./NotificationModal";
import DashboardLayout from "../../layouts/DashboardLayout";
import searchIcon from "../../assets/search-01.svg";
import BookingTable from "../BookingTable";
import ReactPaginate from "react-paginate";
import toast from "react-hot-toast";
import PropertyDetails from "./PropertyDetails";
import ImageSection from "./ImageSection";
import Amenities from "./Amenities";
import Pricing from "./Pricing";
import Spinner from "../Spinner";
import useStore from "../../store";
import apiClient from "../../helpers/apiClient";
import { useCurrency } from "../../helpers/getCurrency";
import AirBnbPricing from "./AirBnbPricing";
import { AirbnbModal, DeleteModal } from "./Modals";
import FeeSection, { PricePreview } from "./FeeSection";

function ViewProperty() {
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
      discountPercentage: 0,
      boostPercentage: 0,
    },
    images: [],
  });
  const [bookedStatus, setBookedStatus] = useState(false);
  const [edit, setEdit] = useState(false);
  const [selected, setSelected] = useState(0);
  const [search, setSearch] = useState("");
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

  // Pagination
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(0);
  const pageCount = Math.ceil(bookings.length / itemsPerPage);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };
  const [showPreview, setShowPreview] = useState(false);

  const displayedData = bookings
    .filter(
      (bk: any) =>
        bk?.properyName?.toLowerCase().includes(search.toLowerCase()) ||
        bk?.address?.toLowerCase().includes(search.toLowerCase()) ||
        bk?.guestFirstName?.toLowerCase().includes(search.toLowerCase()) ||
        bk?.guestLastName?.toLowerCase().includes(search.toLowerCase())
    )
    .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

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
                  {property?.price?.basePrice} per night
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

          <hr className="w-full mt-2" />
        </div>

        <div className="my-4 flex flex-col lg:flex-row justify-between items-start gap-8 px-6">
          <div className="w-full lg:w-[50%]">
            <PropertyDetails
              property={property}
              setProperty={setProperty}
              edit={edit}
              setEdit={setEdit}
            />
            <ImageSection
              property={property}
              setProperty={setProperty}
              edit={edit}
              newImages={newImages}
              setNewImages={setNewImages}
            />
            <Amenities
              property={property}
              setProperty={setProperty}
              edit={edit}
            />
            <Pricing
              property={property}
              setProperty={setProperty}
              edit={edit}
            />
            <FeeSection
              cautionFee={property.price.cautionFee}
              setCautionFee={(val) =>
                setProperty({
                  ...property,
                  price: { ...property.price, cautionFee: val },
                })
              }
              edit={edit}
            />
            {showPreview && (
              <PricePreview
                basePrice={property.price.basePrice}
                cautionFee={property.price.cautionFee || 0}
              />
            )}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="mt-2 text-[#3498db] underline text-sm"
            >
              {showPreview ? "Hide Price Preview" : "Show Price Preview"}
            </button>
            <div className="flex items-center gap-4 my-6">
              <button
                disabled={loading}
                onClick={() => handleUpdate(property)}
                className={`px-3 py-2 text-white rounded-lg bg-primary text-sm font-medium ${
                  !edit && "hidden"
                }`}
              >
                {loading ? <Spinner /> : "Save Changes"}
              </button>
            </div>
            <AirBnbPricing id={property._id} loading={loadingSync} />
          </div>

          <div className="w-full lg:w-[48%] rounded-2xl border shadow-xl shadow-gray-300">
            <div className="border-b p-4 flex items-center gap-2">
              <img src={searchIcon} alt="search" />
              <input
                type="text"
                placeholder="Search"
                onChange={(e) => setSearch(e.target.value)}
                className="w-full outline-none bg-transparent text-[#808080] text-xs"
              />
            </div>
            <div className="flex items-center gap-6 w-full border-b border-0 my-4 px-4">
              <button
                onClick={() => setSelected(0)}
                className={`text-sm pb-2 ${
                  selected === 0
                    ? " text-primary border-b border-primary"
                    : "text-[#808080]"
                }`}
              >
                Booking
              </button>
            </div>
            <div className="px-4 overflow-auto max-h-[400px] no-scrollbar">
              <BookingTable data={displayedData} />
              <ReactPaginate
                previousLabel={""}
                nextLabel={""}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={2}
                onPageChange={handlePageChange}
                pageClassName="block border hover:bg-primary/80 hover:text-white border-primary rounded-lg p-1.5 cursor-pointer"
                containerClassName="flex justify-center items-center font-medium mt-12 gap-5"
                activeClassName="bg-primary border border-primary text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ViewProperty;
