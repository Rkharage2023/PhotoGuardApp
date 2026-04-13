import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Upload } from "lucide-react";

const QUESTIONS = [
  {
    section: "🩺 General Symptoms",
    q: "Do you experience redness, itching, or burning on your skin after exposure to sunlight?",
  },
  {
    section: "🩺 General Symptoms",
    q: "Does this reaction occur only on sun-exposed areas (face, neck, forearms, hands)?",
  },
  {
    section: "🩺 General Symptoms",
    q: "Do you notice these reactions appearing within a few hours after sun exposure?",
  },
  {
    section: "🩺 General Symptoms",
    q: "Have you ever developed rashes, blisters, or peeling after being in sunlight?",
  },
  {
    section: "🩺 General Symptoms",
    q: "Does your skin remain sensitive for several days even after avoiding sunlight?",
  },
  {
    section: "💊 Drug Association",
    q: "Have you started any new medication in the last 2–4 weeks?",
  },
  {
    section: "💊 Drug Association",
    q: "Did the skin reaction begin after starting that medication?",
  },
  {
    section: "💊 Drug Association",
    q: "Does the reaction reduce or disappear when you stop the medicine?",
  },
  {
    section: "💊 Drug Association",
    q: "Are you currently taking any of the following: antibiotics, NSAIDs, diuretics, retinoids, or antifungals?",
  },
  {
    section: "💊 Drug Association",
    q: "Have you ever noticed worsening skin reaction when taking a medicine and going out in the sun?",
  },
  {
    section: "☀️ Pattern & Severity",
    q: "Does your skin tolerate indoor light but react to direct sunlight?",
  },
  {
    section: "☀️ Pattern & Severity",
    q: "Do you notice dark pigmentation or spots after the redness subsides?",
  },
  {
    section: "☀️ Pattern & Severity",
    q: "Do you experience eye irritation or tearing when exposed to sunlight while on medication?",
  },
  {
    section: "☀️ Pattern & Severity",
    q: "Have you ever been told by a doctor that your reaction is drug-related or photosensitive?",
  },
  {
    section: "☀️ Pattern & Severity",
    q: "Do you have a family history of similar sunlight-related reactions?",
  },
  {
    section: "📷 Additional Info",
    q: "Upload images of affected areas (optional)",
    isImageQuestion: true,
  },
];

export default function QuestionnairePage({
  quizAnswers,
  setQuizAnswers,
  onComplete,
  onBack,
}) {
  const [currentQ, setCurrentQ] = useState(0);
  const [images, setImages] = useState([]);

  const question = QUESTIONS[currentQ];
  const progress = ((currentQ + 1) / QUESTIONS.length) * 100;
  const isLast = currentQ === QUESTIONS.length - 1;

  const answer = (val) => {
    const newAnswers = [...quizAnswers, val];
    setQuizAnswers(newAnswers);
    if (currentQ < QUESTIONS.length - 1) setCurrentQ((q) => q + 1);
    else onComplete();
  };

  const handleImageUpload = (e) => {
    setImages((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-2xl">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/70 hover:text-white mb-4 text-sm transition-colors"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <span className="text-xs font-bold text-violet-600 bg-violet-50 px-3 py-1.5 rounded-full border border-violet-100">
              {question.section}
            </span>
            <span className="text-xs text-gray-400 font-semibold">
              {currentQ + 1} / {QUESTIONS.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-gray-100 rounded-full mb-8 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-400 to-violet-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.2 }}
              className="min-h-32 flex flex-col justify-center"
            >
              <p className="text-xl sm:text-2xl font-semibold text-gray-800 text-center leading-relaxed mb-8">
                {question.q}
              </p>

              {/* Image Upload (last question) */}
              {question.isImageQuestion && (
                <div className="mb-6">
                  <label
                    htmlFor="img-upload"
                    className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition-all"
                  >
                    <Upload size={32} className="text-gray-400" />
                    <span className="text-gray-600 font-medium">
                      Click to upload images
                    </span>
                    <span className="text-gray-400 text-sm">
                      PNG, JPG, GIF up to 10MB
                    </span>
                    <input
                      id="img-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>

                  {images.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-600 mb-2">
                        {images.length} image(s) selected
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        {images.map((f, i) => (
                          <div
                            key={i}
                            className="relative rounded-xl overflow-hidden aspect-square"
                          >
                            <img
                              src={URL.createObjectURL(f)}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() =>
                                setImages((imgs) =>
                                  imgs.filter((_, j) => j !== i),
                                )
                              }
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Answer Buttons */}
          {!question.isImageQuestion ? (
            <div className="flex gap-4">
              <motion.button
                onClick={() => answer(true)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-emerald-200 transition-all"
              >
                Yes
              </motion.button>
              <motion.button
                onClick={() => answer(false)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 py-4 bg-gray-50 text-gray-700 rounded-2xl font-bold text-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-100 transition-all"
              >
                No
              </motion.button>
            </div>
          ) : (
            <motion.button
              onClick={() => answer(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-violet-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-blue-200 transition-all"
            >
              Continue to Results →
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
