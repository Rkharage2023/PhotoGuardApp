import React from "react";
import { motion } from "framer-motion";
import { X, CheckCircle, Mail, PlayCircle } from "lucide-react";

const VideoCard = ({ title, embedSrc, description }) => (
  <div className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
    <div className="relative aspect-video bg-gradient-to-br from-violet-500 to-purple-700">
      <iframe
        src={embedSrc}
        title={title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
    <div className="p-4">
      <p className="font-semibold text-gray-800 text-sm mb-1">{title}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  </div>
);

const AchievementCard = ({ title, content, Icon, color }) => (
  <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start gap-3">
      <div className={`mt-0.5 ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className={`font-semibold text-sm mb-1 ${color}`}>{title}</p>
        <p className="text-xs text-gray-500 leading-relaxed">{content}</p>
      </div>
    </div>
  </div>
);

export default function Dashboard({ onClose, phoneNumber }) {
  return (
    <motion.aside
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 260 }}
      className="fixed top-0 left-0 bottom-0 z-50 w-full max-w-sm bg-white shadow-2xl overflow-y-auto flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
        <div>
          <h2 className="font-bold text-gray-800 text-lg">Dashboard</h2>
          <p className="text-xs text-gray-400">{phoneNumber}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 p-5 space-y-6">
        {/* Welcome */}
        <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 p-5 text-white">
          <p className="text-sm font-medium opacity-80 mb-1">Welcome back</p>
          <h3 className="text-2xl font-bold">PhotoGuard</h3>
          <p className="text-xs mt-2 opacity-70">
            Your photosensitivity health partner
          </p>
        </div>

        {/* Primary Protection Video */}
        <div>
          <h3 className="text-sm font-bold text-violet-600 mb-3 uppercase tracking-wider">
            Primary Protection
          </h3>
          <VideoCard
            title="Understanding UV & SPF"
            embedSrc="https://www.youtube.com/embed/g2qFq-uS7aE"
            description="A quick guide to broad-spectrum protection and SPF rating."
          />
        </div>

        {/* Achievements */}
        <div>
          <h3 className="text-sm font-bold text-emerald-600 mb-3 uppercase tracking-wider">
            Pharmacy Achievements
          </h3>
          <div className="space-y-3">
            <AchievementCard
              title="Clinical Certification"
              content="Certified specialist in Dermatological Photodetection with advanced training in photosensitivity management."
              Icon={CheckCircle}
              color="text-emerald-500"
            />
            <AchievementCard
              title="5000+ Consultations"
              content="Successfully managed over five thousand patient cases involving sun-related skin reactions."
              Icon={Mail}
              color="text-blue-500"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Patients Helped", value: "5,000+" },
            { label: "Success Rate", value: "94%" },
            { label: "Years Active", value: "10+" },
            { label: "Expert Doctors", value: "15+" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-100"
            >
              <p className="text-lg font-bold text-gray-800">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}
