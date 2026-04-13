import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  MapPin,
  Calendar,
  Save,
  Edit,
  AlertCircle,
  LogOut,
  Home,
} from "lucide-react";

const inputCls =
  "w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-violet-400 transition-colors bg-white";

const GENDER_MAP = {
  male: "👨 Male",
  female: "👩 Female",
  other: "⚧ Other",
  "prefer-not-to-say": "🙈 Prefer not to say",
};

export default function ProfilePage({ phoneNumber, userRole, onLogout }) {
  const [editing, setEditing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    location: "",
    age: "",
    gender: "",
    phone: phoneNumber || "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem("userProfile");
    const completed = localStorage.getItem("profileCompleted");
    if (saved) {
      setProfile({ ...JSON.parse(saved), phone: phoneNumber });
      if (completed === "true") {
        setSubmitted(true);
        setEditing(false);
      }
    }
  }, [phoneNumber]);

  const validate = () => {
    const e = {};
    if (!profile.name.trim()) e.name = "Name is required";
    if (!profile.location.trim()) e.location = "Location is required";
    if (!profile.age) e.age = "Age is required";
    else if (profile.age < 1 || profile.age > 120)
      e.age = "Enter a valid age (1–120)";
    if (!profile.gender) e.gender = "Gender is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    localStorage.setItem("userProfile", JSON.stringify(profile));
    localStorage.setItem("profileCompleted", "true");
    setSubmitted(true);
    setEditing(false);
  };

  const set = (k, v) => {
    setProfile((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const completion =
    ["name", "location", "age", "gender"].filter((f) => profile[f]).length * 25;

  // Mandatory profile form
  if (!submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 py-8 px-4">
        <div className="max-w-xl mx-auto space-y-6">
          {/* Warning header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-6 text-center"
          >
            <AlertCircle size={40} className="mx-auto text-amber-500 mb-3" />
            <h1 className="text-xl font-bold text-amber-800">
              Complete Your Profile
            </h1>
            <p className="text-amber-700 text-sm mt-2 leading-relaxed">
              Please fill in your details to use all PhotoGuard features and get
              personalized recommendations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-1">
              Personal Information
            </h2>
            <p className="text-xs text-gray-400 mb-5">
              All fields are required
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                  <User size={15} /> Full Name{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  className={`${inputCls} ${errors.name ? "border-red-400" : ""}`}
                  placeholder="Your full name"
                  value={profile.name}
                  onChange={(e) => set("name", e.target.value)}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                  <MapPin size={15} /> Location{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  className={`${inputCls} ${errors.location ? "border-red-400" : ""}`}
                  placeholder="Your city"
                  value={profile.location}
                  onChange={(e) => set("location", e.target.value)}
                />
                {errors.location && (
                  <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                )}
              </div>

              {/* Age */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                  <Calendar size={15} /> Age{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  className={`${inputCls} ${errors.age ? "border-red-400" : ""}`}
                  placeholder="Your age"
                  value={profile.age}
                  onChange={(e) => set("age", e.target.value)}
                />
                {errors.age && (
                  <p className="text-red-500 text-xs mt-1">{errors.age}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                  👤 Gender <span className="text-red-500">*</span>
                </label>
                <select
                  className={`${inputCls} ${errors.gender ? "border-red-400" : ""}`}
                  value={profile.gender}
                  onChange={(e) => set("gender", e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="male">👨 Male</option>
                  <option value="female">👩 Female</option>
                  <option value="other">⚧ Other</option>
                  <option value="prefer-not-to-say">
                    🙈 Prefer not to say
                  </option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                )}
              </div>

              {/* Phone (readonly) */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <div className="px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm text-gray-500 italic">
                  {profile.phone || "Not available"}
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-5">
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>Profile Progress</span>
                <span>{completion}% complete</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${completion}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              {completion === 100 && (
                <p className="text-xs text-emerald-600 font-semibold mt-1">
                  ✓ Ready to submit!
                </p>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <Save size={16} /> Complete Profile
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-5 py-3 bg-red-50 text-red-600 rounded-xl font-semibold text-sm hover:bg-red-100 transition-colors border border-red-100"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Completed profile view
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-5"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <User size={32} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-800 truncate">
              {profile.name}
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Profile complete · {userRole}
            </p>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors flex-shrink-0"
            >
              <Edit size={15} /> Edit
            </button>
          )}
        </motion.div>

        {/* Info / Edit Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="font-bold text-gray-800 mb-4">
            {editing ? "Edit Information" : "Your Information"}
          </h2>

          {editing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  Full Name
                </label>
                <input
                  className={inputCls}
                  value={profile.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  Location
                </label>
                <input
                  className={inputCls}
                  value={profile.location}
                  onChange={(e) => set("location", e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  Age
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  className={inputCls}
                  value={profile.age}
                  onChange={(e) => set("age", e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  Gender
                </label>
                <select
                  className={inputCls}
                  value={profile.gender}
                  onChange={(e) => set("gender", e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="male">👨 Male</option>
                  <option value="female">👩 Female</option>
                  <option value="other">⚧ Other</option>
                  <option value="prefer-not-to-say">
                    🙈 Prefer not to say
                  </option>
                </select>
              </div>
              <div className="sm:col-span-2 flex gap-3">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors"
                >
                  <Save size={15} /> Save Changes
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Full Name", value: profile.name },
                { label: "Location", value: profile.location },
                { label: "Age", value: `${profile.age} years` },
                {
                  label: "Gender",
                  value: GENDER_MAP[profile.gender] || profile.gender,
                },
                {
                  label: "Phone",
                  value: profile.phone,
                  className: "italic text-gray-400",
                },
              ].map(({ label, value, className = "" }) => (
                <div key={label}>
                  <p className="text-xs font-semibold text-gray-500 mb-1">
                    {label}
                  </p>
                  <div
                    className={`px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-700 ${className}`}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">
              Profile Status
            </span>
            <span className="text-xs text-emerald-600 font-bold">
              100% Complete
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full w-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full" />
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-2">
            ✅ Your profile is fully set up!
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100"
        >
          <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {[
              {
                emoji: "🟡",
                title: "Progress",
                desc: "Track your journey",
                color: "border-amber-300",
              },
              {
                emoji: "🟢",
                title: "Help & Support",
                desc: "Get assistance",
                color: "border-emerald-300",
              },
              {
                emoji: "🟣",
                title: "Chat With Us",
                desc: "24/7 support",
                color: "border-violet-300",
              },
            ].map(({ emoji, title, desc, color }) => (
              <div
                key={title}
                className={`flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border-l-4 ${color} hover:bg-gray-100 cursor-pointer transition-colors`}
              >
                <span className="text-2xl">{emoji}</span>
                <div>
                  <p className="font-semibold text-gray-700 text-sm">{title}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Logout */}
        <div className="pb-4 text-center">
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 px-8 py-3 bg-red-500 text-white rounded-2xl font-semibold hover:bg-red-600 transition-colors shadow-sm"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
