// src/components/Layout/Layout.jsx
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function AuthLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Page content */}
      <main className="flex-1 overflow-y-auto p-0">
        <Outlet />
      </main>
    </div>
  );
}
