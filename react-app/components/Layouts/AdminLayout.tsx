'use client';

import React from 'react';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#f8f9fa]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="relative ml-8 flex w-full flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Header Section - Adobe Color Palette - Full Width */}
        <div className="relative w-full overflow-hidden bg-gradient-to-r from-[#29F280] to-[#5FF9A5] pt-32 pb-24 md:pt-40 md:pb-32">
          {/* Decorative background elements with purple accents */}
          <div className="absolute top-0 right-0 -mt-48 -mr-48 h-96 w-96 rounded-full bg-[#592EF2]/20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-36 -ml-36 h-72 w-72 rounded-full bg-[#141926]/30 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-white/10 blur-3xl"></div>

          {/* Header Content */}
          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-10">
            <div className="flex flex-col items-start justify-between">
              <div className="w-full">
                <h1 className="mb-4 text-4xl leading-tight font-extrabold tracking-tighter text-[#141926] md:text-6xl">
                  Welcome to CalmCall
                </h1>
                <p className="max-w-3xl text-lg leading-relaxed font-semibold text-[#141926]/90 md:text-xl">
                  Your compassionate AI-powered financial assistant. Get support, learn, and grow
                  financially with confidence.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="mx-auto -mt-16 w-full flex-1 px-4 pb-12 md:px-10">
          <div className="relative z-10">{children}</div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white px-4 py-8 md:px-10">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-600">
                © 2024 CalmCall Financial Assistant. All rights reserved.
              </p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-gray-500 transition-colors hover:text-gray-700">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-500 transition-colors hover:text-gray-700">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-500 transition-colors hover:text-gray-700">
                Contact Support
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
