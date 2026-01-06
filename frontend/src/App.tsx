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
function App() {
  return (
    <Router>
      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={
            <div className="app-container">
              <Navbar />
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
              <Dashboard/>
            </div>
          }
        />
        {/* Forgot Password */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
