import React, { useState, useEffect } from 'react';
import attendanceService from '../data/attendanceService';

/**
 * AttendanceCalendar.jsx
 * 
 * UI Role:
 * - Shown on the Student Dashboard page
 * - Displays a month-by-month calendar grid
 * - Each day is color coded: Green (Present), Red (Absent), Gray (No Data)
 * - Student can navigate between months using < > arrows
 * - Shows total present/absent count summary at bottom
 * - Automatically refreshes when admin marks new attendance (attendanceUpdated event)
 */

const AttendanceCalendar = () => {
  // Which month is currently being displayed (default = current month)
  const [currentDate, setCurrentDate] = useState(new Date());

  // Attendance data from MongoDB: { "2026-08-01": true, "2026-08-02": false, ... }
  const [attendanceData, setAttendanceData] = useState({});

  // Logged-in student's user object (from localStorage 'user' key set at login)
  const [currentStudent, setCurrentStudent] = useState(null);

  // EFFECT 1: Load student identity + fetch their attendance from backend
  // Runs ONCE when component mounts (no dependencies = no re-runs on month change)

  useEffect(() => {
    let isMounted = true;

    const loadStudentData = async () => {
      try {
        // 'user' key is set in localStorage by authController after login
        // It contains: { _id, name, email, classLevel, role, ... }
        const userData = localStorage.getItem('user');

        if (!userData) {
          // No logged-in user → show "Please login" message
          if (isMounted) setCurrentStudent(null);
          return;
        }

        let user;
        try {
          user = JSON.parse(userData);
        } catch {
          // localStorage 'user' is corrupted then change it ...
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          if (isMounted) setCurrentStudent(null);
          return;
        }

        const studentId = user._id;         // MongoDB ObjectId string (e.g. "64abc123...")
        const classLevel = user.classLevel;  // "11th" or "12th"

        // _id missing means old session data or corrupted object - cannot query backend
        if (!studentId || !classLevel) {
          if (isMounted) setCurrentStudent(null);
          return;
        }

        if (isMounted) setCurrentStudent(user);

        // GET /api/attendance/student?studentId=...&classLevel=...
        // Returns: { "2026-08-01": true, "2026-08-03": false, ... }
        const data = await attendanceService.getStudentAttendance(studentId, classLevel);
        if (isMounted) setAttendanceData(data);

      } catch (error) {
        console.error('Error loading student attendance:', error);
        if (isMounted) setAttendanceData({});
      }
    };

    loadStudentData();

    // Cleanup: prevent setState after component unmounts (memory leak prevention)
    return () => { isMounted = false; };
  }, []); // Empty array = runs only once on mount

  // ─────────────────────────────────────────────────────────
  // EFFECT 2: Listen for admin marking attendance
  // When admin saves attendance in Attendance.jsx, it fires:
  // window.dispatchEvent(new CustomEvent('attendanceUpdated', ...))
  // This effect catches that event and re-fetches student's calendar
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    const handleAttendanceUpdate = async () => {
      if (!currentStudent) return;

      // Re-fetch from backend to get latest data
      const data = await attendanceService.getStudentAttendance(
        currentStudent._id,
        currentStudent.classLevel
      );
      setAttendanceData(data);
    };

    window.addEventListener('attendanceUpdated', handleAttendanceUpdate);

    // Cleanup: remove listener when component unmounts
    return () => window.removeEventListener('attendanceUpdated', handleAttendanceUpdate);
  }, [currentStudent]); // Re-register whenever currentStudent changes

  // ─────────────────────────────────────────────────────────
  // CALENDAR RENDERING HELPERS
  // ─────────────────────────────────────────────────────────

  // How many days does the currently displayed month have? (28/29/30/31)
  const getDaysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  // Which day of the week does the 1st fall on? (0=Sunday, 6=Saturday)
  // This tells us how many empty cells to put before day 1
  const getFirstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  // Add empty gray placeholder cells before day 1
  // e.g. if month starts on Wednesday (3), we add 3 empty cells
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-8" />);
  }

  // Build each day cell with attendance color coding
  for (let day = 1; day <= daysInMonth; day++) {
    // Build the date key "YYYY-MM-DD" using attendanceService.formatDateKey()
    // This uses the helper() function internally for timezone-safe conversion
    const dateKey = attendanceService.formatDateKey(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    );

    // Look up attendance status for this specific date
    // true  = Admin marked Present
    // false = Admin marked Absent
    // undefined = Admin hasn't marked attendance for this date yet
    const status = attendanceData[dateKey];

    let bgClass = 'bg-gray-600 text-white'; // Default: No data
    if (status === true) bgClass = 'bg-green-500 text-white'; // Present
    if (status === false) bgClass = 'bg-red-500 text-white';   // Absent

    days.push(
      <div
        key={day}
        className={`h-8 flex items-center justify-center text-sm rounded ${bgClass}`}
        title={status === true ? 'Present' : status === false ? 'Absent' : 'No data'}
      >
        {day}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  // RENDER: If student is not logged in
  // ─────────────────────────────────────────────────────────
  if (!currentStudent) {
    return (
      <div className="rounded-xl bg-[#0e1628] p-6 text-center text-white">
        <h3 className="font-semibold mb-2">Please login to view your attendance</h3>
        <p className="text-gray-400 text-sm">Your calendar will appear here after login</p>
      </div>
    );
  }

  // Count totals from attendanceData for summary section
  const presentCount = Object.values(attendanceData).filter(s => s === true).length;
  const absentCount = Object.values(attendanceData).filter(s => s === false).length;

  // ─────────────────────────────────────────────────────────
  // RENDER: Full calendar for logged-in student
  // ─────────────────────────────────────────────────────────
  return (
    <div className="rounded-xl bg-[#0e1628] p-6">

      {/* Header: Student name + Month navigation arrows */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-semibold text-white">Your Attendance</h3>
          <p className="text-sm text-gray-400">
            {currentStudent.name} • Class {currentStudent.classLevel}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          {/* Previous month button */}
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="text-gray-400 hover:text-white"
          >‹</button>

          <span className="text-sm text-gray-300">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>

          {/* Next month button */}
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="text-gray-400 hover:text-white"
          >›</button>
        </div>
      </div>

      {/* 7-column calendar grid: Sun Mon Tue Wed Thu Fri Sat */}
      <div className="grid grid-cols-7 gap-1 text-xs">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="h-6 flex items-center justify-center text-gray-500 font-medium">
            {d}
          </div>
        ))}
        {/* Day cells (empty placeholders + colored attendance cells) */}
        {days}
      </div>

      {/* Color Legend */}
      <div className="mt-4 flex justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded" />
          <span className="text-gray-400">Present</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded" />
          <span className="text-gray-400">Absent</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-600 rounded" />
          <span className="text-gray-400">No data</span>
        </div>
      </div>

      {/* Present / Absent Summary */}
      <div className="mt-4 pt-4 border-t border-gray-700 text-center text-xs text-gray-400">
        <span className="text-green-400">{presentCount} Present</span>
        <span className="mx-2">•</span>
        <span className="text-red-400">{absentCount} Absent</span>
      </div>

    </div>
  );
};

export default AttendanceCalendar;
