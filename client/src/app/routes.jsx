// src//app/routes.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "@/components/Login";
import Signup from "@/components/Signup";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthLayout } from "@/components/Layout/Layout";

// Page Components (create these or use placeholders)
import Dashboard from "@/components/Dashboard";
import UploadNotes from "@/components/Notes/UploadNotes";
import Chat from "@/pages/Chat";
/* import Notes from "./pages/Notes";
import Attendance from "./pages/Attendance";
import Profile from "./pages/Profile";
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes with Sidebar */}
        <Route
          element={
            <ProtectedRoute>
              <AuthLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          {/* <Route path="/notes" element={<Notes />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/profile" element={<Profile />} /> */}

          <Route path="/notes" element={<UploadNotes />} />
          <Route path="/" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;