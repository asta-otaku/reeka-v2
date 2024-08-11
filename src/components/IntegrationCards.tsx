import unlink from "../assets/unlink-03.svg";

function Cards({
  list,
  setList,
  tag,
}: {
  list: {
    name: string;
    description: string;
    logo: string;
    status: boolean;
  }[];
  setList: React.Dispatch<React.SetStateAction<any>>;
  tag: boolean;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {list
        .filter((bk) => bk.status === tag)
        .map((booking: any, index: number) => (
          <div
            key={index}
            className="bg-[#F5F5F5] p-4 rounded-2xl border flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <img src={booking.logo} alt={booking.name} />
              <div>
                <h1 className="text-[#121212] font-medium">{booking.name}</h1>
                <p className="text-[#808080] truncate max-w-[150px] md:max-w-full text-xs font-light">
                  {booking.description}
                </p>
              </div>
            </div>
            <button
              disabled={booking?.disabled}
              onClick={() => {
                setList((prev: any) =>
                  prev.map((bk: any) =>
                    bk.name === booking.name
                      ? { ...bk, status: !bk.status }
                      : bk
                  )
                );
              }}
              style={{
                cursor: booking?.disabled ? "not-allowed" : "pointer",
              }}
              className={`${
                tag ? "bg-primary w-28 h-9" : "bg-[#FAFAFA] w-24 h-10"
              } p-2 rounded-lg flex items-center gap-2 justify-center`}
            >
              <img
                src={tag ? unlink : booking.logo}
                alt={booking.name}
                className="w-4"
              />
              <span
                className={`text-xs font-medium ${
                  tag ? "text-white" : "text-black"
                }`}
              >
                {tag ? "Disconnect" : "Set Up"}
              </span>
            </button>
          </div>
        ))}
    </div>
  );
}

export default Cards;
