"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, TrendingUp, Layers, Globe, Settings, User, Menu } from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
    { name: "Metrics", href: "/metrics", icon: TrendingUp },
    { name: "Batch Coding", href: "/batch", icon: Layers },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-surface/90 backdrop-blur-md border-b border-border z-50 flex items-center justify-between px-4 sm:px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="p-2 text-text-muted hover:text-text transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-[12px] bg-signature-gradient flex items-center justify-center shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="7 10 12 15 17 10" />
              <polyline points="7 6 12 11 17 6" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-text leading-tight group-hover:text-primary transition-colors">SkillWeave</span>
            <span className="text-[0.72rem] text-text-muted font-medium tracking-wide uppercase">AI Occupation Intelligence</span>
          </div>
        </Link>
      </div>

      {/* Center Status Pill */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-pill border border-border bg-surface shadow-sm">
        <div className="w-2 h-2 rounded-full bg-success"></div>
        <span className="text-xs font-mono font-medium text-text-secondary tracking-wide">NCO 2015</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1 sm:gap-2">
        <nav className="hidden lg:flex items-center gap-1 mr-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-btn text-sm font-medium transition-colors ${
                  isActive 
                    ? "text-primary bg-primary-soft/10" 
                    : "text-text-secondary hover:text-text hover:bg-bg-subtle"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block w-px h-6 bg-border mx-2"></div>

        <Link href="/settings#language" className="p-2 text-text-secondary hover:text-primary hover:bg-bg-subtle rounded-btn transition-colors" aria-label="Language/Region">
          <Globe className="w-5 h-5" />
        </Link>
        <Link href="/settings" className="p-2 text-text-secondary hover:text-primary hover:bg-bg-subtle rounded-btn transition-colors" aria-label="Settings">
          <Settings className="w-5 h-5" />
        </Link>
        <button className="ml-1 flex items-center gap-2 px-3 py-1.5 bg-bg-subtle border border-border hover:border-primary-soft/50 rounded-pill transition-colors text-sm font-medium text-text-secondary hover:text-text">
          <User className="w-4 h-4 text-text-muted" />
          <span className="hidden sm:inline">Admin</span>
        </button>
      </div>
    </header>
  );
}
