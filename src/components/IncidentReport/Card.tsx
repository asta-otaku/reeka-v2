import { IncidentReport } from "../../pages/IncidentReportCenter";
import IncidentModal from "./Modal";

interface CardProps {
  setModal: any;
  report: IncidentReport;
}

function IncidentCard({ setModal, report }: CardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDownload = (reportId: string) => {
    console.log("Downloading report:", reportId);
    // Implement your download logic here
  };
  if (!report) return null;
  return (
    <div
      onClick={() =>
        setModal(<IncidentModal report={report} setModal={setModal} />)
      }
      className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Image Section */}
      <div className="relative">
        {report.photos.length > 0 ? (
          <div className="aspect-video overflow-hidden">
            <img
              src={report.photos[0]}
              alt={report.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        ) : (
          <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <div className="text-center p-4">
              <div className="mx-auto bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="text-gray-500 text-sm">No images available</span>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
              report.status === "open"
                ? "bg-amber-100 text-amber-800"
                : report.status === "closed"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1 mr-2">
            {report.title}
          </h3>
          <div className="flex-shrink-0 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded">
            {report.nightsBooked} night
            {report.nightsBooked !== 1 ? "s" : ""}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.8rem]">
          {report.description}
        </p>

        {/* Property & Guest Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">PROPERTY</p>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-500 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <p className="text-gray-800 text-sm font-medium truncate">
                {report.propertyName}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">GUEST</p>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-500 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <p className="text-gray-800 text-sm font-medium truncate">
                {report.guestFirstName}
              </p>
            </div>
          </div>
        </div>

        {/* Dates Section */}
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg mb-4">
          <div>
            <p className="text-xs text-gray-500 font-medium">CHECK-IN</p>
            <p className="text-gray-800 text-sm font-medium">
              {formatDate(report.startDate)}
            </p>
          </div>
          <div className="w-8 flex justify-center">
            <div className="h-px w-4 bg-gray-300"></div>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">CHECK-OUT</p>
            <p className="text-gray-800 text-sm font-medium">
              {formatDate(report.endDate)}
            </p>
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">
              Reported: {formatDate(report.createdAt)}
            </p>
          </div>
          <button
            onClick={() => handleDownload(report._id)}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default IncidentCard;
