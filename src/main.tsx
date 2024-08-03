import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import App from "./pages/App.tsx";
import Bookings from "./pages/Bookings.tsx";
import Calendar from "./pages/Calendar.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Integrations from "./pages/Integrations.tsx";
import ListingManagement from "./pages/ListingManagement.tsx";
import ReportCenter from "./pages/ReportCenter.tsx";
import Reservation from "./pages/Reservation.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/booking" element={<Bookings />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/integration" element={<Integrations />} />
        <Route path="/listing" element={<ListingManagement />} />
        <Route path="/report" element={<ReportCenter />} />
        <Route path="/reservation" element={<Reservation />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
