import React, { useState, useEffect } from 'react'
import AdminNavbar from './AdminNavbar'
import { use11thStudents } from '../classData/11th_real'
import { use12thStudents } from '../classData/12th_real'
import AttendanceCalendar from '../../components/AttendanceCalendar'

const AdminAttendance = () => {
  const [selectedClass, setSelectedClass] = useState('11th')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const { students: students11th } = use11thStudents()
  const { students: students12th } = use12thStudents()
  
  const students = selectedClass === '11th' ? students11th : students12th
  const [attendance, setAttendance] = useState({})

  useEffect(() => {
    // Initialize attendance as present for all students
    const initialAttendance = {}
    students.forEach(student => {
      initialAttendance[student._id] = true
    })
    setAttendance(initialAttendance)
  }, [students])

  const toggleAttendance = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }))
  }

  const saveAttendance = async () => {
    try {
      const attendanceService = (await import('../../data/attendanceService')).default
      
      // Convert attendance object to the format expected by attendanceService
      const attendanceRecord = {}
      students.forEach(student => {
        attendanceRecord[student._id] = attendance[student._id]
      })
      
      // Save attendance permanently
      const success = await attendanceService.saveAttendance(
        selectedDate,
        selectedClass,
        attendanceRecord
      )
      
      if (success) {
        alert('Attendance saved successfully!')
      } else {
        alert('Failed to save attendance. Please try again.')
      }
    } catch (error) {
      console.error('Error saving attendance:', error)
      alert('Error saving attendance. Please try again.')
    }
  }

  const presentCount = Object.values(attendance).filter(Boolean).length
  const absentCount = students.length - presentCount
  const attendancePercentage = students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0

  return (
    <>
      <AdminNavbar/>
      <div className="items-center mx-auto flex justify-center mt-4 mb-4 font-semibold text-2xl">Mark Attendance</div>
      
      <div className="w-[80%] my-8 mx-auto">
        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
              <select 
                value={selectedClass} 
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#42BA96] text-black"
              >
                <option value="11th">11th Class</option>
                <option value="12th">12th Class</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input 
                type="date" 
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#42BA96]"
              />
            </div>
            
            <div className="flex items-end gap-2">
              <button 
                onClick={() => {
                  const allPresent = {}
                  students.forEach(student => {
                    allPresent[student._id] = true
                  })
                  setAttendance(allPresent)
                }}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Mark All Present
              </button>
              <button 
                onClick={() => {
                  const allAbsent = {}
                  students.forEach(student => {
                    allAbsent[student._id] = false
                  })
                  setAttendance(allAbsent)
                }}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Mark All Absent
              </button>
              <button 
                onClick={saveAttendance}
                className="flex-1 px-4 py-2 bg-[#42BA96] text-white rounded-lg hover:bg-[#369877] transition-colors"
              >
                Save Attendance
              </button>
            </div>
          </div>
          
          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{presentCount}</div>
              <div className="text-sm text-gray-600">Present</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{absentCount}</div>
              <div className="text-sm text-gray-600">Absent</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{attendancePercentage}%</div>
              <div className="text-sm text-gray-600">Percentage</div>
            </div>
          </div>
        </div>

        {/* Student List */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.rollNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.class}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={attendance[student._id] || false}
                      onChange={() => toggleAttendance(student._id)}
                      className="w-4 h-4 text-[#42BA96] bg-gray-100 border-gray-300 rounded focus:ring-[#42BA96] focus:ring-2"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default AdminAttendance
