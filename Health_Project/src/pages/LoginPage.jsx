import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Smartphone,
  User,
  Pill,
  Stethoscope,
  Shield,
} from "lucide-react";

const ROLES = [
  {
    id: "user",
    label: "User",
    Icon: User,
    desc: "Get personalized skin assessments",
    color: "violet",
  },
  {
    id: "pharmacist",
    label: "Pharmacist",
    Icon: Pill,
    desc: "Manage medications and consultations",
    color: "blue",
  },
  {
    id: "dermatologist",
    label: "Dermatologist",
    Icon: Stethoscope,
    desc: "Provide expert skin care",
    color: "emerald",
  },
];

const colorMap = {
  violet: {
    border: "border-violet-400",
    bg: "bg-violet-50",
    text: "text-violet-600",
    ring: "ring-violet-300",
  },
  blue: {
    border: "border-blue-400",
    bg: "bg-blue-50",
    text: "text-blue-600",
    ring: "ring-blue-300",
  },
  emerald: {
    border: "border-emerald-400",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    ring: "ring-emerald-300",
  },
};

export default function LoginPage({ onLogin }) {
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    onLogin(digits, role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 mb-4 shadow-lg">
              <Stethoscope size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome to PhotoGuard
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Choose your role to continue
            </p>
          </div>

          {/* Role Selection */}
          <div className="space-y-3 mb-6">
            {ROLES.map(({ id, label, Icon, desc, color }) => {
              const c = colorMap[color];
              const selected = role === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setRole(id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                    selected
                      ? `${c.border} ${c.bg} shadow-sm ring-4 ${c.ring}/20`
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl ${selected ? c.bg : "bg-gray-100"}`}
                  >
                    <Icon
                      size={20}
                      className={selected ? c.text : "text-gray-500"}
                    />
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-semibold text-sm ${selected ? c.text : "text-gray-700"}`}
                    >
                      {label}
                    </p>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                  {selected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`w-5 h-5 rounded-full ${c.bg} border-2 ${c.border} flex items-center justify-center`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full bg-current ${c.text}`}
                      />
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Phone input */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Smartphone
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setError("");
                  }}
                  placeholder="e.g. 9876543210"
                  maxLength={10}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-violet-400 transition-colors"
                />
              </div>
              {error && (
                <p className="mt-2 text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl font-semibold text-sm shadow-lg hover:shadow-violet-200 hover:-translate-y-0.5 transition-all duration-200"
            >
              Login as {role.charAt(0).toUpperCase() + role.slice(1)}
              <ChevronRight size={18} />
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
            <Shield size={12} /> Your data is safe and secure
          </p>
        </div>
      </motion.div>
    </div>
  );
}
