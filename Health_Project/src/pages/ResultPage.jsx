import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Home,
  RefreshCw,
  Phone,
  MessageCircle,
} from "lucide-react";

const STAGES = {
  mild: {
    range: "0–5 Yes answers",
    label: "Stage 1 — Mild Photosensitivity Risk",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: "🟢",
    treatment:
      "Your risk appears mild. Focus on daily broad-spectrum SPF 30+, protective clothing, and avoiding peak sun hours (10 AM – 4 PM). Monitor your skin for changes.",
    medTitle: "Topical Options (Over-the-counter)",
    meds: [
      "Aloe vera gel / Aloe lotion — Soothes irritated skin (use fragrance-free)",
      "Calamine lotion — Reduces itching and redness (apply 2–3 times daily)",
      "Moisturizers with ceramides — Repairs skin barrier (good for dryness/peeling)",
      "0.5–1% Hydrocortisone cream — Reduces inflammation (short-term use: 3–5 days)",
    ],
    medNote:
      "These help with sunburn-like symptoms, itching, redness, and inflammation.",
  },
  moderate: {
    range: "6–10 Yes answers",
    label: "Stage 2 — Moderate Photosensitivity",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: "🟡",
    treatment:
      "You show signs of moderate photosensitivity. Strict sun avoidance and UV-protective clothing (UPF rated) are essential. Consult a dermatologist to review medications or conditions.",
    medTitle: "Oral OTC Options (for itching/allergic reactions)",
    meds: [
      "Cetirizine — 10 mg once daily (non-sedating antihistamine)",
      "Loratadine — 10 mg once daily (non-drowsy)",
    ],
    medNote:
      "These antihistamines help if the photosensitivity has an allergic or rash component.",
  },
  severe: {
    range: "11–13 Yes answers",
    label: "Stage 3 — Severe Photosensitivity",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    icon: "🔴",
    treatment:
      "Your responses indicate severe photosensitivity. Minimize sun exposure and seek immediate consultation with a healthcare professional to identify and manage the underlying cause.",
    medTitle: "Oral OTC Options (stronger)",
    meds: [
      "Fexofenadine — 120–180 mg once daily (stronger option for itching)",
      "Diphenhydramine (Benadryl) — 25 mg at night (causes drowsiness — avoid driving)",
    ],
    medNote: "These are stronger antihistamines for more intense reactions.",
  },
  critical: {
    range: "14–15 Yes answers",
    label: "Stage 4 — Critical Photosensitivity",
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-300",
    icon: "🚨",
    treatment:
      "Your responses indicate critical photosensitivity requiring immediate medical attention. Please contact a healthcare professional immediately for proper diagnosis and treatment.",
    meds: [],
  },
};

const DOCTOR = {
  name: "Dr. Shankar Mahajan",
  clinic: "Mahajan Hospital (Sangli)",
  phone: "+919156403142",
};

const isMobile = () =>
  /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);

export default function ResultPage({ quizAnswers, onRetake, onHome }) {
  const yesCount = quizAnswers.filter(Boolean).length;
  const result =
    yesCount <= 5
      ? STAGES.mild
      : yesCount <= 10
        ? STAGES.moderate
        : yesCount <= 13
          ? STAGES.severe
          : STAGES.critical;

  const callDoctor = () => {
    if (isMobile()) window.location.href = `tel:${DOCTOR.phone}`;
    else
      alert(
        `Please call: ${DOCTOR.phone}\nDoctor: ${DOCTOR.name}\nClinic: ${DOCTOR.clinic}`,
      );
  };

  const messageDoctor = () => {
    const msg = `Hello, I need an appointment regarding photosensitivity. My result: ${result.label}`;
    if (isMobile())
      window.location.href = `sms:${DOCTOR.phone}?body=${encodeURIComponent(msg)}`;
    else
      alert(
        `Message: ${DOCTOR.phone}\nDoctor: ${DOCTOR.name}\nMessage: ${msg}`,
      );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4 py-8"
    >
      <div className="w-full max-w-xl">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.3 }}
          className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8"
        >
          {/* Top */}
          <div className="text-center mb-6">
            <CheckCircle size={56} className={`mx-auto mb-4 ${result.color}`} />
            <h1 className="text-2xl font-extrabold text-gray-800">
              Assessment Complete!
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Based on your answers, here is your photosensitivity assessment:
            </p>
          </div>

          {/* Stage Badge */}
          <div
            className={`rounded-2xl p-5 text-center border-2 ${result.bg} ${result.border} mb-6`}
          >
            <div className="text-4xl mb-2">{result.icon}</div>
            <h2 className={`text-lg font-extrabold ${result.color}`}>
              {result.label}
            </h2>
            <p className="text-gray-500 text-xs mt-1">
              {result.range} · You answered Yes {yesCount} time(s)
            </p>
          </div>

          {/* Treatment */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mb-5">
            <h3 className="font-bold text-gray-800 mb-2">
              Suggested Next Steps
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {result.treatment}
            </p>
          </div>

          {/* Doctor Contact */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-5">
            <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-1.5">
              👨‍⚕️ Recommended Healthcare Provider
            </h4>
            <div className="bg-white rounded-xl p-3 border border-blue-100 mb-4">
              <p className="text-sm font-semibold text-gray-800">
                {DOCTOR.name}
              </p>
              <p className="text-xs text-gray-500">{DOCTOR.clinic}</p>
              <p className="text-xs text-blue-600 font-medium mt-0.5">
                {DOCTOR.phone}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={callDoctor}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors"
              >
                <Phone size={15} /> Call Doctor
              </button>
              <button
                onClick={messageDoctor}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors"
              >
                <MessageCircle size={15} /> Message
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-3 italic">
              On mobile, these will open your dialer and messaging app
              automatically.
            </p>
          </div>

          {/* Medications */}
          {result.meds && result.meds.length > 0 && (
            <div className="bg-emerald-50 border-l-4 border-emerald-400 rounded-2xl p-5 mb-5">
              <h4 className="font-bold text-gray-700 text-sm mb-3">
                {result.medTitle}
              </h4>
              <ul className="space-y-2">
                {result.meds.map((med, i) => (
                  <li
                    key={i}
                    className="text-sm text-gray-600 pb-2 border-b border-emerald-100 last:border-0 last:pb-0"
                  >
                    {med}
                  </li>
                ))}
              </ul>
              {result.medNote && (
                <p className="text-xs text-gray-500 italic mt-3">
                  {result.medNote}
                </p>
              )}
              <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <p className="text-xs text-amber-700 font-medium">
                  ⚠️ Always consult with a healthcare professional before
                  starting any new medication.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <motion.button
              onClick={onRetake}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 rounded-2xl font-semibold text-sm hover:bg-gray-200 transition-colors"
            >
              <RefreshCw size={16} /> Retake Test
            </motion.button>
            <motion.button
              onClick={onHome}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl font-semibold text-sm shadow-lg hover:shadow-violet-200 transition-all"
            >
              <Home size={16} /> Go Home
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
