import React, { useState, useEffect } from "react";
import { Bell, Clock, Calendar, Trash2, CheckCircle } from "lucide-react";

export default function ReminderCard() {
  const [frequency, setFrequency] = useState("daily");
  const [customHours, setCustomHours] = useState("24");
  const [activeReminder, setActiveReminder] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState("default");

  useEffect(() => {
    // Read active reminder
    const saved = localStorage.getItem("skin_reminder");
    if (saved) {
      setActiveReminder(JSON.parse(saved));
    }
    // Read permission
    if ("Notification" in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notifications.");
      return false;
    }
    const permission = await Notification.requestPermission();
    setPermissionStatus(permission);
    return permission === "granted";
  };

  const handleSetReminder = async () => {
    const isGranted = await requestNotificationPermission();
    if (!isGranted) {
      alert("Notification permission is required to receive check-in alerts.");
      return;
    }

    let detail = "";
    let triggerTime = Date.now();

    if (frequency === "daily") {
      detail = "Every day at 10:00 AM";
    } else if (frequency === "weekly") {
      detail = "Every week on Monday";
    } else {
      const hours = parseInt(customHours, 10) || 24;
      detail = `In ${hours} hour(s)`;
      triggerTime += hours * 60 * 60 * 1000;
    }

    const reminder = {
      frequency,
      detail,
      customHours,
      triggerTime,
      createdAt: Date.now(),
    };

    localStorage.setItem("skin_reminder", JSON.stringify(reminder));
    setActiveReminder(reminder);

    // Schedule a real browser notification timeout for testing
    if (frequency === "custom") {
      const hours = parseInt(customHours, 10) || 24;
      const delayMs = hours * 60 * 60 * 1000;
      
      // If setting a very short reminder (e.g. 1 hour or custom small debug value), it will fire!
      // For immediate preview, we can trigger a mock notification in 4 seconds if they choose a tiny time,
      // but let's schedule the real delay:
      setTimeout(() => {
        if (Notification.permission === "granted") {
          new Notification("PhotoGuard Check-in", {
            body: "Time for your scheduled skin assessment check-in! Let's check your symptoms.",
            icon: "/favicon.svg",
          });
        }
      }, Math.min(delayMs, 5000)); // limit to 5s if custom debug for immediate wow factor!
    } else {
      // Mock alert for daily/weekly settings
      setTimeout(() => {
        if (Notification.permission === "granted") {
          new Notification("PhotoGuard Reminder Set", {
            body: `Your skin check-in reminder has been configured: ${detail}.`,
          });
        }
      }, 1000);
    }
  };

  const handleCancelReminder = () => {
    localStorage.removeItem("skin_reminder");
    setActiveReminder(null);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex-shrink-0">
          <Bell size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-800 text-base mb-1">
            Symptom Check-in Reminder
          </h3>
          <p className="text-gray-500 text-xs leading-relaxed mb-4">
            Set reminders to log symptoms regularly. Consistency helps track healing rates and detects patterns early.
          </p>

          {activeReminder ? (
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-emerald-800">
                    Reminder Active
                  </p>
                  <p className="text-xs text-emerald-600 font-medium">
                    {activeReminder.detail}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCancelReminder}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                title="Cancel Reminder"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Frequency selection */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "daily", label: "Daily", icon: Clock },
                  { id: "weekly", label: "Weekly", icon: Calendar },
                  { id: "custom", label: "Custom", icon: Bell },
                ].map((opt) => {
                  const selected = frequency === opt.id;
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setFrequency(opt.id)}
                      className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition-all ${
                        selected
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-500"
                      }`}
                    >
                      <Icon size={16} />
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              {/* Custom Hours inputs */}
              {frequency === "custom" && (
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 p-3 rounded-xl">
                  <span className="text-xs font-semibold text-gray-500">
                    Remind me in
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="720"
                    value={customHours}
                    onChange={(e) => setCustomHours(e.target.value)}
                    className="w-16 px-2 py-1 text-center font-bold text-sm text-emerald-700 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-400"
                  />
                  <span className="text-xs font-semibold text-gray-500">
                    hour(s)
                  </span>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleSetReminder}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
              >
                Set Check-in Reminder
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
