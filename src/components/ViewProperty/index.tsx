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

function ViewProperty() {
  const { id } = useParams(); // Get property ID from the URL
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
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
  }, [id]);

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

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("propertyName", property.propertyName);
    formData.append("address", property.address);
    formData.append("city", property.city);
    formData.append("country", property.country);
    formData.append("baseCurrency", property.baseCurrency);
    formData.append("owner", property.owner);
    formData.append("employees", JSON.stringify([]));
    formData.append("bedroomCount", property.bedroomCount.toString());
    formData.append("bathroomCount", property.bathroomCount.toString());
    formData.append("amenities", JSON.stringify(property.amenities));
    formData.append("price", JSON.stringify(property.price));
    property.images.forEach((image: any) => {
      formData.append("images", image);
    });

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
      }
    } catch (error) {
      toast.error("Failed to update property");
      setLoading(false);
      console.error(error);
    }
  };

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(0);
  const pageCount = Math.ceil(bookings.length / itemsPerPage);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const displayedData = bookings
    .filter(
      (bk: any) =>
        bk?.properyName?.toLowerCase().includes(search.toLowerCase()) ||
        bk?.address?.toLowerCase().includes(search.toLowerCase()) ||
        bk?.guestFirstName?.toLowerCase().includes(search.toLowerCase()) ||
        bk?.guestLastName?.toLowerCase().includes(search.toLowerCase())
    )
    .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  // const generatePublicUrl = async () => {
  //   try {
  //     const response = await apiClient.get(`/public/url`, {
  //       params: { propertyId: id },
  //     });
  //     navigator.clipboard.writeText(response.data);
  //     toast.success("Public URL copied to clipboard");
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

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
          <div className="flex items-center gap-2">
            {/* <button className="px-3 py-2 text-white rounded-lg bg-primary text-sm font-medium">
              De-List Property
            </button> */}
            {/* <button
              onClick={generatePublicUrl}
              className="bg-primary p-2 rounded-xl text-white shrink-0 font-medium text-sm border border-primary flex-1 md:flex-none"
            >
              Generate Portfolio Link
            </button> */}
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

            <div className="flex items-center gap-4 my-6">
              <button
                disabled={loading}
                onClick={handleUpdate}
                className={`px-3 py-2 text-white rounded-lg bg-primary text-sm font-medium ${
                  !edit && "hidden"
                }`}
              >
                {loading ? <Spinner /> : "Save Changes"}
              </button>
            </div>

            <AirBnbPricing id={property._id} />
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
              {/* <button
                onClick={() => setSelected(1)}
                className={`text-sm pb-2 ${
                  selected === 1
                    ? " text-primary border-b border-primary"
                    : "text-[#808080]"
                }`}
              >
                Finance
              </button> */}
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

function DeleteModal({ handleDelete, setModal }: any) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="border border-[#C0C0C0] rounded-2xl p-1.5 bg-[#FAFAFA] max-w-xs w-full relative"
    >
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <h3 className="text-[#121212] font-medium text-sm">Delete Property</h3>
        <span
          onClick={() => setModal(null)}
          className="cursor-pointer text-[#808080]"
        >
          X
        </span>
      </div>
      <div className="p-4">
        <p className="text-[#808080] text-xs">
          Are you sure you want to delete this property?
        </p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={handleDelete}
            className="px-3 py-1.5 text-white rounded-xl bg-[#FF3B30] text-sm font-medium"
          >
            Yes
          </button>
          <button
            onClick={() => setModal(null)}
            className="px-3 py-1.5 text-white rounded-xl bg-green-500 text-sm font-medium"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
