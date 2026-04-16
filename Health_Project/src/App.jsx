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

export default function App() {
  const [showSplash, setShowSplash] = useState(
    () => !sessionStorage.getItem("splashSeen"),
  );
  const [page, setPage] = useState("login");
  const [activeTab, setActiveTab] = useState("home");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userRole, setUserRole] = useState("user");
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ── Restore session on mount ── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const phone = localStorage.getItem("phone");
    const role = localStorage.getItem("userRole");

    if (token && phone) {
      authAPI
        .getMe()
        .then(() => {
          setPhoneNumber(phone);
          setUserRole(role || "user");
          setIsAuth(true);
          setPage("main");
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
    setIsAuth(true);
    setPage("main");
    setActiveTab("home");
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
                      bg-gradient-to-br from-violet-600 to-purple-700"
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
          setQuizAnswers([]);
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
              setQuizAnswers([]);
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
              setQuizAnswers([]);
              setPage("quiz");
            }}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50">
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        phoneNumber={phoneNumber}
        userRole={userRole}
      />
      <main className="pt-20">
        <AnimatePresence mode="wait">
          <div key={activeTab}>{renderTab()}</div>
        </AnimatePresence>
      </main>
    </div>
  );
}
