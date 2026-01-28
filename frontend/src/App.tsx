import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./PublicView/Navbar";
import { HeroSection } from "./PublicView/HeroSection";
import { FeaturesSection } from "./PublicView/FeatureSection";
import { CTASection } from "./PublicView/CTA";
import { Footer } from "./PublicView/Footer";
import { Login } from "./PublicView/LogIn";
import { Signup } from "./PublicView/SignUp";
import { ForgotPassword } from "./PublicView/ForgotPassword";
import { ResetPassword } from "./PublicView/ResetPassword";
import Dashboard from "./UserDashboard/Dashboard";
import Editor from "./UserDashboard/Editor";
import ProtectedRoute from "./ProtectedRoute";
import AccountPage from "./UserDashboard/Account";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    
    // If theme is "dark", add dark class
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } 
    // If theme is "light" or null, remove dark class (default to light)
    else {
      document.documentElement.classList.remove("dark");
      // Set default theme as light if not set
      if (!theme) {
        localStorage.setItem("theme", "dark");
      }
    }
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");

    localStorage.setItem(
      "theme",
      html.classList.contains("dark") ? "dark" : "light"
    );
  };

  return (
    <Router>
      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={
            <div className="app-container">
              <Navbar toggleTheme={toggleTheme} />
              <HeroSection />
              <FeaturesSection />
              <CTASection />
              <Footer />
            </div>
          }
        />

        {/* Login */}
        <Route
          path="/login"
          element={
            <div className="app-container">
              <Login />
            </div>
          }
        />

        {/* Signup */}
        <Route
          path="/signup"
          element={
            <div className="app-container">
              <Signup />
            </div>
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <div className="app-container">
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </div>
          }
        />
        {/* Forgot Password */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/editor"
          element={
            <div className="app-container">
              <ProtectedRoute>
                <Editor />
              </ProtectedRoute>
            </div>
          }
        />
        <Route
          path="/account"
          element={
            <div className="app-container">
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;