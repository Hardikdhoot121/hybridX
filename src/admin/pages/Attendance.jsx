import React, { useState, useEffect } from 'react'
import AdminNavbar from './AdminNavbar'
import students11th from '../classData/11th_real'
import students12th from '../classData/12th_real'
import attendanceService from '../../data/attendanceService'

const Attendance = () => {
  const [selectedClass, setSelectedClass] = useState('12th')
  const [attendance, setAttendance] = useState({})
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Get students based on selected class
  const getCurrentStudents = () => {
    return selectedClass === '11th' ? students11th : students12th;
  };

  const currentStudents = getCurrentStudents();

  // Load saved attendance when component mounts, class changes, or date changes
  useEffect(() => {
    let isMounted = true;
    
    const loadAttendance = async () => {
      const savedAttendance = await attendanceService.getAttendance(selectedDate, selectedClass);
      
      if (isMounted) {
        setAttendance(savedAttendance);
      }
    };
    
    loadAttendance();
    
    return () => {
      isMounted = false;
    };
  }, [selectedClass, selectedDate]);

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
    currentStudents.forEach(student => {
      newAttendance[student.id] = present
    })
    setAttendance(newAttendance)
  }

  // Save attendance to storage
  const handleSaveAttendance = async () => {
    const currentDate = selectedDate;
    const dateKey = attendanceService.formatDateKey(currentDate);
    
    console.log('Saving attendance for date:', dateKey);
    
    try {
      const success = await attendanceService.saveAttendance(currentDate, selectedClass, attendance);
      
      if (success) {
        // Dispatch event to notify student dashboards
        window.dispatchEvent(new CustomEvent('attendanceUpdated', {
          detail: { date: currentDate, class: selectedClass, attendance, dateKey }
        }));
        
        console.log('✅ Attendance saved successfully for:', dateKey);
        alert(`Attendance saved for ${dateKey}!`);
      }
    } catch (error) {
      console.error('❌ Error saving attendance:', error);
      alert('Error saving attendance. Please try again.');
    }
  };

  // Get attendance statistics
  const presentCount = Object.values(attendance).filter(Boolean).length
  const totalCount = currentStudents.length
  const attendancePercentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0

  return (
    <>
      <AdminNavbar/>
      
      <div className="flex min-h-screen bg-[#15191e]">
        
        {/* Left Sidebar - Class Selection */}
        <div className="w-64 bg-[#15191e] shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6 text-white">Select Class</h2>
          <div className="space-y-2">
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-3 border border-[#42BA96] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#42BA96] bg-white text-gray-700 font-medium"
            >
              <option value="12th">Class 12th (40 students)</option>
              <option value="11th">Class 11th (31 students)</option>
            </select>
          </div>

          {/* Date Selector */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 text-white">Select Date</h3>
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="w-full px-4 py-3 border border-[#42BA96] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#42BA96] bg-white text-gray-700 font-medium"
            />
          </div>

          {/* Attendance Statistics */}
          <div className="mt-8 p-4 bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-white mb-3">Stats for {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</h3>
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
                  <p className="text-gray-600 mt-1">Class {selectedClass} - {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
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
                    <p className="text-sm text-gray-600 mt-1">Mark attendance for {currentStudents.length} students</p>
                  </div>
                </div>
              </div>
              
              <div className="divide-y">
                {currentStudents.map((student) => (
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
              <button onClick={handleSaveAttendance} className="px-8 py-3 bg-[#3BBAF4] text-white rounded-lg hover:bg-blue-500 transition-colors font-medium">
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
