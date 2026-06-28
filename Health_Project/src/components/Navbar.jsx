import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Video,
  User,
  Menu,
  Stethoscope,
  AlertTriangle,
  Sun,
  Moon,
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
  profileCompleted,
  theme,
  onToggleTheme,
}) {
  const [dashOpen, setDashOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-b border-gray-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
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
              <div
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600
                              flex items-center justify-center"
              >
                <Stethoscope size={16} className="text-white" />
              </div>
              <span className="font-bold text-gray-800 text-lg hidden sm:block">
                PhotoGuard
              </span>
            </div>
          </div>

          {/* Center: tabs — overflow-visible so active dot isn't clipped */}
          <div
            className="flex items-center gap-1 bg-gray-50 rounded-2xl p-1 border border-gray-100
                          overflow-visible"
          >
            {TABS.map(({ id, label, Icon }) => {
              const isLocked = !profileCompleted && id !== "profile";
              return (
                <button
                  key={id}
                  disabled={isLocked}
                  onClick={() => onTabChange(id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium
                              transition-all duration-200 ${
                                activeTab === id
                                  ? "bg-white text-emerald-600 shadow-sm"
                                  : isLocked
                                    ? "text-gray-300 cursor-not-allowed opacity-50"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-white/60"
                              }`}
                  title={isLocked ? "Complete your profile first" : label}
                >
                  <Icon size={16} />
                  <span className="hidden md:block">{label}</span>
                  {isLocked && <span className="text-[10px] ml-0.5 opacity-80">🔒</span>}
                  {activeTab === id && (
                    <motion.div
                      layoutId="activeTabDot"
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2
                                 w-1.5 h-1.5 rounded-full bg-emerald-500"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: theme toggle + role badge */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-gray-300 transition-all flex items-center justify-center border border-transparent hover:border-gray-200 dark:hover:border-slate-700"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} className="text-amber-400" />}
            </button>

            <div className="hidden sm:block">
              <span
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
                  userRole === "dermatologist"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : userRole === "pharmacist"
                      ? "bg-teal-50 text-teal-700 border-teal-200"
                      : "bg-gray-50 text-gray-600 border-gray-200"
                }`}
              >
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </span>
            </div>
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
