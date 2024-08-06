import { useState } from "react";
import { ArrowLongLeftIcon, NotificationIcon } from "../assets/icons";
import NotificationModal from "./NotificationModal";

function DashboardNav({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div className="py-4 px-6 relative">
        <div className="w-full flex justify-between items-center">
          <span
            className="p-2 rounded-full border border-[#DCDCDC]"
            onClick={() => window.history.back()}
          >
            <ArrowLongLeftIcon className="w-4 text-secondary cursor-pointer" />
          </span>

          <NotificationIcon
            onClick={() => setOpenModal(!openModal)}
            className="w-5 h-5 cursor-pointer"
          />
        </div>
        <h2 className="mt-2 mb-0.5 text-[#121212] font-medium text-2xl">
          {title}
        </h2>
        <p className="text-[#808080] font-light text-sm">{description}</p>
      </div>

      {openModal && <NotificationModal setOpenModal={setOpenModal} />}
    </>
  );
}

export default DashboardNav;
