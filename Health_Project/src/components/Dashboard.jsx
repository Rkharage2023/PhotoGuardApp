import React from "react";
import { motion } from "framer-motion";
import { X, CheckCircle, Mail } from "lucide-react";

import cert1 from "../assets/certificate 1.jpg";
import cert2 from "../assets/certificate 2.jpg";
import cert3 from "../assets/certificate 3.jpg";

const CERTS = [cert1, cert2, cert3];

function openCert(src) {
  const win = window.open("", "_blank");
  win.document.write(
    `<html><head><title>Certificate</title><style>
      body{margin:0;background:#111;display:flex;align-items:center;justify-content:center;min-height:100vh;}
      img{max-width:100%;max-height:100vh;object-fit:contain;border-radius:8px;}
    </style></head><body><img src="${src}" /></body></html>`,
  );
}

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
        {/* Welcome banner */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white">
          <p className="text-sm font-medium opacity-80 mb-1">Welcome back</p>
          <h3 className="text-2xl font-bold">PhotoGuard</h3>
          <p className="text-xs mt-2 opacity-70">
            Your photosensitivity health partner
          </p>
        </div>

        {/* Primary Protection Video */}
        <div>
          <h3 className="text-xs font-bold text-emerald-600 mb-3 uppercase tracking-wider">
            Primary Protection
          </h3>
          <div className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
            <div
              className="relative w-full"
              style={{ paddingBottom: "56.25%" }}
            >
              <iframe
                src="https://www.youtube.com/embed/g2qFq-uS7aE"
                title="Understanding UV & SPF"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-3">
              <p className="font-semibold text-gray-800 text-sm">
                Understanding UV & SPF
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                A quick guide to broad-spectrum protection and SPF rating.
              </p>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h3 className="text-xs font-bold text-emerald-600 mb-3 uppercase tracking-wider">
            Pharmacy Achievements
          </h3>
          <div className="space-y-3">
            {/* Clinical Certification with clickable certificate images */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle
                  size={20}
                  className="text-emerald-500 mt-0.5 flex-shrink-0"
                />
                <div>
                  <p className="font-semibold text-sm text-emerald-600">
                    Clinical Certification
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Certified specialist in Dermatological Photodetection with
                    advanced training in photosensitivity management.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {CERTS.map((src, i) => (
                  <div
                    key={i}
                    onClick={() => openCert(src)}
                    className="relative rounded-xl overflow-hidden cursor-pointer group"
                  >
                    <img
                      src={src}
                      alt={`Certificate ${i + 1}`}
                      className="w-full h-20 object-cover border-2 border-gray-100
                                 group-hover:border-emerald-400 transition-all duration-200"
                    />
                    <div
                      className="absolute inset-0 bg-emerald-600/0 group-hover:bg-emerald-600/75
                                    transition-all duration-200 flex items-center justify-center"
                    >
                      <span
                        className="text-white text-xs font-bold opacity-0
                                       group-hover:opacity-100 transition-opacity duration-200"
                      >
                        View
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center italic">
                Tap any certificate to view full size
              </p>
            </div>

            {/* Consultations */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-start gap-3">
                <Mail
                  size={20}
                  className="text-blue-500 mt-0.5 flex-shrink-0"
                />
                <div>
                  <p className="font-semibold text-sm text-blue-600">
                    5000+ Consultations
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Successfully managed over five thousand patient cases
                    involving sun-related skin reactions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">
            Our Impact
          </h3>
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
      </div>
    </motion.aside>
  );
}
