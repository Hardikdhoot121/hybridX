import React, { useState } from 'react'
import AdminNavbar from './AdminNavbar'
import students from '../classData/12th'

const Attendance = () => {
  const [selectedClass, setSelectedClass] = useState('12th')
  const [attendance, setAttendance] = useState({})

  // Handle checkbox change
  const handleAttendanceChange = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }))
  }

  // Handle mark all present/absent
  const handleMarkAll = (present) => {
    const newAttendance = {}
    students.forEach(student => {
      newAttendance[student.id] = present
    })
    setAttendance(newAttendance)
  }

  // Get attendance statistics
  const presentCount = Object.values(attendance).filter(Boolean).length
  const totalCount = students.length
  const attendancePercentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0

  return (
    <>
      <AdminNavbar/>
      
      <div className="flex min-h-screen bg-[#15191e]">
        
        {/* Left Sidebar - Class Selection */}
        <div className="w-64 bg-[#15191e] shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6 text-white">Select Class</h2>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedClass('12th')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                selectedClass === '12th' 
                  ? 'bg-[#42BA96] text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Class 12th
            </button>
            <button
              onClick={() => setSelectedClass('11th')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                selectedClass === '11th' 
                  ? 'bg-[#42BA96] text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Class 11th
            </button>
            <button
              onClick={() => setSelectedClass('10th')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                selectedClass === '10th' 
                  ? 'bg-[#42BA96] text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Class 10th
            </button>
          </div>

          {/* Attendance Statistics */}
          <div className="mt-8 p-4 bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-white mb-3">Today's Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Present:</span>
                <span className="font-medium text-[#3BBAF4]">{presentCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Absent:</span>
                <span className="font-medium text-red-400">{totalCount - presentCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Total:</span>
                <span className="font-medium text-white">{totalCount}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-600">
                <span className="text-gray-300">Percentage:</span>
                <span className="font-bold text-[#3BBAF4]">{attendancePercentage}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Student List */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Attendance Management</h1>
                  <p className="text-gray-600 mt-1">Class {selectedClass} - {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleMarkAll(true)}
                    className="px-4 py-2 bg-[#42BA96] text-white rounded-lg hover:bg-[#2ea67f] transition-colors"
                  >
                    Mark All Present
                  </button>
                  <button
                    onClick={() => handleMarkAll(false)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Mark All Absent
                  </button>
                </div>
              </div>
            </div>

            {/* Student List */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b">
                <div className="flex items-center">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">Student List</h3>
                    <p className="text-sm text-gray-600 mt-1">Mark attendance for {students.length} students</p>
                  </div>
                </div>
              </div>
              
              <div className="divide-y">
                {students.map((student) => (
                  <div key={student.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          id={`student-${student.id}`}
                          checked={attendance[student.id] || false}
                          onChange={() => handleAttendanceChange(student.id)}
                          className="w-5 h-5 text-[#3BBAF4] border-gray-300 rounded focus:ring-[#3BBAF4]"
                        />
                        <label 
                          htmlFor={`student-${student.id}`}
                          className="cursor-pointer flex-1"
                        >
                          <div className="font-medium text-gray-800">{student.name}</div>
                          <div className="text-sm text-gray-600">
                            {student.stream} • {student.phone}
                          </div>
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          attendance[student.id] 
                            ? 'bg-[#42BA96] text-white' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {attendance[student.id] ? 'Present' : 'Absent'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-6 flex justify-center">
              <button className="px-8 py-3 bg-[#3BBAF4] text-white rounded-lg hover:bg-blue-500 transition-colors font-medium">
                Save Attendance
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default Attendance
