import React from 'react';
import AdminLayout from '../../components/Layouts/AdminLayout';
import VoiceInterface from '../../components/VoiceInterface/VoiceInterface';

export default function Dashboard() {
  return (
    <AdminLayout>
      <div className="flex flex-wrap">
        <div className="mb-12 w-full px-4 xl:mb-0 xl:w-8/12">
          <div className="relative mb-6 flex w-full min-w-0 flex-col rounded bg-white break-words shadow-lg">
            <div className="mb-0 rounded-t border-0 px-4 py-3">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full max-w-full flex-1 flex-grow px-4">
                  <h3 className="text-blueGray-700 text-lg font-semibold">Voice Assistant</h3>
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
