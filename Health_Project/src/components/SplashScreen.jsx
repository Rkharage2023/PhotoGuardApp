import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Stethoscope } from "lucide-react";

export default function SplashScreen({ onComplete }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 2800);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex items-center justify-center relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
        className="text-center relative z-10"
      >
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mb-6 inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm border border-white/30"
        >
          <Stethoscope size={48} className="text-white" />
        </motion.div>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-5xl font-bold text-white mb-3 tracking-tight"
        >
          PhotoGuard
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="text-white/80 text-lg font-medium mb-10"
        >
          Photosensitivity Assessment Platform
        </motion.p>

        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          transition={{ delay: 1.0, duration: 1.5, ease: "easeInOut" }}
          className="h-1 bg-white/60 rounded-full mx-auto max-w-xs"
        />
      </motion.div>
    </div>
  );
}
