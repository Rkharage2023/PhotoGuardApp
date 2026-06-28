import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import SplashScreen from "./components/SplashScreen";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import QuestionnairePage from "./pages/QuestionnairePage";
import ResultPage from "./pages/ResultPage";
import VideosPage from "./pages/VideosPage";
import DrugAllergyPage from "./pages/DrugAllergyPage";
import { authAPI } from "./services/api";
import ChatbotWidget from "./components/ChatbotWidget";

export default function App() {
  const [showSplash, setShowSplash] = useState(
    () => !sessionStorage.getItem("splashSeen"),
  );
  const [page, setPage] = useState("login");
  const [activeTab, setActiveTab] = useState("home");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userRole, setUserRole] = useState("user");
  const [quizAnswers, setQuizAnswers] = useState({
    part1Answers: [],
    part1Images: [],
    part2Answers: [],
    part2Images: [],
  });
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  /* ── Sync Theme with HTML Class list ── */
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  /* ── Restore session on mount ── */
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/health`).catch(() => {});
    const token = localStorage.getItem("token");
    const phone = localStorage.getItem("phone");
    const role = localStorage.getItem("userRole");

    if (token && phone) {
      authAPI
        .getMe()
        .then(({ user }) => {
          setPhoneNumber(phone);
          setUserRole(role || "user");
          setProfileCompleted(user.profileCompleted || false);
          setIsAuth(true);
          setPage("main");
          if (!user.profileCompleted) {
            setActiveTab("profile");
          }
        })
        .catch(() => {
          // Token expired — clear everything
          localStorage.clear();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleSplashDone = () => {
    sessionStorage.setItem("splashSeen", "1");
    setShowSplash(false);
  };

  const handleLogin = async (phone, role) => {
    const data = await authAPI.login(phone, role);
    localStorage.setItem("token", data.token);
    localStorage.setItem("phone", phone);
    localStorage.setItem("userRole", role);
    setPhoneNumber(phone);
    setUserRole(role);
    setProfileCompleted(data.user.profileCompleted || false);
    setIsAuth(true);
    setPage("main");
    if (!data.user.profileCompleted) {
      setActiveTab("profile");
    } else {
      setActiveTab("home");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("phone");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userProfile");
    localStorage.removeItem("profileCompleted");
    setIsAuth(false);
    setPhoneNumber("");
    setUserRole("user");
    setPage("login");
  };

  const handleTabChange = (tab) => {
    if (!profileCompleted && tab !== "profile") {
      alert("Please complete your profile details first to unlock navigation features.");
      setActiveTab("profile");
      return;
    }
    setActiveTab(tab);
    setPage("main");
  };

  /* ── Splash ── */
  if (showSplash) return <SplashScreen onComplete={handleSplashDone} />;

  /* ── Initial loading spinner ── */
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center
                      bg-gradient-to-br from-emerald-600 to-teal-700"
      >
        <div className="text-center">
          <div
            className="w-12 h-12 border-4 border-white/30 border-t-white
                          rounded-full animate-spin mx-auto mb-4"
          />
          <p className="text-white/80 text-sm font-medium">
            Loading PhotoGuard…
          </p>
        </div>
      </div>
    );
  }

  /* ── Auth ── */
  if (!isAuth) return <LoginPage onLogin={handleLogin} />;

  /* ── Full-screen pages (no navbar) ── */
  if (page === "quiz") {
    return (
      <QuestionnairePage
        quizAnswers={quizAnswers}
        setQuizAnswers={setQuizAnswers}
        onComplete={() => setPage("result")}
        onBack={() => {
          setPage("main");
          setActiveTab("home");
        }}
      />
    );
  }

  if (page === "result") {
    return (
      <ResultPage
        quizAnswers={quizAnswers}
        onRetake={() => {
          setQuizAnswers({
            part1Answers: [],
            part1Images: [],
            part2Answers: [],
            part2Images: [],
          });
          setPage("quiz");
        }}
        onHome={() => {
          setPage("main");
          setActiveTab("home");
        }}
      />
    );
  }

  /* ── Main app with navbar ── */
  const renderTab = () => {
    switch (activeTab) {
      case "home":
        return (
          <HomePage
            userRole={userRole}
            phoneNumber={phoneNumber}
            onStartQuiz={() => {
              setQuizAnswers({
                part1Answers: [],
                part1Images: [],
                part2Answers: [],
                part2Images: [],
              });
              setPage("quiz");
            }}
          />
        );
      case "videos":
        return <VideosPage />;
      case "profile":
        return (
          <ProfilePage
            phoneNumber={phoneNumber}
            userRole={userRole}
            onLogout={handleLogout}
            onProfileComplete={() => setProfileCompleted(true)}
          />
        );
      case "drug-allergy":
        return <DrugAllergyPage />;
      default:
        return (
          <HomePage
            userRole={userRole}
            phoneNumber={phoneNumber}
            onStartQuiz={() => {
              setQuizAnswers({
                part1Answers: [],
                part1Images: [],
                part2Answers: [],
                part2Images: [],
              });
              setPage("quiz");
            }}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/50 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900/55 dark:to-emerald-950/20 transition-colors duration-300">
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        phoneNumber={phoneNumber}
        userRole={userRole}
        profileCompleted={profileCompleted}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
      />
      <main className="pt-20">
        <AnimatePresence mode="wait">
          <div key={activeTab}>{renderTab()}</div>
        </AnimatePresence>
      </main>
      <ChatbotWidget />
    </div>
  );
}
