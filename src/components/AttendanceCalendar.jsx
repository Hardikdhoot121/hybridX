import React, { useState, useEffect } from 'react';
import attendanceService from '../data/attendanceService';

const AttendanceCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState({});
  const [currentStudent, setCurrentStudent] = useState(null);
  const [loadingDates, setLoadingDates] = useState(new Set());
  
  // Get current logged-in student
  useEffect(() => {
    let isMounted = true;
    
    const loadStudentData = async () => {
      try {
        const studentData = localStorage.getItem('currentStudent');
        if (studentData) {
          const student = JSON.parse(studentData);
          console.log('👤 Raw student data from localStorage:', student);
          
          // Use _id if available, otherwise fall back to id
          const studentId = student._id || student.id;
          console.log('🆔 Using student ID:', { studentId, studentIdType: typeof studentId, _id: student._id, id: student.id });
          
          if (isMounted) {
            setCurrentStudent({
              ...student,
              id: studentId // Ensure we use the correct ID
            });
            
            // Load attendance for this student with enhanced error handling
            try {
              const studentAttendance = await attendanceService.getStudentAttendance(studentId, student.classLevel || student.class);
              if (isMounted) {
                setAttendanceData(studentAttendance);
                console.log('✅ Student attendance loaded successfully:', Object.keys(studentAttendance).length, 'days');
                console.log('📅 Available attendance dates:', Object.keys(studentAttendance));
              }
            } catch (attendanceError) {
              console.error('❌ Error loading student attendance:', attendanceError);
              // Try to load from backup service
              if (isMounted) {
                setAttendanceData({});
              }
            }
          }
        } else {
          console.log('⚠️ No student data found in localStorage');
          if (isMounted) {
            setCurrentStudent(null);
            setAttendanceData({});
          }
        }
      } catch (error) {
        console.warn('❌ Error reading student data:', error);
        if (isMounted) {
          setCurrentStudent(null);
          setAttendanceData({});
        }
      }
    };
    
    loadStudentData();
    
    return () => {
      isMounted = false;
    };
  }, []); // Remove currentDate dependency to avoid reloading on month change

  // Load attendance data when student or date changes
  useEffect(() => {
    let isMounted = true;
    
    const loadAttendance = async () => {
      if (currentStudent) {
        console.log('📅 Loading ALL attendance for student:', currentStudent.name);
        console.log('👤 Student details:', { 
          id: currentStudent.id, 
          class: currentStudent.classLevel || currentStudent.class 
        });
        
        // Force refresh attendance data
        console.log('🔄 Forcing attendance data refresh...');
        const studentAttendance = await attendanceService.getStudentAttendance(currentStudent.id, currentStudent.classLevel || currentStudent.class);
        
        if (isMounted) {
          console.log('📊 Setting attendance data:', studentAttendance);
          console.log('📈 Attendance found for dates:', Object.keys(studentAttendance));
          
          // Check specifically for Jan 9
          if (studentAttendance['2026-01-09'] !== undefined) {
            console.log('✅ Jan 9 attendance found:', studentAttendance['2026-01-09']);
          } else {
            console.log('❌ Jan 9 attendance NOT found in student data');
            console.log('🔍 Available dates in student data:', Object.keys(studentAttendance));
          }
          
          setAttendanceData(studentAttendance);
        }
      }
    };
    
    loadAttendance();
    
    return () => {
      isMounted = false;
    };
  }, [currentStudent]); // Remove currentDate from dependencies so it loads all data once
  
  // Listen for storage changes (when admin marks attendance)
  useEffect(() => {
    const handleAttendanceUpdate = async () => {
      if (currentStudent) {
        console.log('🔄 Attendance updated event received, refreshing calendar for student:', { 
          studentId: currentStudent.id, 
          studentIdType: typeof currentStudent.id, 
          studentName: currentStudent.name, 
          class: currentStudent.classLevel || currentStudent.class 
        });
        
        try {
          // Force refresh attendance data with enhanced error handling
          const studentAttendance = await attendanceService.getStudentAttendance(currentStudent.id, currentStudent.classLevel || currentStudent.class);
          console.log('📊 Updated student attendance data:', studentAttendance);
          
          setAttendanceData(studentAttendance);
          
          // Show notification to student
          const updatedDates = Object.keys(studentAttendance).length;
          console.log(`✅ Calendar updated with ${updatedDates} attendance records`);
        } catch (error) {
          console.error('❌ Error refreshing attendance data:', error);
          // Try to reload existing data
          try {
            const existingData = attendanceService.getStudentAttendanceFromLocal(currentStudent.id, currentStudent.classLevel || currentStudent.class);
            setAttendanceData(existingData);
          } catch (fallbackError) {
            console.error('❌ Fallback data load failed:', fallbackError);
          }
        }
      }
    };
    
    // Listen for custom events from admin portal
    window.addEventListener('attendanceUpdated', handleAttendanceUpdate);
    
    // Also listen for storage changes (for cross-tab updates)
    const handleStorageChange = (e) => {
      console.log('📡 Storage change detected:', e.key, e.newValue ? 'has new value' : 'cleared');
      if (e.key === 'attendanceData' || e.key === 'attendanceDataBackup' || !e.key) {
        handleAttendanceUpdate();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Also check for student login events
    const handleStudentLogin = () => {
      console.log('👤 Student login detected, refreshing attendance data');
      handleAttendanceUpdate();
    };
    window.addEventListener('studentLoggedIn', handleStudentLogin);
    
    return () => {
      window.removeEventListener('attendanceUpdated', handleAttendanceUpdate);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('studentLoggedIn', handleStudentLogin);
    };
  }, [currentStudent]);
  
  // Get months that have attendance data
  const getMonthsWithAttendance = () => {
    const months = new Set();
    Object.keys(attendanceData).forEach(dateKey => {
      const date = new Date(dateKey);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.add(monthKey);
    });
    return Array.from(months).sort();
  };

  const monthsWithAttendance = getMonthsWithAttendance();
  const currentMonthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const hasAttendanceThisMonth = monthsWithAttendance.includes(currentMonthKey);

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

  // Navigate to month with attendance data
  const navigateToMonthWithAttendance = (monthKey) => {
    const [year, month] = monthKey.split('-').map(Number);
    setCurrentDate(new Date(year, month - 1, 1));
  };

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
    
    // Debug logging for specific dates (especially Jan 9)
    if (dateKey === '2026-01-09' || IS_TODAY) {
      console.log('🔍 Calendar Debug:', {
        dateKey,
        attendanceStatus,
        status: attendanceStatus === true ? 'Present' : attendanceStatus === false ? 'Absent' : 'No data',
        studentId: currentStudent?.id,
        studentName: currentStudent?.name,
        availableDates: Object.keys(attendanceData)
      });
    }
    
    // Determine background color based on attendance
    let bgColorClass = 'text-gray-300';
    
    // Enhanced logging for debugging
    if (dateKey === '2026-01-03' || dateKey === '2026-01-04' || dateKey === '2026-01-05') {
      console.log(`🔍 Debug for ${dateKey}:`, {
        attendanceStatus,
        attendanceType: typeof attendanceStatus,
        isTrue: attendanceStatus === true,
        isFalse: attendanceStatus === false,
        isNull: attendanceStatus === null,
        isUndefined: attendanceStatus === undefined,
        hasValue: attendanceStatus !== undefined && attendanceStatus !== null
      });
    }
    
    if (attendanceStatus === true) {
      bgColorClass = 'bg-green-500 text-white'; // Present = Green
    } else if (attendanceStatus === false) {
      bgColorClass = 'bg-red-500 text-white'; // Absent = Red
    } else if (attendanceStatus === null || attendanceStatus === undefined) {
      bgColorClass = 'bg-gray-600 text-white'; // No data = Gray
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
          <p className="text-sm text-gray-400">{currentStudent.name} • Class {currentStudent.classLevel || currentStudent.class}</p>
          <p className="text-xs text-gray-500 mt-1">
            {Object.keys(attendanceData).length} days recorded • {hasAttendanceThisMonth ? 'This month has data' : 'No data this month'}
          </p>
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
      
      {/* Quick Navigation to Months with Attendance */}
      {monthsWithAttendance.length > 0 && (
        <div className="mb-4 p-3 bg-black/20 rounded-lg">
          <p className="text-xs text-gray-400 mb-2">Quick navigation to months with attendance:</p>
          <div className="flex flex-wrap gap-2">
            {monthsWithAttendance.map(monthKey => {
              const [year, month] = monthKey.split('-').map(Number);
              const monthName = monthNames[month - 1];
              const isCurrentMonth = monthKey === currentMonthKey;
              
              return (
                <button
                  key={monthKey}
                  onClick={() => navigateToMonthWithAttendance(monthKey)}
                  className={`px-3 py-1 text-xs rounded transition-all ${
                    isCurrentMonth 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {monthName} {year}
                </button>
              );
            })}
          </div>
        </div>
      )}
      
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
      
      {/* Enhanced Legend */}
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
      
      {/* Attendance Summary */}
      {Object.keys(attendanceData).length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="text-center text-xs text-gray-400">
            <p>Attendance Summary: 
              <span className="text-green-400 ml-2">
                {Object.values(attendanceData).filter(status => status === true).length} Present
              </span>
              <span className="text-red-400 ml-2">
                {Object.values(attendanceData).filter(status => status === false).length} Absent
              </span>
              <span className="text-gray-400 ml-2">
                {Object.values(attendanceData).filter(status => status !== true && status !== false).length} No data
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceCalendar;
