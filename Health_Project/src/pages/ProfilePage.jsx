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
import { userAPI, quizAPI } from "../services/api";

const inputCls =
  "w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm " +
  "focus:outline-none focus:border-emerald-400 transition-colors bg-white";

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

export default function ProfilePage({ phoneNumber, userRole, onLogout, onProfileComplete }) {
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
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    quizAPI
      .history()
      .then(({ results }) => {
        setHistory(results || []);
      })
      .catch((err) => {
        console.error("Failed to fetch assessment history:", err);
      })
      .finally(() => {
        setLoadingHistory(false);
      });
  }, []);

  const [permStorage, setPermStorage] = useState(() => {
    return localStorage.getItem("consent_storage") !== "false";
  });
  const [permNotification, setPermNotification] = useState(() => {
    if ("Notification" in window) {
      return Notification.permission === "granted";
    }
    return false;
  });
  const [permCamera, setPermCamera] = useState(() => {
    return localStorage.getItem("consent_camera") === "true";
  });
  const [permMessaging, setPermMessaging] = useState(() => {
    return localStorage.getItem("consent_messaging") !== "false";
  });

  const toggleStorage = () => {
    const val = !permStorage;
    setPermStorage(val);
    localStorage.setItem("consent_storage", val ? "true" : "false");
    if (!val) {
      localStorage.removeItem("userProfile");
      localStorage.removeItem("profileCompleted");
    } else {
      localStorage.setItem("userProfile", JSON.stringify(profile));
      localStorage.setItem("profileCompleted", "true");
    }
  };

  const toggleNotification = async () => {
    if (permNotification) {
      setPermNotification(false);
      localStorage.setItem("consent_notification", "false");
    } else {
      if ("Notification" in window) {
        const res = await Notification.requestPermission();
        if (res === "granted") {
          setPermNotification(true);
          localStorage.setItem("consent_notification", "true");
        } else {
          alert("Notification permission was denied by the browser.");
        }
      } else {
        alert("Desktop notifications are not supported by your browser.");
      }
    }
  };

  const toggleCamera = async () => {
    if (permCamera) {
      setPermCamera(false);
      localStorage.setItem("consent_camera", "false");
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((track) => track.stop());
        setPermCamera(true);
        localStorage.setItem("consent_camera", "true");
      } catch (err) {
        alert("Camera permission denied or camera device not found.");
      }
    }
  };

  const toggleMessaging = () => {
    const val = !permMessaging;
    setPermMessaging(val);
    localStorage.setItem("consent_messaging", val ? "true" : "false");
  };

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
      if (onProfileComplete) onProfileComplete();
    } catch {
      // Save locally even if backend is down
      localStorage.setItem("userProfile", JSON.stringify(profile));
      localStorage.setItem("profileCompleted", "true");
      setSubmitted(true);
      setEditing(false);
      setToast("Saved locally!");
      if (onProfileComplete) onProfileComplete();
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
                  bg-gradient-to-r from-emerald-500 to-teal-500 text-white
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/50 to-emerald-50/30 py-8 px-4">
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
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/50 to-emerald-50/30 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-5"
        >
          <div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600
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
              <span className="capitalize font-medium text-emerald-600">
                {userRole}
              </span>
            </p>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600
                         border border-emerald-100 rounded-xl text-sm font-semibold
                         hover:bg-emerald-100 transition-colors flex-shrink-0"
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

        {/* Device Access & Permissions Consent */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.22 }}
          className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100"
        >
          <h3 className="font-bold text-gray-800 mb-2">Device Access & Permissions</h3>
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">
            Manage browser features and device accessibility options for PhotoGuard services.
          </p>
          <div className="space-y-3">
            {[
              {
                id: "storage",
                name: "💾 Offline Storage Consent",
                desc: "Allows caching your profile details, diagnostic scores, and assessment logs locally.",
                checked: permStorage,
                onChange: toggleStorage,
              },
              {
                id: "notifications",
                name: "🔔 Symptom Check-in Notifications",
                desc: "Allows scheduling push notifications to remind you to log skin status.",
                checked: permNotification,
                onChange: toggleNotification,
              },
              {
                id: "camera",
                name: "📸 Camera & Photo Access",
                desc: "Allows uploading and analyzing images of affected skin areas.",
                checked: permCamera,
                onChange: toggleCamera,
              },
              {
                id: "messaging",
                name: "💬 Medical Doctor Messaging",
                desc: "Allows generating SMS pre-fills to message alliance dermatologists directly.",
                checked: permMessaging,
                onChange: toggleMessaging,
              },
            ].map((perm) => (
              <div key={perm.id} className="flex items-start justify-between gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100/50">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-700 text-sm">{perm.name}</p>
                  <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{perm.desc}</p>
                </div>
                <button
                  onClick={perm.onChange}
                  className={`w-11 h-6 rounded-full flex-shrink-0 transition-colors relative focus:outline-none ${
                    perm.checked ? "bg-emerald-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      perm.checked ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Assessment History */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.24 }}
          className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100"
        >
          <h3 className="font-bold text-gray-800 mb-2">📝 Assessment History</h3>
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">
            Review your past skin checks, computed conditions, and recovery photos.
          </p>

          {loadingHistory ? (
            <div className="flex justify-center py-6">
              <Loader className="animate-spin text-emerald-500" size={24} />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
              <p className="text-sm font-semibold text-gray-500">No assessments found</p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto leading-relaxed">
                Take your first skin check-in test to start logging history and tracking improvements.
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 no-scrollbar">
              {history.map((record) => {
                const dateStr = new Date(record.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });
                
                const sortedProbs = [...(record.probabilities || [])].sort(
                  (a, b) => b.percentage - a.percentage
                );

                const topCond = sortedProbs[0];
                const secondCond = sortedProbs[1];

                return (
                  <div
                    key={record._id}
                    className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50 flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          {dateStr}
                        </p>
                        <p className="text-sm font-bold text-gray-800 mt-0.5">
                          {topCond ? topCond.label : "Assessment Result"}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                        {record.stageLabel || "Calculated"}
                      </span>
                    </div>

                    {/* Probabilities breakdown short list */}
                    {sortedProbs.length > 0 && (
                      <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-500">
                        {topCond && (
                          <span className="bg-white border border-gray-100 px-2 py-0.5 rounded-lg text-emerald-700">
                            {topCond.label} ({topCond.percentage}%)
                          </span>
                        )}
                        {secondCond && (
                          <span className="bg-white border border-gray-100 px-2 py-0.5 rounded-lg">
                            {secondCond.label} ({secondCond.percentage}%)
                          </span>
                        )}
                      </div>
                    )}

                    {/* Thumbnail previews of uploaded photos */}
                    {(record.part1Images?.length > 0 || record.part2Images?.length > 0) && (
                      <div className="flex items-center gap-1.5 mt-1">
                        {[...(record.part1Images || []), ...(record.part2Images || [])].map(
                          (base64, imgIdx) => (
                            <div
                              key={imgIdx}
                              className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 bg-white"
                            >
                              <img
                                src={base64}
                                alt="Assessment"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
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
                color: "border-teal-300",
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
