import React from "react";
import { NavLink, Link } from "react-router-dom";

// Reusable Nav Item
const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-row gap-3 ml-2 px-3 py-3 rounded-[5px] transition-all duration-300 ease-in-out
       hover:font-semibold hover:text-accent
       ${
         isActive
           ? "text-accent font-manrope font-bold bg-secondary-accent"
           : "text-gray-87"
       }`
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

// Animated Button
const AskZestraButton = () => (
  <NavLink to="/AskZestra">
    <div className="relative w-full inline-flex items-center justify-center p-[1.5px] rounded-xl overflow-hidden">
      {/* Animated border */}
      <div
        className="absolute inset-0 rounded-xl animate-spin-slow"
        style={{
          background: "conic-gradient(from 0deg, #0A57FF, #FFFFFF, #0A57FF)",
        }}
      ></div>
      {/* Inner content */}
      <div className="relative border p-3 w-full rounded-xl flex justify-center items-center bg-white">
        <h2 className="font-manrope font-semibold text-[#0A57FF] text-[18px]">
          Ask Zestra
        </h2>
      </div>
    </div>
  </NavLink>
);

// Navigation items configuration
const NAV_ITEMS = [
  {
    to: "/MyProfile",
    label: "My Profile",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    to: "/Dashboard",
    label: "Dashboard",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      </svg>
    ),
  },
  {
    to: "/Subjects",
    label: "Subjects",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
      </svg>
    ),
  },
  {
    to: "/Assignments",
    label: "Assignments",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
      </svg>
    ),
  },
  {
    divider: true,
  },
  {
    to: "/Community",
    label: "Community",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <path d="M16 3.128a4 4 0 0 1 0 7.744" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <circle cx="9" cy="7" r="4" />
      </svg>
    ),
  },
  {
    to: "/Chats",
    label: "Chats",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12.7 3H4a2 2 0 0 0-2 2v16.286a.71.71 0 0 0 1.212.502l2.202-2.202A2 2 0 0 1 6.828 19H20a2 2 0 0 0 2-2v-4.7" />
        <circle cx="19" cy="6" r="3" />
      </svg>
    ),
  },
  {
    to: "/Settings",
    label: "Settings",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
];

export default function Navigations() {
  return (
    <nav className="md:block hidden h-screen fixed bg-gray-50 border-r w-[20%] overflow-y-scroll scrollable-hide-scrollbar">
      {/* Logo */}
      <a href="/">
        <img className="h-[88px]" src="/logo.png" alt="Logo" />
      </a>

      {/* Animated button */}
      <div className="ml-5 mt-5 mr-5">
        <AskZestraButton />
      </div>

      {/* Nav items */}
      <div className="ml-5 mt-5 mr-5 flex flex-col gap-4">
        {NAV_ITEMS.map((item, idx) =>
          item.divider ? (
            <hr
              key={idx}
              className="h-0.5 bg-gray-87 opacity-50 w-[80%] ml-2"
            />
          ) : (
            <NavItem key={item.to} {...item} />
          )
        )}
      </div>

      {/* Help Center */}
      <div className="font-manrope flex flex-col text-center justify-center items-center mt-[15%] bg-secondary-accent rounded-[25px] py-5 mx-7 mb-10">
        <h2 className="font-bold text-[20px] text-font-color">Help Center</h2>
        <p className="text-gray-87 py-1">
          Have a problem? <br /> How can we help you?
        </p>
        <Link
          to="/help"
          className="text-[18px] font-medium my-5 px-10 py-2 bg-accent rounded-[10px] text-white">
          Raise a Query
        </Link>
      </div>

      <style>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 6s linear infinite;
        }
      `}</style>
    </nav>
  );
}
