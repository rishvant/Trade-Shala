import { Navigate } from "react-router-dom";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isLoggedIn = localStorage.getItem("token") ? true : false;

  if (!isLoggedIn) {
    toast.error("Please login to access this page.");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
