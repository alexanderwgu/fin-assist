import React from "react";
import AdminLayout from "../../components/Layouts/AdminLayout";
import VoiceInterface from "../../components/VoiceInterface/VoiceInterface";
import CardStats from "../../components/Cards/CardStats";

export default function Dashboard() {
  return (
    <AdminLayout>
      <div className="flex flex-wrap">
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                  <h3 className="font-semibold text-lg text-blueGray-700">
                    Voice Assistant
                  </h3>
                </div>
              </div>
            </div>
            <div className="flex-auto px-4 py-6">
              <VoiceInterface />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
