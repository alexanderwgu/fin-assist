"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Voice Assistant", icon: "fas fa-microphone", color: "#29F280" },
    { href: "/literacy", label: "Financial Literacy", icon: "fas fa-book-open", color: "#5FF9A5" },
    { href: "/crisis-support", label: "Crisis Support", icon: "fas fa-life-ring", color: "#592EF2" },
  ];

  return (
    <nav className="fixed md:left-0 md:block md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden bg-[#141926] flex flex-wrap items-center justify-between relative md:w-72 z-10 py-6 px-6 shadow-2xl">
      <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
        {/* Header & Logo */}
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#29F280] flex items-center justify-center shadow-lg shadow-[#29F280]/50">
              <span className="text-[#141926] text-lg font-extrabold">𝒞</span>
            </div>
            <div>
              <h2 className="text-white font-extrabold text-lg">CalmCall</h2>
              <p className="text-xs text-[#BFCAD9]">Financial Assistant</p>
            </div>
          </Link>
        </div>

        {/* Mobile Toggler */}
        <button
          className="cursor-pointer text-white opacity-70 hover:opacity-100 md:hidden px-3 py-1 text-xl transition-opacity"
          type="button"
          onClick={() => setCollapseShow("bg-[#1a1f37] m-2 py-3 px-6 rounded-lg mt-4")}
        >
          <i className="fas fa-bars"></i>
        </button>

        {/* Navigation */}
        <div
          className={`md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded-lg md:rounded-none ${collapseShow}`}
        >
          {/* Collapse header (Mobile) */}
          <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-gray-700">
            <div className="flex justify-between items-center px-4">
              <Link href="/" className="text-white font-bold">CalmCall</Link>
              <button
                type="button"
                className="text-white opacity-70 hover:opacity-100 transition-opacity"
                onClick={() => setCollapseShow("hidden")}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          {/* Navigation Section - Financial Tools */}
          <div className="w-full md:min-w-full">
            <h6 className="text-gray-500 text-xs uppercase font-bold block pt-3 pb-2 px-4 mb-2">
              Financial Tools
            </h6>
            <ul className="flex flex-col list-none">
              {navItems.map((item) => (
                <li key={item.href} className="items-center">
                  <Link
                    href={item.href}
                    className={`text-xs uppercase py-3 px-4 font-semibold block transition-all hover:bg-[#1a1f2e] rounded-lg mx-2 mb-1 flex items-center gap-3 ${
                      pathname === item.href ||
                      (item.href !== "/" && pathname.startsWith(item.href))
                        ? "bg-[#29F280] text-[#141926] border-l-4 border-[#592EF2] shadow-lg shadow-[#29F280]/30"
                        : "text-[#BFCAD9] hover:text-white hover:bg-[#1a1f2e]"
                    }`}
                  >
                    <i className={`${item.icon} w-5`} style={{ color: item.color }}></i>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-[#1a1f2e] my-6 mx-4"></div>

          {/* Help Section */}
          <div className="w-full px-4 py-4 bg-[#1a1f2e] rounded-lg mx-2 mb-4 border border-[#29F280]/30">
            <div className="flex items-center gap-3 mb-2">
              <i className="fas fa-headset text-[#592EF2]"></i>
              <span className="text-xs font-semibold text-white">Need Help?</span>
            </div>
            <p className="text-xs text-[#BFCAD9] mb-3">Contact our support team for assistance</p>
            <button className="w-full bg-[#29F280] text-[#141926] text-xs font-bold py-2 px-3 rounded-lg hover:bg-[#5FF9A5] hover:shadow-lg hover:shadow-[#29F280]/50 transition-all">
              Get Support
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
