import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import plus from "../assets/plus-sign-square.svg";

import {
  AccountSettingIcon,
  CalendarIcon,
  CloseIcon,
  Cog6ToothIcon,
  CodeSandBoxIcon,
  DashboardIcon,
  FileBookmarkIcon,
  Hamburger,
  PropertyIcon,
  ScaleIcon,
  // IncidentReportIcon,
} from "../assets/icons";
import ModalLayout from "./ModalLayout";
import useStore from "../store";
import toast from "react-hot-toast";
import apiClient from "../helpers/apiClient";
import Cookies from "js-cookie";

function DashboardLayout({ children }: any) {
  const currentModal = useStore((state: any) => state.currentModal);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentModal != null) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [currentModal]);
  const [nav, setNav] = useState(false);
  const toggleNav = () => setNav(!nav);
  const user = JSON.parse(Cookies.get("user") || "{}");
  const location = useLocation();

  useEffect(() => {
    if (Object.keys(user).length === 0) {
      navigate("/signin");
    }
    if (
      user &&
      user.userRole !== "Owner" &&
      location.pathname === "/dashboard"
    ) {
      navigate("/listing");
    }
    if (
      user &&
      user.userRole !== "Owner" &&
      location.pathname === "/integration"
    ) {
      navigate("/listing");
    }
  }, [user]);

  useEffect(() => {
    if (user && user.userRole === "Owner") {
      const fetchPricing = async () => {
        try {
          const res = await apiClient.get(`/subscriptions/user-subscription`);
          if (res.data.planType === "") {
            window.location.href = "/pricing";
          }
        } catch (error: any) {
          if (error.response) {
            setTimeout(() => navigate("/pricing"), 500);
          }
        }
      };

      fetchPricing();
    }
  }, []);

  return (
    <div className="bg-[#FAFAFA]">
      {/* General Modal */}
      {currentModal && <ModalLayout />}
      <div
        className={`md:flex grow gap-6 p-2 min-h-screen md:p-6 max-w-[1800px] relative mx-auto ${
          currentModal && "blur-sm"
        }`}
      >
        {/* Nav section */}
        <nav className="w-full grow md:w-[200px] lg:w-[280px] md:fixed z-[100] flex shrink-0 justify-between">
          <div className="w-full flex flex-col">
            <div className="flex items-center justify-between border rounded-2xl p-3">
              <Link
                to="/"
                className="text-2xl font-modak text-primary flex grow"
              >
                Reeka
              </Link>
              <div className="flex gap-2">
                <img
                  alt="profile"
                  src={
                    user?.image ??
                    `https://ui-avatars.com/api/?name=${encodeURI(
                      user.firstName + " " + user.lastName
                    )}`
                  }
                  width={35}
                  height={35}
                  className="rounded-full border-2 border-blue-1"
                />
              </div>
            </div>

            <button
              onClick={() => navigate("/reservation")}
              className="bg-primary my-5 p-3 flex items-center justify-center gap-2 font-semibold rounded-xl text-white text-sm border border-primary"
            >
              <img src={plus} alt="plus" />
              Create Reservation
            </button>
            <ul
              className={`${
                nav ? "block" : "hidden"
              } md:block font-medium w-full`}
            >
              <div
                className={`${user && user.userRole !== "Owner" && "hidden"}`}
              >
                <ListItem
                  route="/dashboard"
                  Icon={DashboardIcon}
                  title="Dashboard"
                />
              </div>

              <ListItem
                route="/listing"
                Icon={CodeSandBoxIcon}
                title="Listing Management"
              />
              <ListItem
                route="/calendar"
                Icon={CalendarIcon}
                title="Calendar"
              />
              <ListItem
                route="/report"
                Icon={PropertyIcon}
                title="Report Center"
              />
              <ListItem
                route="/booking"
                Icon={FileBookmarkIcon}
                title="Reservation Management"
              />
              {/* <ListItem
                route="/incident-report"
                Icon={IncidentReportIcon}
                title="Incident Report"
              /> */}
              <div
                className={`${user && user.userRole !== "Owner" && "hidden"}`}
              >
                <ListItem
                  route="/integration"
                  Icon={ScaleIcon}
                  title="Integration"
                />
              </div>

              <ListItem
                route="/settings"
                Icon={Cog6ToothIcon}
                title="Settings"
              />
              <ListItem route="#" Icon={AccountSettingIcon} title="Logout" />
            </ul>
          </div>

          <span className="md:hidden p-2 cursor-pointer" onClick={toggleNav}>
            {nav ? <CloseIcon width={22} /> : <Hamburger width={22} />}
          </span>
        </nav>

        <main className="bg-white md:ml-[232px] lg:ml-[312px] md:max-w-[calc(100vw-350px)] min-h-screen border shadow-sm shadow-gray-300 rounded-xl grow w-full overflow-none pb-10">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;

function ListItem({
  route,
  Icon,
  title,
}: {
  route: string;
  Icon: React.ComponentType<React.SVGAttributes<SVGElement>>;
  title: string;
}) {
  const location = useLocation();
  const userSessionDetails = JSON.parse(Cookies.get("user") || "{}");
  const { staffId } = userSessionDetails;

  const handleLogout = async () => {
    try {
      if (staffId) {
        await apiClient.post("/auth/logout", { staffId });
      } else {
        await apiClient.post("/auth/logout");
      }
      toast.success("Logged out successfully");
      Cookies.remove("user");
      window.location.href = "/signin";
    } catch (error) {
      toast.error("An error occurred. Please try again");
    }
  };
  return (
    <li>
      <Link
        onClick={() => {
          if (route === "#") {
            handleLogout();
          }
        }}
        to={route}
        className={`flex gap-3 items-center w-full p-2 my-1.5 hover:bg-primary/20 rounded-md no-underline ${
          location.pathname.startsWith(route)
            ? "bg-white text-primary"
            : "text-secondary"
        }`}
      >
        <Icon
          width={22}
          color={location.pathname === route ? "#E36B37" : "#6D6D6D"}
        />
        <span>{title}</span>
      </Link>
    </li>
  );
}
