import React from 'react'
import AdminNavbar from './AdminNavbar'
import StatCard from '../components/StatsCard'
import StudentsTable from '../components/StudentTable'
import AttendanceCalendar from '../../components/AttendanceCalendar'
import { use11thStudents } from '../classData/11th_real'
import { use12thStudents } from '../classData/12th_real'

const AdminDashboard = () => {
  const { students: students11th, loading: loading11th, error: error11th } = use11thStudents();
  const { students: students12th, loading: loading12th, error: error12th } = use12thStudents();
  const totalStudents = students11th.length + students12th.length;
  const loading = loading11th || loading12th;
  const error = error11th || error12th;

  // Handle loading state
  if (loading) {
    return (
      <>
        <AdminNavbar/>
        <div className="items-center mx-auto flex justify-center mt-4 mb-4 font-semibold text-2xl">Admin Portal</div>
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#42BA96]"></div>
            <p className="mt-2 text-gray-600">Loading student data...</p>
          </div>
        </div>
      </>
    );
  }

  // Handle error state
  if (error) {
    return (
      <>
        <AdminNavbar/>
        <div className="items-center mx-auto flex justify-center mt-4 mb-4 font-semibold text-2xl">Admin Portal</div>
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <div className="text-center">
            <div className="text-red-500 mb-2">⚠️ Error</div>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-[#42BA96] text-white rounded-lg hover:bg-[#369877] transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
        <AdminNavbar/>
        <div className="items-center mx-auto flex justify-center mt-4 mb-4 font-semibold text-2xl">Admin Portal</div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-[80%] mx-auto">
          <StatCard title="Total Students" value={totalStudents} icon="👥" bg="bg-blue-100 text-blue-600"/>
          <StatCard title="Average Attendance" value="82%" icon="📊" bg="bg-green-100 text-green-600"/>
          <StatCard title="New Content Added" value="15" icon="📚" bg="bg-purple-100 text-purple-600"/>
        </div>

        <div className="w-[80%] my-8 mx-auto ">
        <StudentsTable/>
        </div>

        <div className="w-[80%] my-8 mx-auto">
          <AttendanceCalendar />
        </div>

    </>
  )
}

export default AdminDashboard;
