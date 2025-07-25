import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import App from "./pages/App.tsx";
import Bookings from "./pages/Bookings.tsx";
import Calendar from "./pages/Calendar.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import IncidentReport from "./pages/IncidentReport.tsx";
import Integrations from "./pages/Integrations.tsx";
import ListingManagement from "./pages/ListingManagement.tsx";
import ReportCenter from "./pages/ReportCenter.tsx";
import Reservation from "./pages/Reservation.tsx";
import ViewProperty from "./components/ViewProperty/index.tsx";
import Portfolio from "./pages/Portfolio.tsx";
import SignIn from "./pages/SignIn.tsx";
import SignUp from "./pages/SignUp.tsx";
import Pricing from "./pages/Pricing.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import Settings from "./pages/Settings.tsx";
import NotFound from "./pages/NotFound.tsx";
import PublicBooking from "./pages/PublicBooking.tsx";
import PublicInvoice from "./pages/PublicInvoice.tsx";
import { Toaster } from "react-hot-toast";
import StripeSuccessPage from "./pages/StripeSuccess.tsx";
import StripeCancelPage from "./pages/StripeCancel.tsx";
// import IncidentReportsPage from "./pages/IncidentReportCenter.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Toaster />
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
        <Route path="/incident-report/:id" element={<IncidentReport />} />
        {/* <Route path="/incident-report" element={<IncidentReportsPage />} /> */}
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* <Route path="/property/:token/:rateId" element={<PublicBooking />} /> */}
        {/* <Route path="/property/:token" element={<PublicBooking />} /> */}
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/agent/:id" element={<PublicBooking />} />
        <Route path="/invoice/:id" element={<PublicInvoice />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/stripe-cancel" element={<StripeCancelPage />} />
        <Route path="/stripe-success" element={<StripeSuccessPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
