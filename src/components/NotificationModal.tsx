import { useState } from "react";
import { ChevronDownIcon } from "../assets/icons";
import cancelIcon from "../assets/cancel-01.svg";

const notificationsList: {
  title: string;
  date: string;
  read: boolean;
  category: string;
}[] = [
  {
    title: "Feyi Makinde just checked into Ame' palace",
    date: "Friday 24th August 2023, 10:24AM",
    read: false,
    category: "check-in",
  },
  {
    title: "Feyi Makinde just checked out of Ame' palace",
    date: "Friday 24th August 2023, 10:24AM",
    read: false,
    category: "check-out",
  },
  {
    title: "Feyi Makinde has not confirmed reservation send reminder ",
    date: "Friday 24th August 2023, 10:24AM",
    read: false,
    category: "task",
  },
  {
    title: "Imole cleaning service just arrived Ame' palace",
    date: "Friday 24th August 2023, 10:24AM",
    read: true,
    category: "check-in",
  },
];

function NotificationModal({
  setOpenModal,
}: {
  setOpenModal: (value: boolean) => void;
}) {
  const [selected, setSelected] = useState(0);
  const [notifications, setNotifications] = useState(notificationsList);

  const handleSelect = (e: any) => {
    const value = e.target.value;
    if (value === "task") {
      setSelected(3);
    } else if (value === "check-in") {
      setSelected(1);
    } else if (value === "check-out") {
      setSelected(2);
    } else {
      setSelected(0);
    }
  };

  return (
    <div className="fixed top-40 md:top-20 right-2 md:right-14 rounded-2xl max-w-xs md:max-w-2xl w-full bg-white border py-6 z-50">
      <div className="flex w-full justify-between items-center px-4">
        <h2 className="text-[#121212] font-medium text-lg md:text-2xl">
          Notifications
        </h2>
        <span onClick={() => setOpenModal(false)} className="cursor-pointer">
          <img src={cancelIcon} alt="cancel" className="w-5 md:w-fit" />
        </span>
      </div>

      <div className="flex w-full justify-between items-center my-4 px-4">
        <div className="relative flex items-center justify-between gap-2 bg-white border border-solid rounded-lg p-2 min-w-[100px]">
          <select
            onChange={handleSelect}
            className="outline-none text-secondary text-xs md:text-sm appearance-none border-none bg-transparent absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          >
            <option>All</option>
            <option value="check-in">Check-in</option>
            <option value="check-out">Check-out</option>
            <option value="task">Tasks</option>
          </select>
          <span className="pointer-events-none flex items-center">
            <span className="text-secondary text-xs md:text-sm">All</span>
            <ChevronDownIcon width={12} />
          </span>
        </div>
        <button
          onClick={() => {
            const newList = notifications.map((nt) => {
              nt.read = true;
              return nt;
            });
            setNotifications(newList);
          }}
          className="border rounded-lg p-2 text-[#6D6D6D] text-xs font-light"
        >
          Mark all as read
        </button>
      </div>

      <div>
        <div className="flex items-center gap-6 w-full border-b border-0 pl-6">
          <button
            onClick={() => setSelected(0)}
            className={`text-sm pb-2 ${
              selected === 0
                ? " text-primary border-b border-primary"
                : "text-[#808080]"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelected(1)}
            className={`text-sm pb-2 ${
              selected === 1
                ? " text-primary border-b border-primary"
                : "text-[#808080]"
            }`}
          >
            Check-In
          </button>
          <button
            onClick={() => setSelected(2)}
            className={`text-sm pb-2 ${
              selected === 2
                ? " text-primary border-b border-primary"
                : "text-[#808080]"
            }`}
          >
            Check-Out
          </button>
          <button
            onClick={() => setSelected(3)}
            className={`text-sm pb-2 ${
              selected === 3
                ? " text-primary border-b border-primary"
                : "text-[#808080]"
            }`}
          >
            Tasks
          </button>
        </div>

        <div className="overflow-x-auto min-w-full">
          {notifications
            .filter((nt) =>
              selected === 0
                ? nt
                : selected === 1
                ? nt.category === "check-in"
                : selected === 2
                ? nt.category === "check-out"
                : selected === 3
                ? nt.category === "task"
                : nt
            )
            .map((notification, index) => (
              <div
                key={index}
                onClick={() => {
                  const newList = notifications.map((nt) => {
                    if (nt.title === notification.title) {
                      nt.read = true;
                    }
                    return nt;
                  });
                  setNotifications(newList);
                }}
                className="px-6 py-3 border-0 border-b flex justify-between items-center hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#D9D9D9]" />
                  <div>
                    <h2 className="text-[#121212] text-sm truncate max-w-[200px] lg:max-w-full">
                      {notification.title}
                    </h2>
                    <p className="tetx-[#808080] font-light text-xs truncate max-w-[200px] lg:max-w-full">
                      {notification.date}
                    </p>

                    <button
                      className={`bg-primary text-white p-1.5 rounded-lg text-xs font-medium mt-2 ${
                        notification.category !== "task" ? "hidden" : ""
                      }`}
                    >
                      Send Email
                    </button>
                  </div>
                </div>

                <span
                  className={`w-2 h-2 rounded-full ${
                    notification.read === true
                      ? "bg-transparent"
                      : "bg-[#F94144]"
                  }`}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default NotificationModal;
