import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import "./index.css";

import App from "./pages/index.tsx";
import Bookings from "./pages/Dashboard/Bookings.tsx";
import Calendar from "./pages/Dashboard/Calendar.tsx";
import Dashboard from "./pages/Dashboard/index.tsx";
import Integrations from "./pages/Dashboard/Integrations.tsx";
import ListingManagement from "./pages/Dashboard/ListingManagement.tsx";
import ReportCenter from "./pages/Dashboard/ReportCenter.tsx";
import Reservation from "./pages/Reservation.tsx";
import ViewProperty from "./components/dashboard/viewProperty/index.tsx";
import SignIn from "./pages/Auth/SignIn.tsx";
import SignUp from "./pages/Auth/SignUp.tsx";
import Pricing from "./pages/Pricing.tsx";
import ResetPassword from "./pages/Auth/Reset-password.tsx";
import ForgotPassword from "./pages/Auth/Forgot-password.tsx";
import Settings from "./pages/Dashboard/Settings.tsx";
import NotFound from "./pages/NotFound.tsx";
import PublicBooking from "./pages/PublicBooking.tsx";
import PublicInvoice from "./pages/PublicInvoice.tsx";
import StripeSuccessPage from "./pages/Stripe/Success.tsx";
import StripeCancelPage from "./pages/Stripe/Cancel.tsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Toaster />
    <QueryClientProvider client={queryClient}>
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
          <Route path="/property/:id/:propId?" element={<PublicBooking />} />
          <Route path="/invoice/:id" element={<PublicInvoice />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/stripe-cancel" element={<StripeCancelPage />} />
          <Route path="/stripe-success" element={<StripeSuccessPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
