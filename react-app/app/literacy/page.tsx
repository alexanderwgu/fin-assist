import React from 'react';
import AdminLayout from '../../components/Layouts/AdminLayout';

export default function Literacy() {
  const literacyTopics = [
    {
      title: 'Budgeting Basics',
      description: 'Learn how to create and maintain a personal budget',
      icon: 'fas fa-wallet',
      color: 'bg-green-500',
      lessons: ['Understanding Income vs Expenses', '50/30/20 Rule', 'Tracking Daily Spending'],
    },
    {
      title: 'Debt Management',
      description: 'Strategies for managing and reducing debt effectively',
      icon: 'fas fa-credit-card',
      color: 'bg-red-500',
      lessons: ['Types of Debt', 'Debt Snowball vs Avalanche', 'Credit Score Basics'],
    },
    {
      title: 'Saving Strategies',
      description: 'Build healthy saving habits for financial security',
      icon: 'fas fa-piggy-bank',
      color: 'bg-blue-500',
      lessons: ['Emergency Fund', 'High-Yield Savings', 'Automated Saving'],
    },
    {
      title: 'Investment Fundamentals',
      description: 'Introduction to investing and building wealth',
      icon: 'fas fa-chart-line',
      color: 'bg-purple-500',
      lessons: ['Risk vs Return', 'Diversification', 'Long-term Planning'],
    },
    {
      title: 'Financial Planning',
      description: 'Plan for major life goals and retirement',
      icon: 'fas fa-road',
      color: 'bg-orange-500',
      lessons: ['Goal Setting', 'Retirement Planning', 'Insurance Basics'],
    },
    {
      title: 'Consumer Protection',
      description: 'Know your rights and avoid financial scams',
      icon: 'fas fa-shield-alt',
      color: 'bg-indigo-500',
      lessons: ['Consumer Rights', 'Scam Prevention', 'Financial Regulations'],
    },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-wrap">
        <div className="mb-12 w-full px-4">
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <div className="mb-8 text-center">
              <h1 className="mb-4 text-3xl font-bold text-gray-800">Financial Literacy Hub</h1>
              <p className="text-lg text-gray-600">
                Build your financial knowledge with our comprehensive learning modules
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {literacyTopics.map((topic, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-6 transition-shadow hover:shadow-lg"
                >
                  <div className="mb-4 flex items-center">
                    <div
                      className={`h-12 w-12 ${topic.color} mr-4 flex items-center justify-center rounded-lg text-xl text-white`}
                    >
                      <i className={topic.icon}></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{topic.title}</h3>
                    </div>
                  </div>

                  <p className="mb-4 text-gray-600">{topic.description}</p>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">Key Lessons:</h4>
                    <ul className="space-y-1">
                      {topic.lessons.map((lesson, lessonIndex) => (
                        <li key={lessonIndex} className="flex items-center text-sm text-gray-600">
                          <i className="fas fa-check mr-2 text-green-500"></i>
                          {lesson}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                    Start Learning
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-6">
              <h2 className="mb-4 text-xl font-semibold text-blue-800">Learning Progress</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">2/6</div>
                  <div className="text-blue-600">Modules Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">156</div>
                  <div className="text-blue-600">Points Earned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">Bronze</div>
                  <div className="text-blue-600">Current Level</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
