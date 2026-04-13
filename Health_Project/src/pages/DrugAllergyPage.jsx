import React, { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ChevronDown, ChevronRight } from "lucide-react";

const FOODS_ALLERGY = [
  {
    food: "Shellfish (shrimp, crab, lobster)",
    symptoms: "Hives, swelling, anaphylaxis, breathing difficulty",
    severity: "High",
  },
  {
    food: "Peanuts",
    symptoms: "Rashes, itching, anaphylactic shock",
    severity: "High",
  },
  {
    food: "Tree nuts (almonds, walnuts, cashews)",
    symptoms: "Hives, swelling, GI upset",
    severity: "High",
  },
  {
    food: "Milk & Dairy products",
    symptoms: "Skin rash, bloating, diarrhea",
    severity: "Medium",
  },
  {
    food: "Eggs",
    symptoms: "Eczema, hives, nasal congestion",
    severity: "Medium",
  },
  {
    food: "Wheat / Gluten",
    symptoms: "Rash, digestive issues, fatigue",
    severity: "Medium",
  },
  {
    food: "Soy",
    symptoms: "Itching, hives, breathing problems",
    severity: "Low-Medium",
  },
  {
    food: "Fish (tuna, salmon, cod)",
    symptoms: "Hives, nausea, headaches",
    severity: "Medium-High",
  },
];

const WRONG_COMBOS = [
  {
    food: "Dairy products",
    drug: "Antibiotics (tetracyclines, fluoroquinolones)",
    effect:
      "Calcium in dairy binds to the antibiotic, reducing absorption by up to 50%. Take antibiotics 2 hours before or 6 hours after dairy.",
  },
  {
    food: "Grapefruit",
    drug: "Statins, calcium channel blockers, some antihistamines",
    effect:
      "Grapefruit inhibits CYP3A4 enzyme in the gut, causing dangerously high drug levels and increasing side-effect risk.",
  },
  {
    food: "Alcohol",
    drug: "Metronidazole, tinidazole, NSAIDs, acetaminophen",
    effect:
      "Causes disulfiram-like reaction (nausea, flushing, vomiting) or increases liver toxicity risk significantly.",
  },
  {
    food: "Green leafy vegetables (kale, spinach)",
    drug: "Warfarin (blood thinners)",
    effect:
      "High vitamin K content in greens counteracts anticoagulant effects, making INR management difficult.",
  },
  {
    food: "Tyramine-rich foods (aged cheese, cured meats)",
    drug: "MAO inhibitors (antidepressants)",
    effect:
      "Can trigger a hypertensive crisis — sudden, dangerous spike in blood pressure.",
  },
  {
    food: "Potassium-rich foods (bananas, oranges)",
    drug: "ACE inhibitors, potassium-sparing diuretics",
    effect:
      "Risk of hyperkalemia (dangerously high potassium), causing heart arrhythmias.",
  },
];

const COMMON_PROBLEMS = [
  {
    point: "Dairy & Antibiotics",
    detail:
      "Dairy products like milk, yogurt, and cheese contain calcium that binds to certain antibiotics (particularly tetracyclines and fluoroquinolones), forming insoluble complexes that cannot be absorbed. This significantly reduces antibiotic effectiveness.",
  },
  {
    point: "Grapefruit & Medications",
    detail:
      "Grapefruit and grapefruit juice contain furanocoumarins that irreversibly block cytochrome P450 3A4, an enzyme critical for drug metabolism in the intestine. This leads to abnormally high drug concentrations in the bloodstream.",
  },
  {
    point: "Alcohol & Medications",
    detail:
      "Alcohol interacts with numerous medications — it can increase sedative effects of antihistamines, cause liver damage when combined with acetaminophen, and cause severe reactions with antibiotics like metronidazole.",
  },
  {
    point: "Leafy Greens & Blood Thinners",
    detail:
      "Warfarin works by blocking vitamin K-dependent clotting factors. Eating large amounts of vitamin K-rich foods like kale, spinach, and broccoli can decrease warfarin effectiveness and increase clotting risk.",
  },
];

const severityColor = {
  High: "bg-red-50 text-red-700 border-red-200",
  "Medium-High": "bg-orange-50 text-orange-700 border-orange-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  "Low-Medium": "bg-yellow-50 text-yellow-700 border-yellow-200",
};

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <span className="font-semibold text-gray-700 text-sm">{title}</span>
        {open ? (
          <ChevronDown size={16} className="text-gray-400" />
        ) : (
          <ChevronRight size={16} className="text-gray-400" />
        )}
      </button>
      {open && <div className="p-4 pt-0 bg-white">{children}</div>}
    </div>
  );
}

export default function DrugAllergyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-100 border border-amber-200 mb-4">
            <AlertTriangle size={28} className="text-amber-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            Food Drug Allergy
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Understanding food-drug interactions and allergies for better health
            management
          </p>
        </motion.div>

        {/* Section 1: Foods that may cause allergies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-6 bg-red-400 rounded-full" />
            <h2 className="text-lg font-bold text-gray-800">
              1. Foods That May Cause Allergies
            </h2>
          </div>
          <div className="space-y-3">
            {FOODS_ALLERGY.map(({ food, symptoms, severity }) => (
              <div
                key={food}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">{food}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{symptoms}</p>
                </div>
                <span
                  className={`flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border ${severityColor[severity] || "bg-gray-50 text-gray-600 border-gray-200"}`}
                >
                  {severity}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Section 2: Wrong combinations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-6 bg-amber-400 rounded-full" />
            <h2 className="text-lg font-bold text-gray-800">
              2. Wrong Combinations of Food and Drugs
            </h2>
          </div>
          <div className="space-y-3">
            {WRONG_COMBOS.map(({ food, drug, effect }) => (
              <Accordion key={food} title={`${food} + ${drug}`}>
                <p className="text-sm text-gray-600 leading-relaxed mt-2 pl-1 border-l-4 border-amber-300">
                  {effect}
                </p>
              </Accordion>
            ))}
          </div>
        </motion.div>

        {/* Section 3: Common problems */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-6 bg-violet-400 rounded-full" />
            <h2 className="text-lg font-bold text-gray-800">
              3. Common Food-Drug Interaction Problems
            </h2>
          </div>
          <div className="space-y-3">
            {COMMON_PROBLEMS.map(({ point, detail }, i) => (
              <div
                key={point}
                className="p-4 bg-gray-50 rounded-2xl border-l-4 border-violet-300"
              >
                <h3 className="font-bold text-violet-700 text-sm mb-1">
                  {String.fromCharCode(97 + i)}. {point}
                </h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  {detail}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center"
        >
          <p className="text-amber-800 text-sm font-medium">
            ⚠️ This information is for educational purposes only. Always consult
            a qualified healthcare professional before making any changes to
            your diet or medication routine.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
