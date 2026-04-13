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

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [page, setPage] = useState("login");
  const [activeTab, setActiveTab] = useState("home");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userRole, setUserRole] = useState("user");
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedPhone = localStorage.getItem("phone");
    const savedRole = localStorage.getItem("userRole");
    if (savedPhone) {
      setPhoneNumber(savedPhone);
      setUserRole(savedRole || "user");
      setIsAuthenticated(true);
      setPage("main");
    }
  }, []);

  const handleLogin = (phone, role) => {
    localStorage.setItem("phone", phone);
    localStorage.setItem("userRole", role);
    setPhoneNumber(phone);
    setUserRole(role);
    setIsAuthenticated(true);
    setPage("main");
    setActiveTab("home");
  };

  const handleLogout = () => {
    localStorage.removeItem("phone");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userProfile");
    localStorage.removeItem("profileCompleted");
    setIsAuthenticated(false);
    setPhoneNumber("");
    setUserRole("user");
    setPage("login");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage("main");
  };

  const navigateTo = (target) => {
    if (target === "quiz") {
      setPage("quiz");
      return;
    }
    if (target === "result") {
      setPage("result");
      return;
    }
    if (target === "home") {
      setPage("main");
      setActiveTab("home");
      return;
    }
    setPage("main");
    setActiveTab(target);
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

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

  const renderPage = () => {
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
        <AnimatePresence mode="wait">{renderPage()}</AnimatePresence>
      </main>
    </div>
  );
}
