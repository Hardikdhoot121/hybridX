import React from 'react'
import AdminNavbar from './AdminNavbar'
import StatCard from '../components/StatsCard'
import StudentsTable from '../components/StudentTable'

const adminDashboard = () => {
  return (
    <>
        <AdminNavbar/>
        <div className="items-center mx-auto flex justify-center mt-4 mb-4 font-semibold text-2xl">Admin Portal</div>
        <div className="items-center mx-auto flex justify-center mt-4 mb-8 font-medium text-xl">Class 12</div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-[80%] mx-auto">
          <StatCard title="Total Students" value="1,250" bg="bg-blue-100 text-blue-600"/>
          <StatCard title="Average Attendance" value="82%" bg="bg-blue-100 text-blue-600"/>
          <StatCard title="Total Students" value="1,250" bg="bg-blue-100 text-blue-600"/>
          <StatCard title="New Content Added" value="15" bg="bg-blue-100 text-blue-600"/>
        </div>

        <div className="w-[80%] my-8 mx-auto ">
        <StudentsTable/>
        </div>

    </>
  )

  
}

export default adminDashboard