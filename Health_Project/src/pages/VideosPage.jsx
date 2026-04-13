import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play } from "lucide-react";

const VIDEOS = [
  {
    id: 1,
    title: "Daily Skin Care Routine",
    desc: "Best practices for maintaining healthy skin",
    duration: "5:30",
    playable: true,
    localSrc: true,
  },
  {
    id: 2,
    title: "Healthy Diet for Skin",
    desc: "Nutrition tips for glowing, healthy skin",
    duration: "7:15",
    playable: true,
    localSrc: true,
  },
  {
    id: 3,
    title: "Success Stories",
    desc: "Real people, real results with our program",
    duration: "10:20",
    playable: false,
  },
  {
    id: 4,
    title: "Understanding Skin Health",
    desc: "Learn about common skin issues and solutions",
    duration: "6:45",
    playable: false,
  },
  {
    id: 5,
    title: "Nutrition for Skin",
    desc: "Foods that promote healthy skin",
    duration: "8:30",
    playable: false,
  },
  {
    id: 6,
    title: "Expert Tips & Advice",
    desc: "Professional insights from our doctors",
    duration: "9:10",
    playable: false,
  },
];

export default function VideosPage() {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
              Educational Videos
            </h1>
            <p className="text-gray-500">
              Learn everything about skin care and photosensitivity treatment
            </p>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VIDEOS.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => video.playable && setActiveVideo(video)}
                className={`bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all ${
                  video.playable
                    ? "cursor-pointer hover:-translate-y-1 hover:shadow-lg"
                    : "opacity-70"
                }`}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
                  {video.playable ? (
                    <div className="w-14 h-14 rounded-full bg-white/25 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center">
                      <Play
                        size={24}
                        className="text-white ml-1"
                        fill="white"
                      />
                    </div>
                  ) : (
                    <div className="text-center px-4">
                      <span className="text-white/60 text-sm font-medium">
                        Coming Soon
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 text-white text-xs rounded-md font-medium">
                    {video.duration}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 text-sm mb-1">
                    {video.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {video.desc}
                  </p>
                  {!video.playable && (
                    <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-md">
                      Coming Soon
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl overflow-hidden w-full max-w-2xl shadow-2xl"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-800">{activeVideo.title}</h3>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="aspect-video bg-black">
                {activeVideo.localSrc ? (
                  <video controls autoPlay className="w-full h-full">
                    <source
                      src={`/assets/video${activeVideo.id}.mp4`}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/50 text-sm">
                    Video not available
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
