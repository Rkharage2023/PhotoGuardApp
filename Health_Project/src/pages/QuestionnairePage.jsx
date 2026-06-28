import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Upload, ChevronRight, Stethoscope } from "lucide-react";

const PART1_QUESTIONS = [
  {
    section: "🩺 Stage 1: Symptoms",
    q: "Did the skin problem appear after spending time in the sun?",
  },
  {
    section: "🩺 Stage 1: Symptoms",
    q: "Are you currently taking any medication known to increase sun sensitivity?",
  },
  {
    section: "🩺 Stage 1: Symptoms",
    q: "Is the rash mainly on sun-exposed areas (face, neck, arms, hands)?",
  },
  {
    section: "🩺 Stage 1: Symptoms",
    q: "Did you recently start using a new cream, cosmetic, perfume, or soap?",
  },
  {
    section: "🩺 Stage 1: Symptoms",
    q: "Is the affected area very itchy?",
  },
  {
    section: "🩺 Stage 1: Symptoms",
    q: "Do you have burning or pain more than itching?",
  },
  {
    section: "🩺 Stage 1: Symptoms",
    q: "Does the rash have a ring-shaped border with clearer skin in the center?",
  },
  {
    section: "🩺 Stage 1: Symptoms",
    q: "Is the affected area warm, swollen, or producing pus?",
  },
  {
    section: "🩺 Stage 1: Symptoms",
    q: "Do you have pimples, blackheads, or whiteheads?",
  },
  {
    section: "🩺 Stage 1: Symptoms",
    q: "Is the skin dry, rough, or cracked?",
  },
  {
    section: "🩺 Stage 1: Symptoms",
    q: "Did the skin become darker after the rash healed?",
  },
  {
    section: "🩺 Stage 1: Symptoms",
    q: "Have you had similar skin problems before?",
  },
  {
    section: "🩺 Stage 1: Symptoms",
    q: "Did the rash spread after scratching it?",
  },
  {
    section: "🩺 Stage 1: Symptoms",
    q: "Do you have fever or feel generally unwell along with the skin problem?",
  },
  {
    section: "🩺 Stage 1: Symptoms",
    q: "Has the skin problem lasted for more than two weeks without improvement?",
  },
];

const PART2_QUESTIONS = [
  {
    section: "☀️ Stage 2: Photosensitivity",
    q: "Do you experience redness, itching, or burning on your skin after exposure to sunlight?",
  },
  {
    section: "☀️ Stage 2: Photosensitivity",
    q: "Does this reaction occur only on sun-exposed areas (face, neck, forearms, hands)?",
  },
  {
    section: "☀️ Stage 2: Photosensitivity",
    q: "Do you notice these reactions appearing within a few hours after sun exposure?",
  },
  {
    section: "☀️ Stage 2: Photosensitivity",
    q: "Have you ever developed rashes, blisters, or peeling after being in sunlight?",
  },
  {
    section: "☀️ Stage 2: Photosensitivity",
    q: "Does your skin remain sensitive for several days even after avoiding sunlight?",
  },
  {
    section: "💊 Stage 2: Drug Association",
    q: "Have you started any new medication in the last 2–4 weeks?",
  },
  {
    section: "💊 Stage 2: Drug Association",
    q: "Did the skin reaction begin after starting that medication?",
  },
  {
    section: "💊 Stage 2: Drug Association",
    q: "Does the reaction reduce or disappear when you stop the medicine?",
  },
  {
    section: "💊 Stage 2: Drug Association",
    q: "Are you currently taking any of the following: antibiotics, NSAIDs, diuretics, retinoids, or antifungals?",
  },
  {
    section: "💊 Stage 2: Drug Association",
    q: "Have you ever noticed worsening skin reaction when taking a medicine and going out in the sun?",
  },
  {
    section: "☀️ Stage 2: Pattern & Severity",
    q: "Does your skin tolerate indoor light but react to direct sunlight?",
  },
  {
    section: "☀️ Stage 2: Pattern & Severity",
    q: "Do you notice dark pigmentation or spots after the redness subsides?",
  },
  {
    section: "☀️ Stage 2: Pattern & Severity",
    q: "Do you experience eye irritation or tearing when exposed to sunlight while on medication?",
  },
  {
    section: "☀️ Stage 2: Pattern & Severity",
    q: "Have you ever been told by a doctor that your reaction is drug-related or photosensitive?",
  },
  {
    section: "☀️ Stage 2: Pattern & Severity",
    q: "Do you have a family history of similar sunlight-related reactions?",
  },
];

export default function QuestionnairePage({
  quizAnswers,
  setQuizAnswers,
  onComplete,
  onBack,
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [part1Answers, setPart1Answers] = useState([]);
  const [part2Answers, setPart2Answers] = useState([]);
  const [part1Images, setPart1Images] = useState([]);
  const [part2Images, setPart2Images] = useState([]);

  const [hasPhotoPermission, setHasPhotoPermission] = useState(() => {
    return localStorage.getItem("consent_camera") === "true";
  });

  const requestPhotoPermission = async () => {
    try {
      if ("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((track) => track.stop());
      }
      localStorage.setItem("consent_camera", "true");
      setHasPhotoPermission(true);
    } catch (err) {
      alert("Camera/Photo library permission is required to upload skin photos.");
    }
  };

  // Active step mapping:
  // Step 0-14: Stage 1 Questions (15 questions)
  // Step 15: Stage 1 Photo Upload
  // Step 16: Transition Screen to Stage 2
  // Step 17-31: Stage 2 Questions (15 questions)
  // Step 32: Stage 2 Photo Upload

  const handleNext = () => {
    if (activeStep < 32) {
      setActiveStep((prev) => prev + 1);
    } else {
      // Completed last step, save to parent state and complete
      setQuizAnswers({
        part1Answers,
        part2Answers,
        part1Images,
        part2Images,
      });
      onComplete();
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    } else {
      onBack();
    }
  };

  const answerQuestion = (val) => {
    if (activeStep <= 14) {
      const newAnswers = [...part1Answers];
      newAnswers[activeStep] = val;
      setPart1Answers(newAnswers);
      handleNext();
    } else if (activeStep >= 17 && activeStep <= 31) {
      const qIdx = activeStep - 17;
      const newAnswers = [...part2Answers];
      newAnswers[qIdx] = val;
      setPart2Answers(newAnswers);
      handleNext();
    }
  };

  const handlePart1ImageUpload = (e) => {
    setPart1Images((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const handlePart2ImageUpload = (e) => {
    setPart2Images((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const removePart1Image = (idx) => {
    setPart1Images((prev) => prev.filter((_, i) => i !== idx));
  };

  const removePart2Image = (idx) => {
    setPart2Images((prev) => prev.filter((_, i) => i !== idx));
  };

  // Render variables based on activeStep
  let headerTitle = "";
  let progressPercentage = 0;
  let subText = "";

  if (activeStep <= 14) {
    headerTitle = PART1_QUESTIONS[activeStep].section;
    progressPercentage = ((activeStep + 1) / 16) * 100;
    subText = `${activeStep + 1} / 15 (Part 1)`;
  } else if (activeStep === 15) {
    headerTitle = "📷 Stage 1: Image Upload";
    progressPercentage = 100;
    subText = "Optional Upload";
  } else if (activeStep === 16) {
    headerTitle = "✨ Next Stage";
    progressPercentage = 0;
    subText = "Transition";
  } else if (activeStep >= 17 && activeStep <= 31) {
    const qIdx = activeStep - 17;
    headerTitle = PART2_QUESTIONS[qIdx].section;
    progressPercentage = ((qIdx + 1) / 16) * 100;
    subText = `${qIdx + 1} / 15 (Part 2)`;
  } else if (activeStep === 32) {
    headerTitle = "📷 Stage 2: Image Upload";
    progressPercentage = 100;
    subText = "Optional Upload";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-2xl">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-white/70 hover:text-white mb-4 text-sm transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
              {headerTitle}
            </span>
            <span className="text-xs text-gray-400 font-semibold">{subText}</span>
          </div>

          {/* Progress Bar (hidden during transition screen) */}
          {activeStep !== 16 && (
            <div className="h-2 bg-gray-100 rounded-full mb-8 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}

          {/* Question / Content area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.2 }}
              className="min-h-32 flex flex-col justify-center"
            >
              {/* STAGE 1 QUESTIONS */}
              {activeStep <= 14 && (
                <p className="text-xl sm:text-2xl font-semibold text-gray-800 text-center leading-relaxed mb-8">
                  {PART1_QUESTIONS[activeStep].q}
                </p>
              )}

              {/* STAGE 1 PHOTO UPLOAD */}
              {activeStep === 15 && (
                <div className="mb-6">
                  <p className="text-lg font-semibold text-gray-800 text-center mb-4">
                    Please upload an image of the affected skin area for Stage 1.
                  </p>
                  {!hasPhotoPermission ? (
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        requestPhotoPermission();
                      }}
                      className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-red-200 bg-red-50/30 rounded-2xl cursor-pointer hover:bg-red-50 transition-all text-center"
                    >
                      <span className="text-3xl">🔒</span>
                      <span className="text-gray-700 font-bold text-sm">Camera & Photo Access Restricted</span>
                      <span className="text-gray-500 text-xs max-w-xs leading-relaxed">
                        We require photo upload permissions to capture symptoms. Click here to grant access.
                      </span>
                      <button
                        type="button"
                        className="mt-2 px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 shadow-sm"
                      >
                        Grant Access Permission
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="img-upload-part1"
                      className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all"
                    >
                      <Upload size={32} className="text-gray-400" />
                      <span className="text-gray-600 font-medium">Click to upload images</span>
                      <span className="text-gray-400 text-sm">PNG, JPG, GIF up to 10MB</span>
                      <input
                        id="img-upload-part1"
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handlePart1ImageUpload}
                      />
                    </label>
                  )}

                  {part1Images.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-600 mb-2">
                        {part1Images.length} image(s) selected
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        {part1Images.map((f, i) => (
                          <div key={i} className="relative rounded-xl overflow-hidden aspect-square">
                            <img
                              src={URL.createObjectURL(f)}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => removePart1Image(i)}
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

              {/* TRANSITION SCREEN */}
              {activeStep === 16 && (
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-50 mb-6 border border-emerald-100">
                    <Stethoscope size={40} className="text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    Stage 1 Assessment Complete
                  </h2>
                  <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
                    Now, we will proceed to **Stage 2: Photosensitivity & Drug Association Details** to pinpoint specific sunlight and medication triggers.
                  </p>
                  <motion.button
                    onClick={handleNext}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-base shadow-lg hover:shadow-emerald-100 transition-all"
                  >
                    Start Stage 2 <ChevronRight size={18} />
                  </motion.button>
                </div>
              )}

              {/* STAGE 2 QUESTIONS */}
              {activeStep >= 17 && activeStep <= 31 && (
                <p className="text-xl sm:text-2xl font-semibold text-gray-800 text-center leading-relaxed mb-8">
                  {PART2_QUESTIONS[activeStep - 17].q}
                </p>
              )}

              {/* STAGE 2 PHOTO UPLOAD */}
              {activeStep === 32 && (
                <div className="mb-6">
                  <p className="text-lg font-semibold text-gray-800 text-center mb-4">
                    Please upload close-up or additional images for Stage 2 (Optional).
                  </p>
                  {!hasPhotoPermission ? (
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        requestPhotoPermission();
                      }}
                      className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-red-200 bg-red-50/30 rounded-2xl cursor-pointer hover:bg-red-50 transition-all text-center"
                    >
                      <span className="text-3xl">🔒</span>
                      <span className="text-gray-700 font-bold text-sm">Camera & Photo Access Restricted</span>
                      <span className="text-gray-500 text-xs max-w-xs leading-relaxed">
                        We require photo upload permissions to capture symptoms. Click here to grant access.
                      </span>
                      <button
                        type="button"
                        className="mt-2 px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 shadow-sm"
                      >
                        Grant Access Permission
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="img-upload-part2"
                      className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all"
                    >
                      <Upload size={32} className="text-gray-400" />
                      <span className="text-gray-600 font-medium">Click to upload images</span>
                      <span className="text-gray-400 text-sm">PNG, JPG, GIF up to 10MB</span>
                      <input
                        id="img-upload-part2"
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handlePart2ImageUpload}
                      />
                    </label>
                  )}

                  {part2Images.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-600 mb-2">
                        {part2Images.length} image(s) selected
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        {part2Images.map((f, i) => (
                          <div key={i} className="relative rounded-xl overflow-hidden aspect-square">
                            <img
                              src={URL.createObjectURL(f)}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => removePart2Image(i)}
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

          {/* Action buttons (Yes/No vs Stage Continue) */}
          {activeStep !== 16 && (
            <div>
              {/* For standard questions */}
              {((activeStep >= 0 && activeStep <= 14) || (activeStep >= 17 && activeStep <= 31)) && (
                <div className="flex gap-4">
                  <motion.button
                    onClick={() => answerQuestion(true)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-emerald-200 transition-all"
                  >
                    Yes
                  </motion.button>
                  <motion.button
                    onClick={() => answerQuestion(false)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 py-4 bg-gray-50 text-gray-700 rounded-2xl font-bold text-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-100 transition-all"
                  >
                    No
                  </motion.button>
                </div>
              )}

              {/* For Stage 1 Photo Upload */}
              {activeStep === 15 && (
                <motion.button
                  onClick={handleNext}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-emerald-200 transition-all"
                >
                  Continue to Stage 2 Details →
                </motion.button>
              )}

              {/* For Stage 2 Photo Upload */}
              {activeStep === 32 && (
                <motion.button
                  onClick={handleNext}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-emerald-200 transition-all"
                >
                  Complete Assessment & View Results →
                </motion.button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
