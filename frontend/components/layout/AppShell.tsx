"use client";

import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-bg overflow-x-hidden text-text-secondary">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex pt-16 min-h-screen relative z-10">
        {/* Main content */}
        <main
          className="flex-1 overflow-y-auto transition-all duration-300 ease-in-out"
        >
          <div className="flex flex-col min-h-[calc(100vh-64px)]">
            <div className="flex-1 max-w-[1120px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
