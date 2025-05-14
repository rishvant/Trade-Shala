import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#131722] text-neutral-content px-10 pt-12 pb-5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Trade-Shala</h2>
          <p className="text-sm text-gray-400">
            Your intelligent trading companion for the modern financial markets.
            Real-time data, insightful news, and smart portfolio management —
            all in one place.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Explore</h3>
          <ul className="space-y-1 text-sm text-gray-400">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/marketplace">Marketplace</Link>
            </li>
            <li>
              <Link to="/news">News</Link>
            </li>
            {/* <li>
              <Link to="/contact">Contact Us</Link>
            </li> */}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Account</h3>
          <ul className="space-y-1 text-sm text-gray-400">
            <li>
              <Link to="/login/email">Login</Link>
            </li>
            <li>
              <Link to="/signup">Start Trading</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} Trade-Shala. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
