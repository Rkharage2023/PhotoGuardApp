import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  MessageCircle,
  Star,
  Shield,
  Leaf,
  Bell,
  Plus,
  ChevronLeft,
  ChevronRight as RightIcon,
  Stethoscope,
  MapPin,
  Phone,
} from "lucide-react";
import DoctorRegistration from "../components/DoctorRegistration";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const REVIEWS = [
  {
    name: "Priya Sharma",
    text: "I used to avoid going out in sunlight due to severe skin reactions. After using PhotoSense, I can finally enjoy outdoor activities without worrying about rashes and redness. Life-changing results!",
    stars: 5,
  },
  {
    name: "Rahul Mehta",
    text: "My skin would burn and itch within minutes of sun exposure. The personalized treatment plan from PhotoSense has reduced my sensitivity by 90%. I feel normal again!",
    stars: 5,
  },
  {
    name: "Anita Patel",
    text: "After years of struggling with medication-induced photosensitivity, I found relief with PhotoSense. The expert guidance and proper diagnosis made all the difference. Highly recommended!",
    stars: 5,
  },
];

export default function HomePage({ userRole, phoneNumber, onStartQuiz }) {
  const [showDoctorReg, setShowDoctorReg] = useState(false);
  const [registeredDoctors, setRegisteredDoctors] = useState([]);
  const [carouselSlide, setCarouselSlide] = useState(0);
  const [notifEnabled, setNotifEnabled] = useState(false);

  useEffect(() => {
    const docs = JSON.parse(localStorage.getItem("registeredDoctors") || "[]");
    setRegisteredDoctors(docs);
  }, []);

  useEffect(() => {
    const interval = setInterval(
      () => setCarouselSlide((s) => (s + 1) % 2),
      5000,
    );
    return () => clearInterval(interval);
  }, []);

  const pharmacists = registeredDoctors.filter((d) => d.role === "pharmacist");
  const dermatologists = registeredDoctors.filter(
    (d) => d.role === "dermatologist",
  );
  const hasAnyProfessionals =
    pharmacists.length > 0 || dermatologists.length > 0;

  const handleDoctorAdded = (doc) =>
    setRegisteredDoctors((prev) => [...prev, doc]);
  const handleDoctorDeleted = (id) =>
    setRegisteredDoctors((prev) => prev.filter((d) => d.id !== id));

  const currentProfessionals =
    carouselSlide === 0 ? pharmacists : dermatologists;
  const slideLabel = carouselSlide === 0 ? "Pharmacists" : "Dermatologists";
  const slideIcon = carouselSlide === 0 ? "💊" : "👨‍⚕️";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-white/80 text-center"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-4 leading-tight">
            Know The Root Cause Of Your{" "}
            <span className="bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent">
              Skin Problems
            </span>
          </h1>
          <p className="text-gray-500 text-lg mb-8 font-medium">
            94% saw improvement in photosensitivity symptoms within 4 weeks
          </p>
          <motion.button
            onClick={onStartQuiz}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-emerald-200 transition-all"
          >
            Start Skin Sensitivity Assessment <ChevronRight size={22} />
          </motion.button>
        </motion.div>

        {/* Doctor Management (Pharmacist / Dermatologist only) */}
        {(userRole === "pharmacist" || userRole === "dermatologist") && (
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-3xl p-6 text-center"
          >
            <motion.button
              onClick={() => setShowDoctorReg(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 border-2 border-white/40 text-white rounded-xl font-semibold hover:bg-white/30 transition-all mb-3"
            >
              <Plus size={18} /> Manage Doctor Information
            </motion.button>
            <p className="text-white/80 text-sm">
              Logged in as:{" "}
              <strong className="text-white">
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </strong>
            </p>
          </motion.div>
        )}

        {/* Healthcare Professionals Carousel */}
        {hasAnyProfessionals && (
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.15 }}
            className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-6 relative overflow-hidden"
          >
            <h2 className="text-xl font-bold text-white text-center mb-6">
              Our Healthcare Partners
            </h2>

            {/* Slide Header */}
            <div className="text-center mb-4">
              <div className="text-4xl mb-1">{slideIcon}</div>
              <h3 className="text-white text-lg font-bold">{slideLabel}</h3>
            </div>

            {/* Cards */}
            <AnimatePresence mode="wait">
              <motion.div
                key={carouselSlide}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {currentProfessionals.length > 0 ? (
                  currentProfessionals.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-white"
                    >
                      <p className="font-bold text-base">Dr. {doc.name}</p>
                      <p className="text-emerald-300 text-sm font-semibold mt-0.5">
                        📍 {doc.storeName}
                      </p>
                      <p className="text-white/80 text-sm">{doc.specialty}</p>
                      <p className="text-white/70 text-xs mt-1">
                        {doc.experience} yrs exp · {doc.location}
                      </p>
                      <p className="text-white/60 text-xs mt-0.5">
                        {doc.phone}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8 border-2 border-dashed border-white/30 rounded-2xl">
                    <p className="text-white/60 text-sm">
                      No {slideLabel.toLowerCase()} registered yet
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Nav Buttons */}
            <button
              onClick={() => setCarouselSlide((s) => (s + 1) % 2)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCarouselSlide((s) => (s + 1) % 2)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <RightIcon size={18} />
            </button>

            {/* Indicators */}
            <div className="flex justify-center gap-3 mt-5">
              {["Pharmacists", "Dermatologists"].map((label, i) => (
                <button
                  key={label}
                  onClick={() => setCarouselSlide(i)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    carouselSlide === i
                      ? "bg-white/40 text-white"
                      : "bg-white/15 text-white/70 hover:bg-white/25"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Plan Section */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-800 text-center mb-5">
            PhotoGuard Plan Includes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            {[
              { icon: "👨‍⚕️", label: "Skin coach support" },
              { icon: "📝", label: "Doctor prescription" },
              { icon: "🥗", label: "Customised diet plan" },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl"
              >
                <span className="text-2xl">{icon}</span>
                <span className="text-sm font-medium text-gray-700">
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { Icon: Shield, label: "100% Safe" },
              { Icon: Leaf, label: "Vegan Friendly" },
            ].map(({ Icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-sm font-semibold"
              >
                <Icon size={14} /> {label}
              </span>
            ))}
            <span className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-sm font-semibold">
              🌿 Allergen Free
            </span>
          </div>
        </motion.div>

        {/* Notification Banner */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4 text-gray-700 font-semibold">
            <Bell size={18} /> Enable Notifications For Better Experience
          </div>
          <button
            onClick={() => setNotifEnabled((n) => !n)}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              notifEnabled
                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {notifEnabled ? "✓ Notifications Enabled" : "Enable Notifications"}
          </button>
        </motion.div>

        {/* Chat Support */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-3xl p-6 text-center text-white"
        >
          <h3 className="text-xl font-bold mb-2">HAVE QUESTIONS?</h3>
          <p className="text-white/80 mb-5">
            Your Skin coach is just 1-click away
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/30 transition-all">
            <MessageCircle size={18} /> Chat Now
          </button>
        </motion.div>

        {/* Our Doctors */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-800 text-center mb-5">
            Meet Our Team Of Doctors
          </h2>

          {/* Default doctor */}
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl mb-4">
            <div className="text-4xl">👨‍⚕️</div>
            <div>
              <p className="font-bold text-gray-800">Dr. Omkar Swami</p>
              <p className="text-emerald-600 text-sm font-semibold">
                Alliance Medical
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Ward no 15, MCMX+J25, Chandur Road, Ichalkaranji, Maharashtra
                416115
              </p>
              <p className="text-gray-500 text-xs">
                📞 9011674221 · Experience: 10 Years
              </p>
            </div>
          </div>

          {/* Registered doctors */}
          <AnimatePresence>
            {registeredDoctors.map((doc, i) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4 p-4 bg-emerald-50 border-l-4 border-emerald-400 rounded-2xl mb-3"
              >
                <div className="text-3xl">
                  {doc.role === "dermatologist" ? "👨‍⚕️" : "💊"}
                </div>
                <div>
                  <p className="font-bold text-gray-800">Dr. {doc.name}</p>
                  {doc.storeName && (
                    <p className="text-emerald-600 text-sm font-semibold">
                      📍 {doc.storeName}
                    </p>
                  )}
                  <p className="text-gray-600 text-sm">
                    {doc.specialty} · {doc.experience} yrs
                  </p>
                  <p className="text-gray-500 text-xs">{doc.location}</p>
                  <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-semibold">
                    Added by {doc.role}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Reviews */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
        >
          <div className="text-center mb-6">
            <div className="flex justify-center gap-1 text-amber-400 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill="currentColor" />
              ))}
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-bold text-gray-800">4.8</span>
              <span className="text-gray-400 text-sm">· 5,243 ratings</span>
            </div>
          </div>
          <div className="space-y-4">
            {REVIEWS.map(({ name, text, stars }) => (
              <div key={name} className="p-4 bg-gray-50 rounded-2xl">
                <p className="font-bold text-gray-800 text-sm mb-1">{name}</p>
                <div className="flex gap-0.5 text-amber-400 mb-2">
                  {[...Array(stars)].map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div {...fadeUp} transition={{ delay: 0.45 }}>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Why Choose PhotoGuard?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: "🔍",
                title: "Accurate Diagnosis",
                desc: "Identify the exact cause of sensitivity",
              },
              {
                icon: "👨‍⚕️",
                title: "Expert Dermatologists",
                desc: "15+ years experience in photosensitivity",
              },
              {
                icon: "📊",
                title: "Proven Results",
                desc: "94% success rate in symptom reduction",
              },
            ].map(({ icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + i * 0.1 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-md transition-all text-center"
              >
                <div className="text-4xl mb-3">{icon}</div>
                <p className="font-bold text-gray-800 mb-1">{title}</p>
                <p className="text-gray-500 text-sm">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.5 }}
          className="text-center pb-8"
        >
          <motion.button
            onClick={onStartQuiz}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-emerald-200 transition-all"
          >
            Take The Skin Test™
          </motion.button>
        </motion.div>
      </div>

      {/* Doctor Registration Modal */}
      <AnimatePresence>
        {showDoctorReg && (
          <DoctorRegistration
            onClose={() => setShowDoctorReg(false)}
            onDoctorAdded={handleDoctorAdded}
            onDoctorDeleted={handleDoctorDeleted}
            userRole={userRole}
            phoneNumber={phoneNumber}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
