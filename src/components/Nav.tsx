import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Nav = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();

  const links = [
    { text: "Home", to: "/" },
    { text: "OpenDoor", to: "/opendoor" },
  ];

  const activeClass = "text-white bg-gray-900";
  const inactiveClass = "text-gray-300 hover:text-white hover:bg-gray-700";

  return (
    <nav className="bg-gray-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {links.map((link, i) => (
              <Link
                key={link.text}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === link.to ? activeClass : inactiveClass
                } ${i > 0 && "ml-4"}`}
              >
                {link.text}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
