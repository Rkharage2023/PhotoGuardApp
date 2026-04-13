import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Video,
  User,
  Menu,
  Stethoscope,
  AlertTriangle,
  X,
} from "lucide-react";
import Dashboard from "./Dashboard";

const TABS = [
  { id: "home", label: "Home", Icon: Home },
  { id: "videos", label: "Videos", Icon: Video },
  { id: "profile", label: "Profile", Icon: User },
  { id: "drug-allergy", label: "Drug Allergy", Icon: AlertTriangle },
];

export default function Navbar({
  activeTab,
  onTabChange,
  phoneNumber,
  userRole,
}) {
  const [dashOpen, setDashOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Left: hamburger + brand */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => setDashOpen(true)}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all"
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Stethoscope size={16} className="text-white" />
              </div>
              <span className="font-bold text-gray-800 text-lg hidden sm:block">
                PhotoGuard
              </span>
            </div>
          </div>

          {/* Center: tabs */}
          <div className="flex items-center gap-1 bg-gray-50 rounded-2xl p-1 border border-gray-100">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === id
                    ? "bg-white text-violet-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700 hover:bg-white/60"
                }`}
              >
                <Icon size={16} />
                <span className="hidden md:block">{label}</span>
              </button>
            ))}
          </div>

          {/* Right: role badge */}
          <div className="flex-shrink-0 hidden sm:block">
            <span
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
                userRole === "dermatologist"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : userRole === "pharmacist"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-gray-50 text-gray-600 border-gray-200"
              }`}
            >
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </span>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {dashOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDashOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            />
            <Dashboard
              onClose={() => setDashOpen(false)}
              phoneNumber={phoneNumber}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
