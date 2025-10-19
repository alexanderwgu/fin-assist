'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const [collapseShow, setCollapseShow] = React.useState('hidden');
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Voice Assistant', icon: 'fas fa-microphone', color: '#29F280' },
    { href: '/literacy', label: 'Financial Literacy', icon: 'fas fa-book-open', color: '#5FF9A5' },
    {
      href: '/crisis-support',
      label: 'Crisis Support',
      icon: 'fas fa-life-ring',
      color: '#592EF2',
    },
  ];

  return (
    <nav className="fixed relative z-10 flex flex-wrap items-center justify-between bg-[#141926] px-6 py-6 shadow-2xl md:top-0 md:bottom-0 md:left-0 md:block md:w-72 md:flex-row md:flex-nowrap md:overflow-hidden md:overflow-y-auto">
      <div className="mx-auto flex w-full flex-wrap items-center justify-between px-0 md:min-h-full md:flex-col md:flex-nowrap md:items-stretch">
        {/* Header & Logo */}
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#29F280] shadow-lg shadow-[#29F280]/50">
              <span className="text-lg font-extrabold text-[#141926]">𝒞</span>
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">CalmCall</h2>
              <p className="text-xs text-[#BFCAD9]">Financial Assistant</p>
            </div>
          </Link>
        </div>

        {/* Mobile Toggler */}
        <button
          className="cursor-pointer px-3 py-1 text-xl text-white opacity-70 transition-opacity hover:opacity-100 md:hidden"
          type="button"
          onClick={() => setCollapseShow('bg-[#1a1f37] m-2 py-3 px-6 rounded-lg mt-4')}
        >
          <i className="fas fa-bars"></i>
        </button>

        {/* Navigation */}
        <div
          className={`absolute top-0 right-0 left-0 z-40 h-auto flex-1 items-center overflow-x-hidden overflow-y-auto rounded-lg shadow md:relative md:mt-4 md:flex md:flex-col md:items-stretch md:rounded-none md:opacity-100 md:shadow-none ${collapseShow}`}
        >
          {/* Collapse header (Mobile) */}
          <div className="mb-4 block border-b border-gray-700 pb-4 md:hidden md:min-w-full">
            <div className="flex items-center justify-between px-4">
              <Link href="/" className="font-bold text-white">
                CalmCall
              </Link>
              <button
                type="button"
                className="text-white opacity-70 transition-opacity hover:opacity-100"
                onClick={() => setCollapseShow('hidden')}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          {/* Navigation Section - Financial Tools */}
          <div className="w-full md:min-w-full">
            <h6 className="mb-2 block px-4 pt-3 pb-2 text-xs font-bold text-gray-500 uppercase">
              Financial Tools
            </h6>
            <ul className="flex list-none flex-col">
              {navItems.map((item) => (
                <li key={item.href} className="items-center">
                  <Link
                    href={item.href}
                    className={`mx-2 mb-1 block flex items-center gap-3 rounded-lg px-4 py-3 text-xs font-semibold uppercase transition-all hover:bg-[#1a1f2e] ${
                      pathname === item.href ||
                      (item.href !== '/' && pathname.startsWith(item.href))
                        ? 'border-l-4 border-[#592EF2] bg-[#29F280] text-[#141926] shadow-lg shadow-[#29F280]/30'
                        : 'text-[#BFCAD9] hover:bg-[#1a1f2e] hover:text-white'
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
          <div className="mx-4 my-6 h-px w-full bg-[#1a1f2e]"></div>

          {/* Help Section */}
          <div className="mx-2 mb-4 w-full rounded-lg border border-[#29F280]/30 bg-[#1a1f2e] px-4 py-4">
            <div className="mb-2 flex items-center gap-3">
              <i className="fas fa-headset text-[#592EF2]"></i>
              <span className="text-xs font-semibold text-white">Need Help?</span>
            </div>
            <p className="mb-3 text-xs text-[#BFCAD9]">Contact our support team for assistance</p>
            <button className="w-full rounded-lg bg-[#29F280] px-3 py-2 text-xs font-bold text-[#141926] transition-all hover:bg-[#5FF9A5] hover:shadow-lg hover:shadow-[#29F280]/50">
              Get Support
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
