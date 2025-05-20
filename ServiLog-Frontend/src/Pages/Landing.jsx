import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="bg-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#D52B1E]/10 to-[#FECB00]/10 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <div className="md:flex md:items-center md:space-x-12">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Keep Your Vehicle in{" "}
                <span className="text-[#D52B1E]">Perfect Condition</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-gray-600">
                ServiLog helps you track maintenance schedules, part
                replacements, and mileage history for your vehicles. Never miss
                an important service again.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/login">
                  <button className="px-6 py-3 bg-[#D52B1E] text-white rounded-lg shadow-lg hover:bg-[#C42218] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D52B1E] focus:ring-opacity-50">
                    Log In
                  </button>
                </Link>
                <Link to="/register">
                  <button className="px-6 py-3 bg-white border-2 border-[#D52B1E] text-[#D52B1E] rounded-lg shadow-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#D52B1E] focus:ring-opacity-50">
                    Create Account
                  </button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-[#D52B1E]/80 to-[#FECB00]/80 opacity-30"></div>
                <img
                  src="/dashboard-preview.jpg"
                  alt="ServiLog Dashboard Preview"
                  className="w-full h-auto rounded-xl"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/600x400/f8f9fa/D52B1E?text=ServiLog+Dashboard";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Why Choose ServiLog?
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Our comprehensive vehicle maintenance tracking system helps you
              stay on top of your vehicle's needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-[#D52B1E]/10 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-[#D52B1E]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Maintenance Tracking
              </h3>
              <p className="text-gray-600">
                Keep track of all service records, maintenance schedules, and
                part replacements in one centralized location.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-[#FECB00]/10 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-[#FECB00]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Timely Reminders
              </h3>
              <p className="text-gray-600">
                Receive notifications when your vehicle needs maintenance based
                on time intervals or mileage thresholds.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-[#D52B1E]/10 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-[#D52B1E]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Mileage History
              </h3>
              <p className="text-gray-600">
                Track your vehicle's mileage over time with visual charts and
                comprehensive data analysis.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              How ServiLog Works
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="absolute top-0 left-0 -ml-4 mt-2 hidden md:block">
                <div className="w-8 h-8 bg-[#D52B1E] text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
              </div>
              <div className="md:pl-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex md:block">
                  <span className="w-8 h-8 bg-[#D52B1E] text-white rounded-full flex items-center justify-center font-bold mr-3 md:hidden">
                    1
                  </span>
                  Add Your Vehicles
                </h3>
                <p className="text-gray-600">
                  Register your vehicles with basic information like make,
                  model, and year. You can add as many vehicles as you own.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="absolute top-0 left-0 -ml-4 mt-2 hidden md:block">
                <div className="w-8 h-8 bg-[#FECB00] text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
              </div>
              <div className="md:pl-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex md:block">
                  <span className="w-8 h-8 bg-[#FECB00] text-white rounded-full flex items-center justify-center font-bold mr-3 md:hidden">
                    2
                  </span>
                  Track Parts & Mileage
                </h3>
                <p className="text-gray-600">
                  Add vehicle parts with their installation dates and expected
                  lifespans. Log your mileage regularly to keep data accurate.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="absolute top-0 left-0 -ml-4 mt-2 hidden md:block">
                <div className="w-8 h-8 bg-[#D52B1E] text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
              </div>
              <div className="md:pl-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex md:block">
                  <span className="w-8 h-8 bg-[#D52B1E] text-white rounded-full flex items-center justify-center font-bold mr-3 md:hidden">
                    3
                  </span>
                  Get Maintenance Alerts
                </h3>
                <p className="text-gray-600">
                  Receive timely notifications when your vehicle needs
                  attention, based on time and mileage thresholds you set.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-[#D52B1E] to-[#FECB00]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Keep Your Vehicle in Top Condition?
          </h2>
          <p className="text-white text-lg mb-10 max-w-3xl mx-auto">
            Join thousands of vehicle owners who trust ServiLog to maintain
            their cars, motorcycles, and other vehicles.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <button className="px-8 py-4 bg-white text-[#D52B1E] font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
                Create Free Account
              </button>
            </Link>
            <Link to="/login">
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg shadow-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
                Login
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Get Started with ServiLog Today
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join our community of vehicle owners and enjoy peace of mind knowing
            your maintenance is on track.
          </p>
          <Link to="/register">
            <button className="px-8 py-4 bg-[#D52B1E] text-white font-semibold rounded-lg shadow-lg hover:bg-[#C42218] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D52B1E] focus:ring-opacity-50">
              Create Your Free Account
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
