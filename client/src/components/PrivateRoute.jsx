import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

function PrivateRoute({ children }) {
  const { auth } = useAuth();
  return auth?.token ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
