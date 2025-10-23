import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

function PrivateRoute({ children }) {
  const { auth } = useAuth();
  return auth ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
