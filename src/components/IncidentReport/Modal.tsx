import { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { IncidentReport } from "../../pages/IncidentReportCenter";
import moment from "moment";

interface ModalProps {
  setModal: any;
  report: IncidentReport | null;
}

export default function IncidentModal({ setModal, report }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModal(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setModal]);

  if (!report) return null;

  function formatDate(date: string) {
    return moment.utc(date).format("DD MMM, YYYY");
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full relative">
        <button
          className="absolute top-4 right-4 text-black z-50"
          onClick={() => setModal(null)}
        >
          ✕
        </button>

        {/* Slideshow */}
        <div className="w-full aspect-video bg-gray-100 rounded-t-2xl overflow-hidden">
          {report.photos.length > 0 ? (
            <Swiper
              spaceBetween={30}
              centeredSlides={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              loop={true}
              pagination={{
                clickable: true,
              }}
              modules={[Autoplay]}
            >
              {report.photos.length ? (
                report.photos.map((photo, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={photo}
                      alt=""
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No images available
                  </div>
                </SwiperSlide>
              )}
            </Swiper>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No images available
            </div>
          )}
        </div>

        {/* Report Info */}
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {report.title}
          </h2>
          <p className="text-sm text-gray-600">{report.description}</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500">Property</p>
              <p className="text-sm text-gray-800">{report.propertyName}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Guest</p>
              <p className="text-sm text-gray-800">{report.guestFirstName}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Check-in</p>
              <p className="text-sm text-gray-800">
                {formatDate(report.startDate)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Check-out</p>
              <p className="text-sm text-gray-800">
                {formatDate(report.endDate)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
