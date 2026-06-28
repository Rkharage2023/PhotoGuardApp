import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Stethoscope, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MEDICINE_BLOCKLIST = [
  "cetirizine", "loratadine", "fexofenadine", "diphenhydramine", "benadryl", "allegra",
  "claritin", "zyrtec", "prednisone", "hydrocortisone", "betamethasone", "clobetasol",
  "antibiotic", "steroid", "acyclovir", "tinidazole", "metronidazole", "warfarin", "statin",
  "paracetamol", "acetaminophen", "ibuprofen", "nimesulide", "diclofenac", "aspirin",
  "insulin", "metformin", "amoxicillin", "penicillin", "doxycycline"
];

const SUGGESTIONS = [
  "What is the best sunscreen?",
  "How to soothe severe itching?",
  "What is calamine suspension?",
  "How do I prevent sun rashes?",
  "Tell me about Dermatitis",
];

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I am your PhotoGuard Skin Coach. I can help with information on protective sunscreens, soothing creams, zinc/calamine suspensions, and general preventative instructions. Ask me any question! (Note: I do not prescribe or mention drug names directly for safety).",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const checkSafetyFilter = (text) => {
    const lowerText = text.toLowerCase();
    return MEDICINE_BLOCKLIST.some((med) => lowerText.includes(med));
  };

  const executeLocalQA = (userText) => {
    const text = userText.toLowerCase();

    // Safety checks
    if (checkSafetyFilter(text)) {
      return "⚠️ Safety Note: As an AI Skin Coach, I am programmed to never recommend, prescribe, or list specific prescription drug names (such as antihistamines, steroids, or antibiotics). Please consult a qualified doctor or visit our recommended health clinic for prescription medication options. I can, however, guide you on over-the-counter protective sunscreens, soothing barrier creams, calamine/zinc suspensions, and preventative skin hygiene.";
    }

    if (text.includes("sunscreen") || text.includes("sunscream") || text.includes("spf") || text.includes("uv") || text.includes("sun protection") || text.includes("sunblock") || text.includes("sun")) {
      return "☀️ Sunscreen Recommendations:\n• Apply broad-spectrum mineral sunscreen (SPF 50+ / PA++++) containing Zinc Oxide or Titanium Dioxide. Mineral sunscreens are ideal as they do not trigger photosensitivity.\n• Reapply every 2 hours when outdoors.\n• Avoid direct sun exposure during peak UV index hours (10 AM - 4 PM).";
    }

    if (text.includes("cream") || text.includes("lotion") || text.includes("moisturizer") || text.includes("aloe") || text.includes("soothe") || text.includes("dry") || text.includes("itch") || text.includes("burn") || text.includes("scratch")) {
      return "🧴 Creams & Lotions Information:\n• Fragrance-free Aloe Vera gel is excellent for immediate cooling of mild burns.\n• Calamine lotion reduces widespread skin itching and redness (apply 2-3 times daily).\n• Barrier repair creams containing Ceramides, Shea Butter, or Hyaluronic Acid restore dry, flaky, or cracked skin barriers.\n• Avoid skincare containing alcohol, synthetic fragrances, or essential oils during skin flare-ups.";
    }

    if (text.includes("suspension") || text.includes("zinc oxide") || text.includes("liquid") || text.includes("calamine")) {
      return "🧪 Topical Suspensions:\n• Calamine or Zinc Oxide suspensions are ideal for cooling inflamed, weeping, or oozing skin reactions.\n• Clean the affected area, shake the suspension well, and apply a thin layer using a clean cotton swab.\n• Allow it to dry completely. Avoid using suspensions on deep open wounds.";
    }

    if (text.includes("prevent") || text.includes("prevention") || text.includes("instructions") || text.includes("clothing") || text.includes("protect") || text.includes("wear")) {
      return "🛡️ Preventative Skin Care Instructions:\n1. Wear UPF 50+ protective clothing, wide-brimmed hats, and UV sunglasses.\n2. Do not scratch or pick at skin rashes to avoid secondary bacterial infections.\n3. Choose fragrance-free, hypoallergenic, and non-comedogenic cosmetics.\n4. Avoid hot showers; limit baths to 10 minutes using lukewarm water.";
    }

    if (text.includes("dermatitis") || text.includes("eczema") || text.includes("acne") || text.includes("fungal") || text.includes("rash") || text.includes("infection")) {
      return "🔍 General Condition Info:\n• Dermatitis: Skin irritation from soap/allergens. Prevention: Avoid triggers, use barrier creams.\n• Eczema: Dry, red patches. Prevention: Intensive moisturizers twice daily.\n• Fungal Infection: Itchy ring-shaped spots. Prevention: Keep area dry, use OTC antifungal creams.\n• Acne: Clogged pores. Prevention: Wash face twice daily with oil-free cleansers.";
    }

    if (text.includes("hello") || text.includes("hi") || text.includes("hey") || text.includes("help") || text.includes("welcome")) {
      return "👋 Hello! I am your PhotoGuard Skin Coach. I can suggest protective sunscreens, soothing creams, calamine/zinc suspensions, and preventative skin hygiene instructions. How can I help you today?";
    }

    // Fallback
    return "💡 I understand you're asking about skin health. To ensure medical safety, I do not discuss specific drug names. I can, however, provide details on protective sunscreens, soothing creams, calamine/zinc suspensions, and general preventative instructions. Try asking: 'What cream is good for itching?' or 'How do I prevent sun sensitivity?'";
  };

  const handleSend = async (textToSend) => {
    const msg = textToSend.trim();
    if (!msg) return;

    // Add user message
    const newMessages = [...messages, { sender: "user", text: msg }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (apiKey && apiKey.trim() !== "") {
      // ── Gemini Mode ──
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: `System Directive: You are a helpful, professional medical assistant called 'PhotoGuard Skin Coach'. Your goal is to guide the user on preventative skin instructions, sunscreens, creams, lotions, and suspensions. 
CRITICAL RULE: You must NEVER mention, suggest, or name specific prescription medicine/drug names (such as cetirizine, fexofenadine, antihistamines, steroids, antibiotics, etc.). If the user asks about a drug or medication, politely instruct them to consult a qualified physician or pharmacist for prescription advice, and redirect them to safe OTC preventative choices (like sunscreens, soothing lotions, or calamine/zinc suspensions). Keep answers friendly, helpful, concise, and under 150 words.
User Question: ${msg}`
                    }
                  ]
                }
              ],
              generationConfig: {
                maxOutputTokens: 250,
              }
            }),
          }
        );

        if (!response.ok) throw new Error("Gemini API Error");

        const data = await response.json();
        let botText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // Post-response blocklist safety check to guarantee no drug mentions slip through
        if (checkSafetyFilter(botText)) {
          botText = "⚠️ Safety Note: As an AI Skin Coach, I am programmed to never recommend, prescribe, or list specific prescription drug names. Please consult a qualified doctor or visit our recommended health clinic for prescription medication options. I can, however, guide you on over-the-counter protective sunscreens, soothing barrier creams, calamine/zinc suspensions, and preventative skin hygiene.";
        }

        setMessages((prev) => [...prev, { sender: "bot", text: botText }]);
      } catch (err) {
        // Fallback to local QA if API fails
        const reply = executeLocalQA(msg);
        setMessages((prev) => [...prev, { sender: "bot", text: `${reply} (Offline Fallback)` }]);
      } finally {
        setIsLoading(false);
      }
    } else {
      // ── Local QA Mode ──
      setTimeout(() => {
        const reply = executeLocalQA(msg);
        setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
        setIsLoading(false);
      }, 500);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.85 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="w-[90vw] sm:w-[380px] h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 px-5 py-4 flex items-center justify-between text-white shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <Stethoscope size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-none">PhotoGuard Skin Coach</h3>
                  <div className="flex items-center gap-1.5 mt-1 leading-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    <span className="text-[10px] text-white/80 font-medium">Online Helper</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/20 transition-all text-white/80 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.map((msg, i) => {
                const isBot = msg.sender === "bot";
                return (
                  <div key={i} className={`flex ${isBot ? "justify-start" : "justify-end"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                        isBot
                          ? "bg-white text-gray-700 border border-gray-100 rounded-tl-none"
                          : "bg-emerald-600 text-white rounded-tr-none"
                      } whitespace-pre-line`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-400 border border-gray-100 rounded-2xl rounded-tl-none px-4 py-2 text-sm leading-relaxed flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce delay-200" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion Chips */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 overflow-x-auto flex gap-2 no-scrollbar">
              {SUGGESTIONS.map((sug) => (
                <button
                  key={sug}
                  disabled={isLoading}
                  onClick={() => handleSend(sug)}
                  className="flex-shrink-0 px-3 py-1 bg-white hover:bg-emerald-50 border border-gray-100 hover:border-emerald-200 text-gray-600 hover:text-emerald-700 text-xs font-semibold rounded-full shadow-sm transition-all disabled:opacity-50"
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
            >
              <input
                type="text"
                disabled={isLoading}
                placeholder="Ask about sunscreens, creams, lotions..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-4 py-2 text-sm border border-gray-200 focus:border-emerald-400 rounded-xl focus:outline-none transition-colors disabled:bg-gray-50"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-sm transition-colors disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (FAB) */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white shadow-xl flex items-center justify-center hover:shadow-emerald-200/50 transition-shadow duration-300 relative"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
