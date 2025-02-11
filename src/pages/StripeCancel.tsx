import { Link } from "react-router-dom";

export default function StripeCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-deepBlue/20">
      <div className="bg-white rounded-xl shadow-lg max-w-md py-12 w-full text-center">
        <h1 className="text-3xl font-bold my-4 text-primary">
          Payment Cancelled
        </h1>
        <p className="mb-6 text-secondary">
          Your payment has been cancelled. Please try again or contact support
          if needed.
        </p>
        <Link
          to="/dashboard"
          className="px-6 py-2.5 rounded-xl text-sm font-medium transition-colors duration-300 bg-primary text-white"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
