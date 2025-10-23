import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Signup from "../features/auth/pages/Signup";
import Home from "../pages/Home";
import PrivateRoute from "../components/PrivateRoute";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
