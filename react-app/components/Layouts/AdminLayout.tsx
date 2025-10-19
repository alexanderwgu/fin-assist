"use client";

import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#f8f9fa]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="relative ml-8 w-full flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Header Section - Adobe Color Palette - Full Width */}
        <div className="relative bg-gradient-to-r from-[#29F280] to-[#5FF9A5] pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden w-full">
          {/* Decorative background elements with purple accents */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#592EF2]/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#141926]/30 rounded-full blur-3xl -ml-36 -mb-36"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/10 rounded-full blur-3xl"></div>

          {/* Header Content */}
          <div className="relative z-10 px-4 md:px-10 mx-auto w-full max-w-7xl">
            <div className="flex flex-col items-start justify-between">
              <div className="w-full">
                <h1 className="text-[#141926] text-4xl md:text-6xl font-extrabold mb-4 leading-tight tracking-tighter">
                  Welcome to CalmCall
                </h1>
                <p className="text-[#141926]/90 text-lg md:text-xl font-semibold max-w-3xl leading-relaxed">
                  Your compassionate AI-powered financial assistant. Get support, learn, and grow financially with confidence.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 px-4 md:px-10 mx-auto w-full -mt-16 pb-12">
          <div className="relative z-10">
            {children}
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white py-8 px-4 md:px-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-600 text-sm">
                © 2024 CalmCall Financial Assistant. All rights reserved.
              </p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm transition-colors">
                Contact Support
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
