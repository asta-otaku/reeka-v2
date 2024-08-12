import { useEffect, useMemo, useState } from "react";
import { ArrowLongLeftIcon, NotificationIcon } from "../assets/icons";
import countryList from "react-select-country-list";
import Select from "react-select";
import NotificationModal from "./NotificationModal";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import buy from "../assets/Buy.svg";
import cloud from "../assets/cloud-upload-white.svg";
import searchIcon from "../assets/search-01.svg";
import BookingTable from "./BookingTable";
import axios from "axios";
import { CONSTANT } from "../util";

function ViewProperty() {
  const [openModal, setOpenModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { property } = location.state || {};
  const options = useMemo(() => countryList().getData(), []);
  const [value, setValue] = useState("");
  const [facilityList] = useState<any>({
    "Swimming Pool": 0,
    Griller: 0,
    Bathroom: 0,
    "Basket Court": 0,
  });
  const [selected, setSelected] = useState(0);
  const [images, setImages] = useState<any>([...property?.images]);

  const changeHandler = (value: any) => {
    setValue(value);
  };

  const [bookings, setBookings] = useState<any>([]);

  useEffect(() => {
    axios
      .get(`${CONSTANT.BASE_URL}/booking/user/${CONSTANT.USER_ID}`)
      .then((response) => {
        setBookings(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

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

          {openModal && <NotificationModal setOpenModal={setOpenModal} />}
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
                Booked
              </span>
              <h2 className="text-[#121212] font-medium text-lg max-w-[300px] md:max-w-full truncate">
                {property?.propertyName},{" "}
                <span className="text-base">{property?.address}</span>
              </h2>
              <div className="flex items-center gap-2 text-sm text-[#808080]">
                <span>Apartment</span>
                <span className="w-2 h-2 rounded-full bg-[#808080]" />
                <span>$1000 per night</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 text-white rounded-lg bg-primary text-sm font-medium">
              De-List Property
            </button>
            <button className="px-3 py-2 text-white rounded-lg bg-[#FF3B30] text-sm font-medium">
              Delete Property
            </button>
          </div>

          <hr className="w-full mt-2" />
        </div>

        <div className="my-4 flex flex-col lg:flex-row justify-between items-start gap-8 px-6">
          <div className="w-full lg:w-[50%]">
            <form className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="text-[#121212] font-medium text-lg">
                  Property Details
                </h3>
                <button className="text-[#808080] text-xs font-medium">
                  Edit
                </button>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <h4 className="text-[#3A3A3A] text-sm font-medium">
                  Property Name
                </h4>
                <input
                  name="name"
                  value={property.name}
                  placeholder="Name"
                  className="px-4 py-2 border border-[#D0D5DD] rounded-lg focus-within:border-primary outline-none placeholder:text-[#808080] text-[#3A3A3A]"
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 w-full">
                  <h4 className="text-[#3A3A3A] text-sm font-medium">
                    Country
                  </h4>
                  <Select
                    options={options}
                    value={value}
                    onChange={changeHandler}
                  />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <h4 className="text-[#3A3A3A] text-sm font-medium">
                    Address
                  </h4>
                  <input
                    name="address"
                    placeholder="Address"
                    className="px-4 py-2 border border-[#D0D5DD] rounded-lg focus-within:border-primary outline-none placeholder:text-[#808080] text-[#3A3A3A]"
                  />
                </div>
              </div>
            </form>

            <div className="my-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[#121212] font-medium text-lg">Images</h3>
                <button className="text-[#808080] text-xs font-medium">
                  Edit
                </button>
              </div>
              <div className="flex overflow-x-auto w-full no-scrollbar py-4">
                {images.map((image: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      transform:
                        index === 0
                          ? ""
                          : `rotate(${Math.floor(
                              Math.random() * (15 - -15 + 1) + -15
                            )}deg)`,
                      zIndex: index % 2 === 0 ? 1 : 0,
                    }}
                    className="relative min-w-32 min-h-28 rounded-xl border-2 border-white"
                  >
                    <img
                      src={image}
                      alt="property"
                      className="object-cover rounded-xl w-36 h-28"
                    />
                  </div>
                ))}
                <span
                  onClick={() => {
                    const fileInput = document.getElementById("file");
                    if (fileInput) {
                      fileInput.click();
                    }
                  }}
                  className="flex flex-col gap-1 items-center justify-center min-w-32 min-h-28 rounded-xl border-2 border-white text-white bg-[#C4C4C4]"
                >
                  <img src={cloud} alt="cloud" />
                  <h4 className="text-xs font-light max-w-12 text-center">
                    Add Pictures
                  </h4>
                  <input
                    type="file"
                    id="file"
                    className="hidden"
                    onChange={(e: any) => {
                      setImages((prev: any) => [
                        ...prev,
                        URL.createObjectURL(e.target.files[0]),
                      ]);
                    }}
                  />
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-[#121212] font-medium text-lg">
                  Amenities
                </h3>
                <button className="text-[#808080] text-xs font-medium">
                  Edit
                </button>
              </div>
              <div className="flex gap-2 my-4 flex-wrap">
                {Object.keys(facilityList).map((facility, index) => (
                  <div
                    key={index}
                    className="bg-[#FAFAFA] text-[#808080] border flex items-center gap-1 p-2 rounded-lg text-xs"
                  >
                    <img src={buy} alt="buy" />
                    <span>{facility}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="my-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[#121212] font-medium text-lg">Price</h3>
                <button className="text-[#808080] text-xs font-medium">
                  Edit
                </button>
              </div>
              <form className="flex flex-col gap-2">
                <div className="flex flex-col gap-2 w-full">
                  <h4 className="text-[#3A3A3A] text-sm font-medium">
                    Base Price
                  </h4>
                  <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-md p-2 w-full">
                    <input
                      name="basePrice"
                      placeholder="$"
                      className="w-full outline-none bg-transparent"
                    />
                    <h4 className="text-[#808080]">/Night</h4>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2 w-full">
                    <h4 className="text-[#3A3A3A] text-sm font-medium">
                      Min Price
                    </h4>
                    <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-md p-2 w-full">
                      <input
                        name="minPrice"
                        placeholder="$"
                        className="w-full outline-none bg-transparent"
                      />
                      <h4 className="text-[#808080]">/Night</h4>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <h4 className="text-[#3A3A3A] text-sm font-medium">
                      Max Price
                    </h4>
                    <div className="flex items-center justify-between gap-1 bg-white border border-solid border-[#D0D5DD] shadow-sm shadow-[#1018280D] rounded-md p-2 w-full">
                      <input
                        name="maxPrice"
                        placeholder="$"
                        className="w-full outline-none bg-transparent"
                      />
                      <h4 className="text-[#808080]">/Night</h4>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="w-full lg:w-[48%] rounded-2xl border shadow-xl shadow-gray-300">
            <div className="border-b p-4 flex items-center gap-2">
              <img src={searchIcon} alt="search" />
              <input
                type="text"
                placeholder="Search"
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
              <button
                onClick={() => setSelected(1)}
                className={`text-sm pb-2 ${
                  selected === 1
                    ? " text-primary border-b border-primary"
                    : "text-[#808080]"
                }`}
              >
                Finance
              </button>
            </div>
            <div className="px-4 overflow-x-auto">
              <BookingTable data={bookings} setData={setBookings} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ViewProperty;
