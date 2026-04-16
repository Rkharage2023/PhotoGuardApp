import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  MapPin,
  Calendar,
  Save,
  Edit,
  AlertCircle,
  LogOut,
  CheckCircle,
  Loader,
} from "lucide-react";
import { userAPI } from "../services/api";

const inputCls =
  "w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm " +
  "focus:outline-none focus:border-violet-400 transition-colors bg-white";

const GENDER_MAP = {
  male: "👨 Male",
  female: "👩 Female",
  other: "⚧ Other",
  "prefer-not-to-say": "🙈 Prefer not to say",
};

function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2
                 px-5 py-3 bg-emerald-600 text-white rounded-2xl shadow-xl text-sm font-semibold"
    >
      <CheckCircle size={16} /> {message}
    </motion.div>
  );
}

export default function ProfilePage({ phoneNumber, userRole, onLogout }) {
  const [editing, setEditing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [profile, setProfile] = useState({
    name: "",
    location: "",
    age: "",
    gender: "",
    phone: phoneNumber || "",
  });
  const [errors, setErrors] = useState({});

  /* Load profile — try backend first, fall back to localStorage */
  useEffect(() => {
    userAPI
      .getProfile()
      .then(({ user }) => {
        setProfile({
          name: user.name || "",
          location: user.location || "",
          age: user.age || "",
          gender: user.gender || "",
          phone: user.phone || phoneNumber || "",
        });
        if (user.profileCompleted) {
          setSubmitted(true);
          setEditing(false);
        }
      })
      .catch(() => {
        // Offline fallback
        const saved = localStorage.getItem("userProfile");
        if (saved) {
          setProfile({ ...JSON.parse(saved), phone: phoneNumber });
          if (localStorage.getItem("profileCompleted") === "true") {
            setSubmitted(true);
            setEditing(false);
          }
        }
      });
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

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await userAPI.saveProfile({
        name: profile.name,
        location: profile.location,
        age: profile.age,
        gender: profile.gender,
      });
      // Also persist locally as offline cache
      localStorage.setItem("userProfile", JSON.stringify(profile));
      localStorage.setItem("profileCompleted", "true");
      setSubmitted(true);
      setEditing(false);
      setToast("Profile saved successfully!");
    } catch {
      // Save locally even if backend is down
      localStorage.setItem("userProfile", JSON.stringify(profile));
      localStorage.setItem("profileCompleted", "true");
      setSubmitted(true);
      setEditing(false);
      setToast("Saved locally!");
    } finally {
      setSaving(false);
    }
  };

  const set = (k, v) => {
    setProfile((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const completion =
    ["name", "location", "age", "gender"].filter((f) => profile[f]).length * 25;

  const SaveBtn = ({ label = "Complete Profile", fullWidth = false }) => (
    <button
      onClick={handleSave}
      disabled={saving}
      className={`flex items-center justify-center gap-2 py-3 px-6
                  bg-gradient-to-r from-violet-500 to-purple-600 text-white
                  rounded-xl font-semibold text-sm hover:shadow-lg hover:-translate-y-0.5
                  disabled:opacity-70 disabled:cursor-not-allowed transition-all
                  ${fullWidth ? "w-full" : ""}`}
    >
      {saving ? (
        <>
          <Loader size={15} className="animate-spin" /> Saving…
        </>
      ) : (
        <>
          <Save size={15} /> {label}
        </>
      )}
    </button>
  );

  /* ─── Mandatory form ─── */
  if (!submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 py-8 px-4">
        <div className="max-w-xl mx-auto space-y-6">
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
              Please fill in your details to use all PhotoGuard features.
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
              {[
                {
                  key: "name",
                  label: "Full Name",
                  type: "text",
                  Icon: User,
                  ph: "Your full name",
                },
                {
                  key: "location",
                  label: "Location",
                  type: "text",
                  Icon: MapPin,
                  ph: "Your city",
                },
                {
                  key: "age",
                  label: "Age",
                  type: "number",
                  Icon: Calendar,
                  ph: "Your age",
                },
              ].map(({ key, label, type, Icon, ph }) => (
                <div key={key}>
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                    <Icon size={15} /> {label}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={type}
                    placeholder={ph}
                    className={`${inputCls} ${errors[key] ? "border-red-400" : ""}`}
                    value={profile[key]}
                    onChange={(e) => set(key, e.target.value)}
                    {...(type === "number" ? { min: 1, max: 120 } : {})}
                  />
                  {errors[key] && (
                    <p className="text-red-500 text-xs mt-1">{errors[key]}</p>
                  )}
                </div>
              ))}

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

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Phone
                </label>
                <div
                  className="px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl
                                text-sm text-gray-500 italic"
                >
                  {profile.phone || "Not available"}
                </div>
              </div>
            </div>

            {/* Progress bar */}
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
              <SaveBtn label="Complete Profile" fullWidth />
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-5 py-3 bg-red-50 text-red-600
                           rounded-xl font-semibold text-sm hover:bg-red-100 transition-colors
                           border border-red-100"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </motion.div>
        </div>
        <AnimatePresence>
          {toast && <Toast message={toast} onDone={() => setToast("")} />}
        </AnimatePresence>
      </div>
    );
  }

  /* ─── Completed view ─── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-5"
        >
          <div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600
                          flex items-center justify-center flex-shrink-0"
          >
            <User size={32} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-800 truncate">
              {profile.name}
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Profile complete ·{" "}
              <span className="capitalize font-medium text-violet-600">
                {userRole}
              </span>
            </p>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600
                         border border-blue-100 rounded-xl text-sm font-semibold
                         hover:bg-blue-100 transition-colors flex-shrink-0"
            >
              <Edit size={15} /> Edit
            </button>
          )}
        </motion.div>

        {/* Info / Edit */}
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
              {[
                {
                  key: "name",
                  label: "Full Name",
                  type: "text",
                  ph: "Your name",
                },
                {
                  key: "location",
                  label: "Location",
                  type: "text",
                  ph: "Your city",
                },
                { key: "age", label: "Age", type: "number", ph: "Your age" },
              ].map(({ key, label, type, ph }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">
                    {label}
                  </label>
                  <input
                    type={type}
                    className={inputCls}
                    placeholder={ph}
                    value={profile[key]}
                    onChange={(e) => set(key, e.target.value)}
                    {...(type === "number" ? { min: 1, max: 120 } : {})}
                  />
                </div>
              ))}
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
              <div className="sm:col-span-2 flex gap-3 mt-2">
                <SaveBtn label="Save Changes" />
                <button
                  onClick={() => setEditing(false)}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm
                             font-semibold hover:bg-gray-200 transition-colors"
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
                { label: "Phone", value: profile.phone, muted: true },
              ].map(({ label, value, muted }) => (
                <div key={label}>
                  <p className="text-xs font-semibold text-gray-500 mb-1">
                    {label}
                  </p>
                  <div
                    className={`px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl
                                   text-sm font-medium ${muted ? "text-gray-400 italic" : "text-gray-700"}`}
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
                className={`flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border-l-4
                            ${color} hover:bg-gray-100 cursor-pointer transition-colors`}
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

        {/* Orders */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100"
        >
          <h3 className="font-bold text-gray-800 mb-4">Orders</h3>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center text-xl">
              📦
            </div>
            <div>
              <p className="font-semibold text-gray-600 text-sm">
                No active orders
              </p>
              <p className="text-xs text-gray-400">
                You don't have any active orders
              </p>
            </div>
          </div>
        </motion.div>

        {/* App info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 text-center"
        >
          <p className="font-bold text-gray-700">PhotoGuard</p>
          <p className="text-xs text-gray-400 mt-0.5">Version 1.0.0</p>
        </motion.div>

        {/* Logout */}
        <div className="pb-4 text-center">
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 px-8 py-3 bg-red-500 text-white
                       rounded-2xl font-semibold hover:bg-red-600 transition-colors shadow-sm"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      <AnimatePresence>
        {toast && <Toast message={toast} onDone={() => setToast("")} />}
      </AnimatePresence>
    </div>
  );
}
