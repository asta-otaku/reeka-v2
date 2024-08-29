import blackcancel from "../../assets/blackcancel.svg";
import success from "../../assets/success.svg";

function SuccessModal({ setModal }: any) {
  return (
    <div className="relative bg-[#FAFAFA] max-w-xl w-full rounded-2xl">
      <img
        src={blackcancel}
        className="absolute -top-2 z-10 right-0 cursor-pointer"
        onClick={() => setModal(null)}
      />

      <div className="w-full">
        <img src={success} className="w-full rounded-2xl" />
      </div>
      <div className="p-6 flex justify-between gap-2 items-center">
        <div>
          <h2 className="font-medium text-[#25A545] text-2xl mb-1">
            Successful!
          </h2>
          <p className="text-[#808080] text-xs md:text-sm">
            Your property has been successfully added
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary whitespace-nowrap border border-solid border-primary shadow-sm shadow-primary/40 font-semibold text-xs text-white p-2 rounded-md"
        >
          View Property
        </button>
      </div>
    </div>
  );
}

export default SuccessModal;
