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
import ViewProperty from "./components/ViewProperty/index.tsx";
import SignIn from "./pages/SignIn.tsx";
import SignUp from "./pages/SignUp.tsx";
import Pricing from "./pages/Pricing.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";

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
        <Route path="/listing/:id" element={<ViewProperty />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/report" element={<ReportCenter />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
