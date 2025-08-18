import { useEffect, useState } from "react";
// import { ChevronDownIcon } from "../assets/icons";
import DashboardNav from "../components/DashboardNav";
import DashboardLayout from "../layouts/DashboardLayout";
import gridIcon from "../assets/grid-view.svg";
import line from "../assets/line.svg";
import menuIcon from "../assets/menu-01.svg";
import searchIcon from "../assets/search-01.svg";
import AddProperty from "../components/AddProperty";
import PropertyLinkingManagement from "../components/PropertyLinkingManagement";
import { useNavigate } from "react-router-dom";
import apiClient from "../helpers/apiClient";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

function ListingManagement() {
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState("");
  const [grid, setGrid] = useState(false);
  const [properties, setProperties] = useState([]);
  const user = JSON.parse(Cookies.get("user") || "{}");
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [copyUrl, setCopyUrl] = useState("");

  const navigate = useNavigate();

  const fetchProperties = async () => {
    try {
      const response = await apiClient.get(`/properties`);
      setProperties(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const generatePublicUrl = async () => {
    try {
      const response = await apiClient.get(`/public/url`);
      const url = response.data;
      const isClipboardSupported =
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function" &&
        window.isSecureContext;

      if (isClipboardSupported) {
        try {
          await navigator.clipboard.writeText(url);
          toast.success("Public URL copied to clipboard");
        } catch (clipboardError) {
          console.warn(
            "Clipboard API failed, falling back to modal:",
            clipboardError
          );
          setCopyUrl(url);
          setShowCopyModal(true);
        }
      } else {
        setCopyUrl(url);
        setShowCopyModal(true);
      }
    } catch (error) {
      console.error("Error generating public URL:", error);
      toast.error("Failed to generate public URL");
    }
  };

  const handleLegacyCopy = () => {
    const input = document.createElement("input");
    input.value = copyUrl;
    input.style.position = "absolute";
    input.style.left = "-9999px";
    input.style.opacity = "0";
    document.body.appendChild(input);

    try {
      input.focus();
      input.select();
      input.setSelectionRange(0, copyUrl.length);

      if (
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function"
      ) {
        navigator.clipboard
          .writeText(copyUrl)
          .then(() => {
            toast.success("Public URL copied to clipboard");
            setShowCopyModal(false);
          })
          .catch(() => {
            const success = document.execCommand("copy");
            if (success) {
              toast.success("Public URL copied to clipboard");
            } else {
              toast.error("Could not copy. Please copy manually.");
            }
            setShowCopyModal(false);
          });
      } else {
        const success = document.execCommand("copy");
        if (success) {
          toast.success("Public URL copied to clipboard");
        } else {
          toast.error("Could not copy. Please copy manually.");
        }
        setShowCopyModal(false);
      }
    } catch (err) {
      console.error("Copy failed:", err);
      toast.error("Could not copy. Please copy manually.");
      setShowCopyModal(false);
    } finally {
      document.body.removeChild(input);
    }
  };

  return (
    <>
      <DashboardLayout>
        {
          {
            1: (
              <div>
                <DashboardNav
                  title="Listing Management"
                  description="Manage your bookings with ease."
                />

                <div className="flex flex-wrap gap-4 items-center justify-between w-full my-4 px-6">
                  {/* <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center justify-center gap-2 bg-white border border-solid rounded-xl p-2 w-fit">
                    <select className="outline-none text-secondary text-xs md:text-sm font-light appearance-none border-none bg-transparent">
                      <option>All Locations</option>
                    </select>
                    <ChevronDownIcon width={12} />
                  </div>
                  <div className="flex items-center justify-center gap-2 bg-white border border-solid rounded-xl p-2 w-fit">
                    <select className="outline-none text-secondary text-xs md:text-sm font-light appearance-none border-none bg-transparent">
                      <option>Listed</option>
                    </select>
                    <ChevronDownIcon width={12} />
                  </div>
                </div> */}

                  <div className="flex w-full flex-wrap lg:flex-nowrap justify-between items-center gap-4">
                    <div className="max-w-5xl w-full flex gap-2 border border-solid border-[#E4E4E4] bg-[#F5F5F5] rounded-xl p-3">
                      <img src={searchIcon} className="w-5" />
                      <input
                        type="search"
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search"
                        className="outline-none text-secondary text-xs bg-transparent w-full"
                      />
                    </div>
                    <img src={line} />
                    <img
                      src={menuIcon}
                      onClick={() => setGrid(true)}
                      className="cursor-pointer"
                    />
                    <img src={line} />
                    <img
                      src={gridIcon}
                      className="cursor-pointer"
                      onClick={() => setGrid(false)}
                    />
                    <img src={line} />
                    <button
                      onClick={() => setStep(2)}
                      className={`bg-primary p-2 rounded-xl text-white shrink-0 font-medium text-sm border border-primary ${
                        user && user.userRole !== "Owner" && "hidden"
                      }`}
                    >
                      Add Property
                    </button>
                    <button
                      onClick={generatePublicUrl}
                      className={`bg-primary p-2 rounded-xl text-white shrink-0 whitespace-nowrap font-medium text-sm border border-primary flex-1 md:flex-none ${
                        user && user.userRole !== "Owner" && "hidden"
                      }`}
                    >
                      Generate Portfolio Link
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className={`bg-green-600 p-2 rounded-xl text-white shrink-0 whitespace-nowrap font-medium text-sm border border-green-600 flex-1 md:flex-none ${
                        user && user.userRole !== "Owner" && "hidden"
                      }`}
                    >
                      Property Linking
                    </button>
                  </div>
                </div>

                <div
                  className={`grid gap-6 px-6 ${
                    grid ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"
                  }`}
                >
                  {properties
                    .filter(
                      (property: any) =>
                        property.propertyName
                          .toLowerCase()
                          .includes(search.toLowerCase()) ||
                        property?.address
                          .toLowerCase()
                          .includes(search.toLowerCase())
                    )
                    .map((property: any, index) => (
                      <div
                        key={index}
                        onClick={() => navigate(`/listing/${property?._id}`)}
                        className="bg-[#FAFAFA] rounded-xl shadow-sm shadow-black/10 p-3 cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div
                            className={`${
                              grid && "flex gap-3 items-center"
                            } w-full`}
                          >
                            <img
                              src={property?.images[0]}
                              alt="property"
                              className={`${
                                grid
                                  ? "w-28 h-16 hidden md:block"
                                  : "h-48 w-full"
                              } object-cover rounded-xl`}
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
                      </div>
                    ))}
                </div>
              </div>
            ),
            2: <AddProperty setStep={setStep} />,
            3: (
              <PropertyLinkingManagement
                setStep={setStep}
                properties={properties}
                onPropertiesChange={fetchProperties}
              />
            ),
          }[step]
        }
        {showCopyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
              <h3 className="text-lg font-semibold mb-3">Copy Public URL</h3>
              <div className="relative mb-3">
                <input
                  type="text"
                  value={copyUrl}
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm pr-20"
                  onFocus={(e) => e.target.select()}
                />
                <button
                  onClick={() => {
                    const input = document.querySelector(
                      "input[readonly]"
                    ) as HTMLInputElement;
                    if (input) {
                      input.select();
                      input.setSelectionRange(0, copyUrl.length);
                    }
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-blue-600 hover:text-blue-800"
                >
                  Select All
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleLegacyCopy}
                  className="flex-1 text-sm px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90"
                >
                  Copy to Clipboard
                </button>
                <button
                  onClick={() => setShowCopyModal(false)}
                  className="flex-1 text-sm px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </>
  );
}

export default ListingManagement;
