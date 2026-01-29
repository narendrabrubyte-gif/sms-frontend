"use client";

export default function DashboardHome() {
  return (
    <div>
      <h1 className="text-black text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-gray-500 text-sm font-medium">Total Students</h2>
          <p className="text-3xl font-bold text-gray-800 mt-2">1,250</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-gray-500 text-sm font-medium">Total Courses</h2>
          <p className="text-3xl font-bold text-gray-800 mt-2">45</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h2 className="text-gray-500 text-sm font-medium">
            Active Enrollments
          </h2>
          <p className="text-3xl font-bold text-gray-800 mt-2">850</p>
        </div>
      </div>

      <div className="mt-8 p-6 bg-white rounded-lg shadow">
        <h3 className="text-black text-xl font-semibold mb-4">Welcome Back!</h3>
        <p className="text-gray-600">
          Select a module from the sidebar to start managing your institute.
        </p>
      </div>
    </div>
  );
}
