import React from 'react';
import Image from 'next/image';

export default function Navbar() {
  return (
    <>
      <nav className="absolute top-0 left-0 z-10 flex w-full items-center bg-transparent p-4 md:flex-row md:flex-nowrap md:justify-start">
        <div className="mx-auto flex w-full flex-wrap items-center justify-between px-4 md:flex-nowrap md:px-10">
          {/* Brand */}
          <div className="hidden text-sm font-semibold text-white uppercase lg:inline-block">
            CalmCall Dashboard
          </div>
          {/* Form */}
          <form className="mr-3 hidden w-60 flex-row flex-wrap items-center md:flex lg:ml-auto">
            <div className="relative flex w-full flex-wrap items-stretch">
              <span className="absolute z-10 h-full w-8 items-center justify-center rounded bg-transparent py-3 pl-3 text-center text-base leading-snug font-normal text-gray-400">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                placeholder="Search here..."
                className="relative w-full rounded border border-gray-200 bg-white px-3 py-3 pl-10 text-sm text-gray-800 placeholder-gray-400 shadow-sm transition-all duration-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </form>
          {/* User */}
          <ul className="hidden list-none flex-col items-center md:flex md:flex-row">
            <div className="flex items-center">
              <span className="bg-blueGray-200 inline-flex h-12 w-12 items-center justify-center rounded-full text-sm text-white">
                <Image
                  alt="User avatar"
                  className="w-full rounded-full border-none align-middle shadow-lg"
                  src="/img/team-1-800x800.jpg"
                  width={48}
                  height={48}
                />
              </span>
            </div>
          </ul>
        </div>
      </nav>
    </>
  );
}
