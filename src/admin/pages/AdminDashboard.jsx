import React from 'react'
import AdminNavbar from './AdminNavbar'
import StatCard from '../components/StatsCard'
import StudentsTable from '../components/StudentTable'
import { use11thStudents } from '../classData/11th_real'
import { use12thStudents } from '../classData/12th_real'

const AdminDashboard = () => {
  const { students: students11th } = use11thStudents();
  const { students: students12th } = use12thStudents();
  const totalStudents = students11th.length + students12th.length;

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

    </>
  )
}

export default AdminDashboard;
