function DeleteStaffModal({ handleDelete, setModal }: any) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="border border-[#C0C0C0] rounded-2xl p-1.5 bg-[#FAFAFA] max-w-xs w-full relative"
    >
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <h3 className="text-[#121212] font-medium text-sm">Delete Staff</h3>
        <span
          onClick={() => setModal(null)}
          className="cursor-pointer text-[#808080]"
        >
          X
        </span>
      </div>
      <div className="p-4">
        <p className="text-[#808080] text-xs">
          Are you sure you want to delete this staff?
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

export default DeleteStaffModal;
