import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-200 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">&copy; {currentYear} SmartAds. All rights reserved.</p>

        <div className="flex space-x-4 mt-3 md:mt-0">
          <Link
            to="/"
            className="text-gray-200 hover:text-white text-sm transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            to="/create"
            className="text-gray-200 hover:text-white text-sm transition-colors duration-200"
          >
            Create Post
          </Link>
          <Link
            to="/login"
            className="text-gray-200 hover:text-white text-sm transition-colors duration-200"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-gray-200 hover:text-white text-sm transition-colors duration-200"
          >
            Register
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
