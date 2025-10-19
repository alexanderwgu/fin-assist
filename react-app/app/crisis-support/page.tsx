import React from "react";
import AdminLayout from "../../components/Layouts/AdminLayout";

export default function CrisisSupport() {
  const crisisResources = [
    {
      title: "National Suicide Prevention Lifeline",
      phone: "988",
      description: "24/7 confidential support for people in distress",
      category: "Crisis",
      color: "bg-red-100 border-red-300"
    },
    {
      title: "National Domestic Violence Hotline",
      phone: "1-800-799-7233",
      description: "Support for domestic violence victims",
      category: "Safety",
      color: "bg-purple-100 border-purple-300"
    },
    {
      title: "Substance Abuse and Mental Health Services",
      phone: "1-800-662-4357",
      description: "Treatment referral and information service",
      category: "Addiction",
      color: "bg-blue-100 border-blue-300"
    },
    {
      title: "Financial Counseling Services",
      phone: "1-800-388-2227",
      description: "Free financial counseling and debt management",
      category: "Financial",
      color: "bg-green-100 border-green-300"
    },
    {
      title: "Veterans Crisis Line",
      phone: "988 (Press 1)",
      description: "Confidential support for veterans in crisis",
      category: "Veterans",
      color: "bg-yellow-100 border-yellow-300"
    },
    {
      title: "Trans Lifeline",
      phone: "877-565-8860",
      description: "Peer support for transgender people",
      category: "LGBTQ+",
      color: "bg-pink-100 border-pink-300"
    }
  ];

  const groundingExercises = [
    {
      title: "5-4-3-2-1 Technique",
      description: "Use your senses to ground yourself in the present moment",
      steps: [
        "Name 5 things you can see",
        "Name 4 things you can feel",
        "Name 3 things you can hear",
        "Name 2 things you can smell",
        "Name 1 thing you can taste"
      ]
    },
    {
      title: "Deep Breathing",
      description: "Practice slow, controlled breathing to calm your nervous system",
      steps: [
        "Breathe in slowly for 4 counts",
        "Hold for 4 counts",
        "Breathe out slowly for 4 counts",
        "Hold for 4 counts",
        "Repeat 4 times"
      ]
    },
    {
      title: "Progressive Muscle Relaxation",
      description: "Systematically tense and release muscle groups",
      steps: [
        "Start with your toes, tense for 5 seconds",
        "Release and notice the difference",
        "Move up to calves, thighs, abdomen",
        "Continue to chest, arms, neck, face",
        "End with your entire body relaxed"
      ]
    }
  ];

  return (
    <AdminLayout>
      <div className="flex flex-wrap">
        <div className="w-full mb-12 px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Crisis Support Center
              </h1>
              <p className="text-gray-600 text-lg">
                You're not alone. Here are resources and techniques to help you through difficult times.
              </p>
            </div>

            {/* Crisis Resources */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Emergency Resources
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {crisisResources.map((resource, index) => (
                  <div key={index} className={`${resource.color} rounded-lg p-6 border-2`}>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                        <i className="fas fa-phone text-2xl text-gray-600"></i>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {resource.title}
                        </h3>
                        <div className="text-sm text-gray-600 uppercase font-medium">
                          {resource.category}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">
                      {resource.description}
                    </p>

                    <div className="text-center">
                      <a
                        href={`tel:${resource.phone}`}
                        className="inline-flex items-center justify-center w-full bg-white hover:bg-gray-50 text-gray-800 font-bold py-3 px-6 rounded-lg border-2 border-gray-300 transition-colors"
                      >
                        <i className="fas fa-phone mr-2"></i>
                        {resource.phone}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grounding Exercises */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Grounding Techniques
              </h2>
              <p className="text-gray-600 mb-6">
                When you're feeling overwhelmed, these techniques can help bring you back to the present moment.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {groundingExercises.map((exercise, index) => (
                  <div key={index} className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">
                      {exercise.title}
                    </h3>
                    <p className="text-blue-700 mb-4">
                      {exercise.description}
                    </p>

                    <div className="space-y-2">
                      <h4 className="font-medium text-blue-800">Steps:</h4>
                      <ol className="space-y-1">
                        {exercise.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="text-sm text-blue-700 flex items-start">
                            <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">
                              {stepIndex + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Self-Care Tips */}
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h2 className="text-xl font-semibold text-green-800 mb-4">
                Daily Self-Care Reminder
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-green-800 mb-2">Physical Health</h3>
                  <ul className="space-y-1 text-green-700">
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-600 mr-2"></i>
                      Drink plenty of water
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-600 mr-2"></i>
                      Get enough sleep (7-9 hours)
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-600 mr-2"></i>
                      Eat nutritious meals
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-600 mr-2"></i>
                      Take short walks outside
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-green-800 mb-2">Mental Health</h3>
                  <ul className="space-y-1 text-green-700">
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-600 mr-2"></i>
                      Practice deep breathing
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-600 mr-2"></i>
                      Connect with loved ones
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-600 mr-2"></i>
                      Engage in hobbies you enjoy
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-600 mr-2"></i>
                      Set small, achievable goals
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
