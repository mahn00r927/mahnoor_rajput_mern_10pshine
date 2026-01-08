import { Navigate } from "react-router-dom";
import  type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const token = localStorage.getItem("token");

  // agar login nahi
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // agar login hai
  return <>{children}</>;
};

export default ProtectedRoute;
