import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLongLeftIcon, NotificationIcon } from "@/assets/icons";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import searchIcon from "@/assets/search-01.svg";
import BookingTable from "../bookings/BookingTable";
import ReactPaginate from "react-paginate";
import toast from "react-hot-toast";
import PropertyDetails from "./PropertyDetails";
import ImageSection from "./ImageSection";
import Amenities from "./Amenities";
import Pricing from "./Pricing";
import Spinner from "@/components/Spinner";
import { useCurrency } from "@/hooks/use-get-currency";
import {
  useGetBookings,
  useGetPortfolioLink,
  useGetProperty,
} from "@/lib/api/queries";
import { defaultProperty } from "@/lib/utils";
import { usePropertyMutation } from "@/lib/api/mutations";
import DeleteModal from "./DeleteModal";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

function ViewProperty() {
  const { id } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const currency = useCurrency();
  const [edit, setEdit] = useState(false);
  const [bookedStatus, setBookedStatus] = useState(false);
  const [selected, setSelected] = useState(0);
  const [search, setSearch] = useState("");
  const [property, setProperty] = useState<any>(defaultProperty);

  const { refetch, isLoading } = useGetPortfolioLink(id);
  const { data: bookings } = useGetBookings(id);
  const { data } = useGetProperty(id || "");
  const { mutateAsync: updateProperty, isPending: loading } =
    usePropertyMutation();

  useEffect(() => {
    if (data) {
      setProperty(data);
    }
  }, [data]);

  useEffect(() => {
    setBookedStatus((bookings?.length ?? 0) > 0);
  }, [bookings]);

  const handleUpdate = async (method: "put" | "delete") => {
    if (id) {
      await updateProperty({ id, method, data: property });
    } else {
      toast.error("Property ID is missing");
    }
  };

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(0);
  const pageCount = Math.ceil((bookings?.length ?? 0) / itemsPerPage);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const displayedData = bookings
    ?.filter(
      (bk: any) =>
        bk?.properyName?.toLowerCase().includes(search.toLowerCase()) ||
        bk?.address?.toLowerCase().includes(search.toLowerCase()) ||
        bk?.guestFirstName?.toLowerCase().includes(search.toLowerCase()) ||
        bk?.guestLastName?.toLowerCase().includes(search.toLowerCase())
    )
    .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const generatePublicUrl = async () => {
    refetch();
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
            <button
              onClick={generatePublicUrl}
              disabled={isLoading}
              className="bg-primary p-2 rounded-xl text-white shrink-0 font-medium text-sm border border-primary flex-1 md:flex-none"
            >
              {isLoading ? <Spinner /> : "Generate Portfolio Link"}
            </button>
            <Dialog>
              <DialogTrigger asChild>
                <button className="px-3 py-2 text-white rounded-lg bg-[#FF3B30] text-sm font-medium">
                  Delete Property
                </button>
              </DialogTrigger>
              <DialogContent className="p-0 bg-transparent border-none">
                <DeleteModal handleDelete={() => handleUpdate("delete")} />
              </DialogContent>
            </Dialog>
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

            <div className="flex items-center gap-4 mt-6">
              <button
                disabled={loading}
                onClick={() => handleUpdate("put")}
                className="px-3 py-2 text-white rounded-lg bg-primary text-sm font-medium"
              >
                {loading ? <Spinner /> : "Save Changes"}
              </button>
            </div>
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
              <BookingTable data={displayedData || []} />
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
