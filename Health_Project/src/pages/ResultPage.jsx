import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Home,
  RefreshCw,
  Phone,
  MessageCircle,
  X,
} from "lucide-react";
import ReminderCard from "../components/ReminderCard";
import { quizAPI } from "../services/api";

// Stage 1 Scoring system for skin conditions:
// Each question maps to points for: photosensitivity, fungal, dermatitis, eczema, acne, bacterial, hyperpigmentation
const CONDITION_SCORING = [
  // Q1: Did the skin problem appear after spending time in the sun?
  { photosensitivity: 4, dermatitis: 0, fungal: 0, eczema: 0, acne: 0, bacterial: 0, hyperpigmentation: 2 },
  // Q2: Are you currently taking any medication known to increase sun sensitivity?
  { photosensitivity: 4, dermatitis: 0, fungal: 0, eczema: 0, acne: 0, bacterial: 0, hyperpigmentation: 0 },
  // Q3: Is the rash mainly on sun-exposed areas (face, neck, arms, hands)?
  { photosensitivity: 3, dermatitis: 1, fungal: 0, eczema: 0, acne: 0, bacterial: 0, hyperpigmentation: 1 },
  // Q4: Did you recently start using a new cream, cosmetic, perfume, or soap?
  { photosensitivity: 0, dermatitis: 4, fungal: 0, eczema: 1, acne: 0, bacterial: 0, hyperpigmentation: 0 },
  // Q5: Is the affected area very itchy?
  { photosensitivity: 0, dermatitis: 2, fungal: 2, eczema: 3, acne: 0, bacterial: 1, hyperpigmentation: 0 },
  // Q6: Do you have burning or pain more than itching?
  { photosensitivity: 3, dermatitis: 0, fungal: 0, eczema: 0, acne: 0, bacterial: 2, hyperpigmentation: 0 },
  // Q7: Does the rash have a ring-shaped border with clearer skin in the center?
  { photosensitivity: 0, dermatitis: 0, fungal: 5, eczema: 0, acne: 0, bacterial: 0, hyperpigmentation: 0 },
  // Q8: Is the affected area warm, swollen, or producing pus?
  { photosensitivity: 0, dermatitis: 0, fungal: 0, eczema: 0, acne: 1, bacterial: 5, hyperpigmentation: 0 },
  // Q9: Do you have pimples, blackheads, or whiteheads?
  { photosensitivity: 0, dermatitis: 0, fungal: 0, eczema: 0, acne: 6, bacterial: 0, hyperpigmentation: 0 },
  // Q10: Is the skin dry, rough, or cracked?
  { photosensitivity: 0, dermatitis: 2, fungal: 0, eczema: 4, acne: 0, bacterial: 0, hyperpigmentation: 0 },
  // Q11: Did the skin become darker after the rash healed?
  { photosensitivity: 2, dermatitis: 0, fungal: 0, eczema: 0, acne: 1, bacterial: 0, hyperpigmentation: 5 },
  // Q12: Have you had similar skin problems before?
  { photosensitivity: 1, dermatitis: 1, fungal: 2, eczema: 2, acne: 2, bacterial: 0, hyperpigmentation: 0 },
  // Q13: Did the rash spread after scratching it?
  { photosensitivity: 0, dermatitis: 1, fungal: 3, eczema: 0, acne: 0, bacterial: 2, hyperpigmentation: 0 },
  // Q14: Do you have fever or feel generally unwell along with the skin problem?
  { photosensitivity: 1, dermatitis: 0, fungal: 0, eczema: 0, acne: 0, bacterial: 3, hyperpigmentation: 0 },
  // Q15: Has the skin problem lasted for more than two weeks without improvement?
  { photosensitivity: 1, dermatitis: 1, fungal: 2, eczema: 2, acne: 1, bacterial: 1, hyperpigmentation: 1 },
];

const TREATMENT_INFO = {
  photosensitivity: {
    title: "Photosensitivity Guide",
    desc: "An abnormal immune system reaction to UV rays, often triggered by medicines, creams, or systemic factors.",
    prevention: [
      "Apply broad-spectrum sunscreen (SPF 50+ / PA++++) every 2 hours.",
      "Wear UPF 50+ protective clothing, wide-brimmed hats, and UV-blocking sunglasses.",
      "Avoid direct sun exposure during peak hours (10 AM to 4 PM).",
      "Consult a doctor to check if current medications are sun-sensitizing."
    ],
    treatment: [
      "Use cool compresses or cool baths to soothe burning sensations.",
      "Apply aloe vera gel or calamine lotion to minimize itching.",
      "Use ceramide-rich moisturizers to aid barrier repair.",
      "Seek medical advice if blistering or fever develops."
    ]
  },
  fungal: {
    title: "Fungal Infection Guide",
    desc: "Skin infection caused by dermatophytes or yeast, frequently manifesting as dry, itchy, ring-shaped rashes.",
    prevention: [
      "Keep skin clean and completely dry, especially in skin folds.",
      "Change socks, underwear, and sweaty clothing daily.",
      "Wear loose, breathable cotton or moisture-wicking fabrics.",
      "Never share towels, combs, clothing, or footwear."
    ],
    treatment: [
      "Apply OTC antifungal creams (e.g. Clotrimazole, Terbinafine) twice daily.",
      "Continue treatment for 1-2 weeks after the visible rash heals to avoid relapse.",
      "Keep the infected area clean and thoroughly dry.",
      "Avoid scratching the rash to prevent spreading."
    ]
  },
  dermatitis: {
    title: "Dermatitis Guide",
    desc: "Skin inflammation caused by direct contact with soaps, cosmetics, chemicals, or metals that trigger irritant/allergic skin reactions.",
    prevention: [
      "Identify and avoid contact with your specific chemical or cosmetic triggers.",
      "Use fragrance-free, hypoallergenic, and dermatologist-tested products.",
      "Wash skin immediately with mild soap and water after contact with irritants."
    ],
    treatment: [
      "Apply cool, wet compresses to reduce skin swelling and itching.",
      "Use mild hydrocortisone cream (0.5% - 1%) to decrease redness.",
      "Apply rich emollients to restore dry, damaged skin barriers."
    ]
  },
  eczema: {
    title: "Eczema Guide",
    desc: "A chronic inflammatory skin condition characterized by dry, red, extremely itchy patches and a compromised skin barrier.",
    prevention: [
      "Moisturize skin at least twice daily with thick, fragrance-free creams.",
      "Limit baths/showers to 5-10 minutes with lukewarm water.",
      "Use mild, non-soap skin cleansers.",
      "Use a humidifier in dry indoor environments."
    ],
    treatment: [
      "Use intensive emollients immediately after bathing to lock in moisture.",
      "Apply topical corticosteroids (under medical guidance) to manage active flare-ups.",
      "Take oral OTC antihistamines at night if itching disrupts sleep."
    ]
  },
  acne: {
    title: "Acne Vulgaris Guide",
    desc: "Skin condition occurring when hair follicles become blocked with oil, dead cells, and acne bacteria.",
    prevention: [
      "Wash your face twice daily with a gentle, oil-free cleanser.",
      "Choose skincare and cosmetics labeled 'non-comedogenic'.",
      "Avoid picking or squeezing pimples to prevent scarring."
    ],
    treatment: [
      "Use OTC products containing Salicylic acid or Benzoyl peroxide.",
      "Apply topical retinoids (Adapalene) at night to regulate skin cell turnover.",
      "Keep skin hydrated with lightweight, oil-free moisturizers."
    ]
  },
  bacterial: {
    title: "Bacterial Infection Guide",
    desc: "An infection of the skin (e.g. impetigo or folliculitis) usually caused by Staph or Strep, presenting with warmth, pus, or swelling.",
    prevention: [
      "Wash cuts, scrapes, and bites immediately with soap and water.",
      "Keep wounds clean and covered with sterile bandages.",
      "Never pick at scabs or squeeze pus-filled lesions."
    ],
    treatment: [
      "Keep the infected area clean and wash with mild antiseptic soap.",
      "Apply warm, moist compresses to relieve pain and help drainage.",
      "Seek medical advice immediately if redness spreads or fever develops."
    ]
  },
  hyperpigmentation: {
    title: "Hyperpigmentation Guide",
    desc: "Darkening of skin patches due to excess melanin production, typically triggered by UV rays or post-inflammatory healing.",
    prevention: [
      "Wear broad-spectrum sunscreen (SPF 30+) daily, even indoors.",
      "Avoid scratching insect bites, picking acne, or rubbing the skin.",
      "Use vitamin C or other antioxidants to defend against UV damage."
    ],
    treatment: [
      "Apply daily sunscreen consistently to prevent spots from darkening further.",
      "Use skin-brightening agents like Vitamin C, Niacinamide, or Alpha Arbutin.",
      "Use gentle chemical exfoliants (AHA/BHA) to promote skin renewal."
    ]
  }
};

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
  const [modalCondition, setModalCondition] = useState(null);

  // Destructure 2-stage answers and images
  const {
    part1Answers = [],
    part2Answers = [],
    part1Images = [],
    part2Images = [],
  } = quizAnswers || {};

  // Stage 1 Probability calculation
  const calculateProbabilities = () => {
    const scores = {
      photosensitivity: 1,
      fungal: 1,
      dermatitis: 1,
      eczema: 1,
      acne: 1,
      bacterial: 1,
      hyperpigmentation: 1,
    };

    part1Answers.forEach((ans, idx) => {
      if (ans && CONDITION_SCORING[idx]) {
        const qScores = CONDITION_SCORING[idx];
        for (const [condition, points] of Object.entries(qScores)) {
          scores[condition] += points;
        }
      }
    });

    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

    let items = Object.entries(scores).map(([name, score]) => {
      const pct = Math.round((score / totalScore) * 100);
      return { name, score, pct };
    });

    let currentSum = items.reduce((sum, item) => sum + item.pct, 0);
    if (currentSum !== 100) {
      const diff = 100 - currentSum;
      let highestIdx = 0;
      let highestVal = -1;
      items.forEach((item, idx) => {
        if (item.score > highestVal) {
          highestVal = item.score;
          highestIdx = idx;
        }
      });
      items[highestIdx].pct += diff;
    }

    const friendlyNames = {
      photosensitivity: "Photosensitivity",
      fungal: "Fungal Infection",
      dermatitis: "Dermatitis",
      eczema: "Eczema",
      acne: "Acne",
      bacterial: "Bacterial Skin Infection",
      hyperpigmentation: "Hyperpigmentation",
    };

    return items
      .map((item) => ({
        id: item.name,
        label: friendlyNames[item.name],
        percentage: item.pct,
      }))
      .sort((a, b) => b.percentage - a.percentage);
  };

  const probabilities = calculateProbabilities();
  const highestProbCondition = probabilities[0]; // highest percentage

  // Stage 2 Photosensitivity severity logic
  const yesCount = part2Answers.filter(Boolean).length;
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
    const msg = `Hello, I need an appointment regarding skin symptoms. Highest Risk: ${highestProbCondition.label} (${highestProbCondition.percentage}%)`;
    if (isMobile())
      window.location.href = `sms:${DOCTOR.phone}?body=${encodeURIComponent(msg)}`;
    else
      alert(
        `Message: ${DOCTOR.phone}\nDoctor: ${DOCTOR.name}\nMessage: ${msg}`,
      );
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  useEffect(() => {
    const saveQuizResult = async () => {
      try {
        // Convert files to Base64 strings
        const base64Part1 = await Promise.all(
          (part1Images || []).map((file) => fileToBase64(file))
        );
        const base64Part2 = await Promise.all(
          (part2Images || []).map((file) => fileToBase64(file))
        );

        let stageKey = "mild";
        if (yesCount > 5 && yesCount <= 10) stageKey = "moderate";
        else if (yesCount > 10 && yesCount <= 13) stageKey = "severe";
        else if (yesCount > 13) stageKey = "critical";

        const payload = {
          part1Answers,
          part2Answers,
          part1Images: base64Part1,
          part2Images: base64Part2,
          probabilities,
          yesCount,
          stage: stageKey,
          stageLabel: result.label,
        };

        await quizAPI.save(payload);
        console.log("Quiz result synced successfully to backend!");
      } catch (err) {
        console.error("Failed to sync quiz result to backend:", err);
      }
    };

    saveQuizResult();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 flex items-center justify-center p-4 py-8"
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
            <CheckCircle size={56} className="mx-auto mb-4 text-emerald-600" />
            <h1 className="text-2xl font-extrabold text-gray-800">
              Assessment Complete!
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Based on your assessment, here is your skin health breakdown:
            </p>
          </div>

          {/* Probabilities Section */}
          <div className="space-y-3 mb-6 bg-gray-50 border border-gray-100 rounded-2xl p-4 sm:p-5">
            <h3 className="font-bold text-gray-800 text-sm mb-3 uppercase tracking-wider text-center">
              Skin Condition Probabilities
            </h3>
            <div className="space-y-3.5">
              {probabilities.map((prob, index) => {
                const isHighest = index === 0;
                return (
                  <div
                    key={prob.id}
                    className={`rounded-xl p-3 border transition-all ${
                      isHighest
                        ? "bg-emerald-50/70 border-emerald-200 shadow-sm"
                        : "bg-white border-gray-100"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <div className="min-w-0">
                        <p className={`text-sm font-bold truncate ${isHighest ? "text-emerald-800" : "text-gray-700"}`}>
                          {prob.label}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-sm font-extrabold ${isHighest ? "text-emerald-600" : "text-gray-500"}`}>
                          {prob.percentage}%
                        </span>
                        {isHighest && (
                          <button
                            onClick={() => setModalCondition(prob.id)}
                            className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-all whitespace-nowrap shadow-sm hover:scale-[1.02]"
                          >
                            View & Prevention & Treatment
                          </button>
                        )}
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${
                          isHighest
                            ? "from-emerald-500 to-teal-500"
                            : "from-gray-400 to-gray-500"
                        }`}
                        style={{ width: `${prob.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stage 2 Photosensitivity Severity Card (Only shown if user completed Stage 2 answers) */}
          {part2Answers.length > 0 && (
            <div className={`rounded-2xl p-5 text-center border-2 ${result.bg} ${result.border} mb-6`}>
              <div className="text-4xl mb-2">{result.icon}</div>
              <h2 className={`text-lg font-extrabold ${result.color}`}>
                {result.label}
              </h2>
              <p className="text-gray-500 text-xs mt-1">
                Stage 2 Photosensitivity Risk Profile (answered Yes {yesCount} time(s))
              </p>
              <div className="bg-white/80 rounded-xl p-3 border border-gray-100/50 mt-3 text-left">
                <p className="text-gray-600 text-xs leading-relaxed">
                  {result.treatment}
                </p>
              </div>
            </div>
          )}

          {/* Doctor Contact */}
          <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5 mb-5">
            <h4 className="font-bold text-teal-800 mb-3 flex items-center gap-1.5">
              👨‍⚕️ Recommended Healthcare Provider
            </h4>
            <div className="bg-white rounded-xl p-3 border border-teal-100 mb-4">
              <p className="text-sm font-semibold text-gray-800">
                {DOCTOR.name}
              </p>
              <p className="text-xs text-gray-500">{DOCTOR.clinic}</p>
              <p className="text-xs text-teal-600 font-medium mt-0.5">
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
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors"
              >
                <MessageCircle size={15} /> Message
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-3 italic">
              On mobile, these will open your dialer and messaging app automatically.
            </p>
          </div>

          {/* Detailed Image Previews (Optional) */}
          {(part1Images.length > 0 || part2Images.length > 0) && (
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-5">
              <h4 className="font-bold text-gray-700 text-xs mb-3 uppercase tracking-wider">
                Assessment Images Attached
              </h4>
              <div className="flex flex-wrap gap-2">
                {[...part1Images, ...part2Images].map((f, i) => (
                  <div key={i} className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                    <img
                      src={URL.createObjectURL(f)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Symptom Check-in Reminder Card */}
          <div className="mb-6">
            <ReminderCard />
          </div>

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
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-semibold text-sm shadow-lg hover:shadow-emerald-200 transition-all"
            >
              <Home size={16} /> Go Home
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Prevention & Treatment Modal */}
      <AnimatePresence>
        {modalCondition && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between z-10">
                <div>
                  <h3 className="font-extrabold text-gray-800 text-lg">
                    {TREATMENT_INFO[modalCondition].title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">Prevention & Treatment Guide</p>
                </div>
                <button
                  onClick={() => setModalCondition(null)}
                  className="p-1.5 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 overflow-y-auto">
                {/* Description */}
                <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/50">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {TREATMENT_INFO[modalCondition].desc}
                  </p>
                </div>

                {/* Prevention */}
                <div>
                  <h4 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-1.5 uppercase tracking-wide">
                    🛡️ Prevention Measures
                  </h4>
                  <ul className="space-y-2.5">
                    {TREATMENT_INFO[modalCondition].prevention.map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm text-gray-600">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Treatment */}
                <div>
                  <h4 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-1.5 uppercase tracking-wide">
                    💊 Treatment Options
                  </h4>
                  <ul className="space-y-2.5">
                    {TREATMENT_INFO[modalCondition].treatment.map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm text-gray-600">
                        <span className="text-teal-500 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-100 flex justify-end z-10">
                <button
                  onClick={() => setModalCondition(null)}
                  className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-sm"
                >
                  Close Guide
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
