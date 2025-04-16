"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import cloud from "../assets/cloud-upload-white.svg";
import apiClient from "../helpers/apiClient";

interface BookingInfo {
  bookingId: string;
  propertyName: string;
  checkInDate: string;
  checkOutDate: string;
  guestFirstName: string;
  guestEmail: string;
  guestPhone: string;
}

export default function IncidentReport() {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<BookingInfo | null>(null);
  const [damageType, setDamageType] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await apiClient.get(`/booking/${id}/bookingInfo`);
        setBooking(res.data.data);
      } catch (error) {
        toast.error("Failed to fetch booking info");
      }
    };

    fetchBooking();
  }, [id]);

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!damageType || !description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", damageType);
    formData.append("description", description);
    formData.append("propertyName", booking?.propertyName || "");
    images.forEach((img) => formData.append("photos", img));

    try {
      await apiClient.post(`/booking/${id}/incident-report`, formData);
      toast.success("Incident submitted successfully");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      toast.error("Failed to submit incident");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-xl my-12 border">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800">
        Incident Report
      </h1>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Property Name
          </label>
          <input
            value={booking?.propertyName}
            disabled
            className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Guest Name</label>
          <input
            value={booking?.guestFirstName}
            disabled
            className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Check-in Date
          </label>
          <input
            value={
              booking?.checkInDate
                ? new Date(booking.checkInDate).toLocaleDateString()
                : ""
            }
            disabled
            className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Check-out Date
          </label>
          <input
            value={
              booking?.checkOutDate
                ? new Date(booking.checkOutDate).toLocaleDateString()
                : ""
            }
            disabled
            className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 cursor-not-allowed"
          />
        </div>
      </div>

      <hr className="my-8" />

      <div className="grid gap-6">
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Damage Type
          </label>
          <input
            type="text"
            placeholder="e.g. Broken furniture"
            value={damageType}
            onChange={(e) => setDamageType(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Description
          </label>
          <textarea
            placeholder="Explain the issue in detail"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Damage Images (Optional)
          </label>

          <span
            onClick={() => document.getElementById("incident-file")?.click()}
            className="flex flex-col gap-1 items-center justify-center w-32 h-28 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 bg-gray-100 cursor-pointer hover:bg-gray-200 transition"
          >
            <img src={cloud} alt="cloud upload" className="w-6 h-6" />
            <h4 className="text-xs font-light max-w-20 text-center">
              Add Pictures
            </h4>
            <input
              type="file"
              id="incident-file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleAddImages}
            />
          </span>

          {images.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-4">
              {images.map((file, idx) => (
                <div
                  key={idx}
                  className="relative w-24 h-24 border rounded-lg overflow-hidden group"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`uploaded-${idx}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 text-white bg-black bg-opacity-50 rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-8 px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition w-full md:w-auto"
      >
        Submit Incident Report
      </button>
    </div>
  );
}
