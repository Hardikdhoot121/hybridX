import React, { useState, useEffect } from 'react';
import attendanceService from '../data/attendanceService';

const AttendanceCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState({});
  const [currentStudent, setCurrentStudent] = useState(null);
  
  // Get current logged-in student
  useEffect(() => {
    let isMounted = true;
    
    const loadStudentData = async () => {
      try {
        const studentData = localStorage.getItem('currentStudent');
        if (studentData) {
          const student = JSON.parse(studentData);
          if (isMounted) {
            setCurrentStudent(student);
            
            // Load attendance for this student
            const studentAttendance = await attendanceService.getStudentAttendance(student.id, student.class);
            if (isMounted) {
              setAttendanceData(studentAttendance);
            }
          }
        }
      } catch (error) {
        console.warn('Error reading student data:', error);
      }
    };
    
    loadStudentData();
    
    return () => {
      isMounted = false;
    };
  }, [currentDate]);

  // Load attendance data when student or date changes
  useEffect(() => {
    let isMounted = true;
    
    const loadAttendance = async () => {
      if (currentStudent) {
        const studentAttendance = await attendanceService.getStudentAttendance(currentStudent.id, currentStudent.class);
        if (isMounted) {
          setAttendanceData(studentAttendance);
        }
      }
    };
    
    loadAttendance();
    
    return () => {
      isMounted = false;
    };
  }, [currentStudent, currentDate]);
  
  // Listen for storage changes (when admin marks attendance)
  useEffect(() => {
    const handleStorageChange = async () => {
      if (currentStudent) {
        console.log('Attendance updated, refreshing calendar for student:', currentStudent.id, currentStudent.class);
        const studentAttendance = await attendanceService.getStudentAttendance(currentStudent.id, currentStudent.class);
        console.log('Student attendance data:', studentAttendance);
        setAttendanceData(studentAttendance);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('attendanceUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('attendanceUpdated', handleStorageChange);
    };
  }, [currentStudent]);
  
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
    const today = new Date();
    const IS_TODAY = day === today.getDate() && 
                   currentDate.getMonth() === today.getMonth() && 
                   currentDate.getFullYear() === today.getFullYear();
    
    // Format date key for attendance lookup
    const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const attendanceStatus = attendanceData[dateKey];
    
    // Determine background color based on attendance
    let bgColorClass = 'text-gray-300';
    if (attendanceStatus === true) {
      bgColorClass = 'bg-green-500 text-white'; // Present = Green
    } else if (attendanceStatus === false) {
      bgColorClass = 'bg-red-500 text-white'; // Absent = Red
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
  
  // If no student is logged in, show login prompt
  if (!currentStudent) {
    return (
      <div className="rounded-xl bg-[#0e1628] p-6">
        <div className="text-center text-white">
          <h3 className="font-semibold mb-4">Please login to view your attendance</h3>
          <p className="text-gray-400 text-sm">Your attendance calendar will appear here after login</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="rounded-xl bg-[#0e1628] p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-semibold">Your Attendance</h3>
          <p className="text-sm text-gray-400">{currentStudent.name} • Class {currentStudent.class}</p>
        </div>
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
          <div className="w-3 h-3 bg-gray-600 rounded"></div>
          <span className="text-gray-400">No data</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;
