interface HeaderProps {
  setStep: (step: number) => void;
}

function Header({ setStep }: HeaderProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-start md:items-center justify-between mb-8">
      <div>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
          Property Linking Management
        </h2>
        <p className="text-gray-600 text-sm max-w-2xl">
          Create property groups by linking multiple properties together. Select
          a master property and add constituents to form a unified listing.
        </p>
      </div>
      <button
        onClick={() => setStep(1)}
        className="bg-white text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm border border-gray-200 font-medium"
      >
        ← Back to Listings
      </button>
    </div>
  );
}

export default Header;
