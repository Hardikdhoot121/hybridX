import React, { useState, useEffect } from 'react';
import attendanceService from '../data/attendanceService';

const AttendanceCalendar = ({ studentId, studentClass }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState({});
  
  // Load attendance data for the student when component mounts or month changes
  useEffect(() => {
    if (studentId && studentClass) {
      const studentAttendance = attendanceService.getStudentAttendance(studentId, studentClass);
      setAttendanceData(studentAttendance);
    }
  }, [studentId, studentClass, currentDate]);
  
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-8"></div>);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = day === new Date().getDate() && 
                   currentDate.getMonth() === new Date().getMonth() && 
                   currentDate.getFullYear() === new Date().getFullYear();
    
    // Format date key for attendance lookup
    const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const attendanceStatus = attendanceData[dateKey];
    
    // Determine background color based on attendance
    let bgColorClass = 'text-gray-300';
    if (attendanceStatus === true) {
      bgColorClass = 'bg-green-500 text-white';
    } else if (attendanceStatus === false) {
      bgColorClass = 'bg-red-500 text-white';
    } else if (isToday) {
      bgColorClass = 'bg-blue-500 text-white';
    }
    
    days.push(
      <div 
        key={day} 
        className={`h-8 flex items-center justify-center text-sm rounded cursor-pointer hover:bg-white/10 ${bgColorClass}`}
        title={attendanceStatus === true ? 'Present' : attendanceStatus === false ? 'Absent' : 'No data'}
      >
        {day}
      </div>
    );
  }
  
  return (
    <div className="rounded-xl bg-[#0e1628] p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Attendance</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="text-gray-400 hover:text-white"
          >
            ‹
          </button>
          <span className="text-sm text-gray-300">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="text-gray-400 hover:text-white"
          >
            ›
          </button>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-xs">
        {/* Weekday headers */}
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div key={index} className="h-6 flex items-center justify-center text-gray-500 font-medium">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {days}
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-gray-400">Present</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-gray-400">Absent</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-gray-400">Today</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-600 rounded"></div>
          <span className="text-gray-400">No data</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;
