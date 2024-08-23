import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import updown from "../assets/updown.svg";
// import avatar from "../assets/avatar.svg";
import plus from "../assets/plus-sign-square.svg";

import {
  // AccountSettingIcon,
  CalendarIcon,
  CloseIcon,
  CodeSandBoxIcon,
  DashboardIcon,
  FileBookmarkIcon,
  Hamburger,
  // ManagerIcon,
  PropertyIcon,
  ScaleIcon,
  // UserCircleIcon,
} from "../assets/icons";
import ModalLayout from "./ModalLayout";
import useStore from "../store";

function DashboardLayout({ children }: any) {
  const currentModal = useStore((state: any) => state.currentModal);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentModal != null) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [currentModal]);
  const [nav, setNav] = useState(false);
  const toggleNav = () => setNav(!nav);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (Object.keys(user).length === 0) {
      navigate("/signin");
    }
  }, [user]);

  return (
    <div className="bg-[#FAFAFA]">
      {/* General Modal */}
      {currentModal && <ModalLayout />}
      <div
        className={`md:flex grow gap-6 p-2 h-screen md:p-6 max-w-[1800px] relative mx-auto ${
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
                {/* <img src={avatar} alt="avatar" /> */}
                {/* <img src={updown} alt="updown" /> */}
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
              <ListItem
                route="/dashboard"
                Icon={DashboardIcon}
                title="Dashboard"
              />
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
                route="/account"
                Icon={UserCircleIcon}
                title="Account"
              /> */}
              <ListItem
                route="/integration"
                Icon={ScaleIcon}
                title="Integration"
              />
              {/* <ListItem
                route="/personnel"
                Icon={ManagerIcon}
                title="Personnel Management"
              /> */}
              {/* <ListItem route="#" Icon={AccountSettingIcon} title="Settings" /> */}
            </ul>
          </div>

          <span className="md:hidden p-2 cursor-pointer" onClick={toggleNav}>
            {nav ? <CloseIcon width={22} /> : <Hamburger width={22} />}
          </span>
        </nav>

        <main className="bg-white md:ml-[232px] lg:ml-[312px] md:max-w-[calc(100vw-312px)] min-h-screen md:max-h-[100vh-48px] no-scrollbar border shadow-sm shadow-gray-300 rounded-xl grow overflow-x-auto">
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
  return (
    <li>
      <Link
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
