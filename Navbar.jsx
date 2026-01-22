import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, ChevronDown, LogOut, User } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const username = localStorage.getItem("username") || "User";
  const role = localStorage.getItem("role") || "USER";

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-gradient-to-r from-[#0b1f3a]/95 via-[#0e2a52]/95 to-[#143d7a]/95 shadow-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <div
          onClick={() => navigate("/dashboard")}
          className="text-xl font-bold text-white cursor-pointer tracking-wide"
        >
          SiteSurvey
          <span className="text-blue-300 font-semibold"> Pro</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <NavItem to="/dashboard" label="Dashboard" />
          <NavItem to="/properties" label="Properties" />
          <NavItem to="/buildings" label="Buildings" />
          <NavItem to="/floors" label="Floors" />
          <NavItem to="/spaces" label="Spaces" />
          <NavItem to="/checklists" label="Checklists" />
        </nav>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4 relative">

          {/* Profile Dropdown */}
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 text-white hover:text-blue-300 transition"
          >
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-semibold">
              {username.charAt(0).toUpperCase()}
            </div>
            <ChevronDown size={18} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-14 w-52 bg-white rounded-lg shadow-lg overflow-hidden text-sm">
              <div className="px-4 py-3 border-b">
                <p className="font-medium text-gray-800">{username}</p>
                <p className="text-xs text-gray-500">{role}</p>
              </div>

              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-gray-100"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-[#0b1f3a]/95 border-t border-blue-900 px-6 py-5 space-y-4">
          <MobileNavItem to="/dashboard" label="Dashboard" setOpen={setOpen} />
          <MobileNavItem to="/properties" label="Properties" setOpen={setOpen} />
          <MobileNavItem to="/buildings" label="Buildings" setOpen={setOpen} />
          <MobileNavItem to="/floors" label="Floors" setOpen={setOpen} />
          <MobileNavItem to="/spaces" label="Spaces" setOpen={setOpen} />
          <MobileNavItem to="/checklists" label="Checklists" setOpen={setOpen} />

          <button
            onClick={logout}
            className="w-full mt-4 py-2 bg-red-500 text-white rounded-md"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

/* ---------- Nav Items ---------- */

const NavItem = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `relative pb-1 transition ${
        isActive
          ? "text-blue-300 after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-blue-300"
          : "text-gray-300 hover:text-white"
      }`
    }
  >
    {label}
  </NavLink>
);

const MobileNavItem = ({ to, label, setOpen }) => (
  <NavLink
    to={to}
    onClick={() => setOpen(false)}
    className={({ isActive }) =>
      `block text-sm ${
        isActive
          ? "text-blue-300 font-medium"
          : "text-gray-300 hover:text-white"
      }`
    }
  >
    {label}
  </NavLink>
);
