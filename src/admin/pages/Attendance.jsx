import React, { useState, useEffect } from 'react'
import AdminNavbar from './AdminNavbar'
import { use11thStudents } from '../classData/11th_real'
import { use12thStudents } from '../classData/12th_real'
import attendanceService from '../../data/attendanceService'

const Attendance = () => {
  const [selectedClass, setSelectedClass] = useState('12th')
  const [attendance, setAttendance] = useState({})
  const [selectedDate, setSelectedDate] = useState(new Date())
  
  // Fetch dynamic student data from backend
  const { students: students11th, loading: loading11th, error: error11th } = use11thStudents();
  const { students: students12th, loading: loading12th, error: error12th } = use12thStudents();

  // Get students based on selected class
  const getCurrentStudents = () => {
    return selectedClass === '11th' ? students11th : students12th;
  };

  const currentStudents = getCurrentStudents();
  const loading = loading11th || loading12th;
  const error = error11th || error12th;

  // Load saved attendance when component mounts, class changes, or date changes
  useEffect(() => {
    let isMounted = true;
    
    const loadAttendance = async () => {
      console.log('📅 Loading attendance for:', { 
        date: selectedDate.toLocaleDateString(), 
        class: selectedClass 
      });
      
      const savedAttendance = await attendanceService.getAttendance(selectedDate, selectedClass);
      
      if (isMounted) {
        console.log('📊 Loaded attendance:', savedAttendance);
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
    console.log('🔄 Attendance toggle for student:', { 
      studentId, 
      studentIdType: typeof studentId, 
      studentName: currentStudents.find(s => s._id === studentId)?.name || 'Unknown',
      currentClass: selectedClass,
      selectedDate: selectedDate.toDateString(),
      currentValue: attendance[studentId],
      newValue: !attendance[studentId]
    });
    
    // Explicitly set the boolean value to ensure false is preserved
    const newValue = !attendance[studentId];
    setAttendance(prev => ({
      ...prev,
      [studentId]: newValue
    }))
  }

  // Handle mark all present/absent
  const handleMarkAll = (present) => {
    const newAttendance = {}
    currentStudents.forEach(student => {
      console.log('📝 Marking attendance for student:', { 
        studentId: student._id, 
        studentIdType: typeof student._id, 
        studentName: student.name, 
        present 
      });
      newAttendance[student._id] = present
    })
    setAttendance(newAttendance)
  }

  // Save attendance to storage
  const handleSaveAttendance = async () => {
    const currentDate = selectedDate;
    const dateKey = attendanceService.formatDateKey(currentDate);
    
    console.log('💾 Saving attendance for date:', dateKey);
    console.log('📝 Attendance record to save:', attendance);
    console.log('👥 Students being marked:', Object.keys(attendance));
    console.log('📊 Selected class:', selectedClass);
    
    // Show which students are present/absent
    const presentStudents = Object.keys(attendance).filter(id => attendance[id]);
    const absentStudents = Object.keys(attendance).filter(id => !attendance[id]);
    console.log('✅ Present students:', presentStudents.length, presentStudents);
    console.log('❌ Absent students:', absentStudents.length, absentStudents);
    
    try {
      const success = await attendanceService.saveAttendance(currentDate, selectedClass, attendance);
      
      if (success) {
        console.log('✅ Attendance saved successfully for:', dateKey);
        alert(`Attendance saved for ${dateKey}!\n${Object.values(attendance).filter(Boolean).length} students marked present`);
        
        // The attendance service already dispatches the event, but we can add additional notification
        window.dispatchEvent(new CustomEvent('attendanceUpdated', {
          detail: { 
            date: currentDate, 
            class: selectedClass, 
            attendance, 
            dateKey,
            timestamp: new Date().toISOString()
          }
        }));
      } else {
        alert('Error saving attendance. Please try again.');
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

  // Handle loading state
  if (loading) {
    return (
      <>
        <AdminNavbar/>
        <div className="flex min-h-screen bg-[#15191e] items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#42BA96]"></div>
            <p className="mt-2 text-white">Loading student data...</p>
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
        <div className="flex min-h-screen bg-[#15191e] items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-2">⚠️ Error</div>
            <p className="text-white">{error}</p>
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
              <option value="12th">Class 12th ({students12th.length} students)</option>
              <option value="11th">Class 11th ({students11th.length} students)</option>
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
              max={new Date().toISOString().split('T')[0]} // Prevent future dates
            />
            <p className="text-xs text-gray-400 mt-2">
              {selectedDate > new Date() ? 
                "⚠️ Future date selected" : 
                selectedDate.toDateString() === new Date().toDateString() ? 
                "📅 Today" : 
                "📅 Past date"
              }
            </p>
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
                  <div key={student._id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          id={`student-${student._id}`}
                          checked={attendance[student._id] === true}
                          onChange={() => handleAttendanceChange(student._id)}
                          className="w-5 h-5 text-[#3BBAF4] border-gray-300 rounded focus:ring-[#3BBAF4]"
                        />
                        <label 
                          htmlFor={`student-${student._id}`}
                          className="cursor-pointer flex-1"
                        >
                          <div className="font-medium text-gray-800">{student.name}</div>
                          <div className="text-sm text-gray-600">
                            {student.batch === "Batch 1" ? "JEE" : student.batch === "Batch 2" ? "NEET" : "Not assigned"} • {student.phone}
                          </div>
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          attendance[student._id] === true
                            ? 'bg-[#42BA96] text-white' 
                            : attendance[student._id] === false
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {attendance[student._id] === true ? 'Present' : attendance[student._id] === false ? 'Absent' : 'Not Marked'}
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
