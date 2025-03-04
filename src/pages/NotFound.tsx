import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      <h1 className="text-primary font-bold text-6xl md:text-8xl">404</h1>
      <p className="text-gray-600 text-lg md:text-xl mt-4">
        Oops! The page you're looking for doesn't exist!!!.
      </p>
      <Link
        to="/"
        className="mt-6 bg-primary text-white px-6 py-3 rounded-lg shadow-md hover:bg-primary-dark transition-all"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
