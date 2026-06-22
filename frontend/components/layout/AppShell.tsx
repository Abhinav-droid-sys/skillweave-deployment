"use client";

import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Open sidebar by default on desktop
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setSidebarOpen(true);
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-bg overflow-x-hidden text-text-secondary">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.12]" style={{
          background: "radial-gradient(circle at 50% -20%, var(--primary-soft) 0%, transparent 60%)"
        }}></div>
      </div>

      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex pt-16 min-h-screen relative z-10">
        {/* Main content — shift right when sidebar is open on desktop */}
        <main
          className="flex-1 overflow-y-auto transition-all duration-300 ease-in-out"
          style={{ marginLeft: sidebarOpen ? "280px" : "0" }}
        >
          <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-full flex flex-col">
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
