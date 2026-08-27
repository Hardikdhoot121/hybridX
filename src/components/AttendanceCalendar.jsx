import React, { useState, useEffect } from 'react';
import attendanceService from '../data/attendanceService';

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const AttendanceCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState({});
  const [currentStudent, setCurrentStudent] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadStudentData = async () => {
      try {
        // Cleanup obsolete legacy localStorage keys
        localStorage.removeItem('attendanceData');
        localStorage.removeItem('attendanceDataBackup');
        localStorage.removeItem('currentStudent');

        const userData = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!userData || !token) {
          if (isMounted) setCurrentStudent(null);
          return;
        }

        let user;
        try {
          user = JSON.parse(userData);
        } catch {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          if (isMounted) setCurrentStudent(null);
          return;
        }

        let studentId = user._id || user.id;
        let classLevel = user.classLevel;

        // Fallback: If classLevel or studentId is missing in stored user object, fetch full profile from API
        if (!studentId || !classLevel) {
          try {
            const profileRes = await fetch(`${API_BASE}/users/profile`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              }
            });
            if (profileRes.ok) {
              const profileJson = await profileRes.json();
              const fullUser = profileJson.user || profileJson;
              localStorage.setItem('user', JSON.stringify(fullUser));
              user = fullUser;
              studentId = user._id || user.id;
              classLevel = user.classLevel;
            }
          } catch (err) {
            // Silently proceed
          }
        }

        if (!studentId || !classLevel) {
          if (isMounted) setCurrentStudent(null);
          return;
        }

        if (isMounted) setCurrentStudent(user);

        const data = await attendanceService.getStudentAttendance(studentId, classLevel);
        if (isMounted) setAttendanceData(data);

      } catch (error) {
        if (isMounted) setAttendanceData({});
      }
    };

    loadStudentData();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const handleAttendanceUpdate = async () => {
      if (!currentStudent) return;

      const studentId = currentStudent._id || currentStudent.id;
      const data = await attendanceService.getStudentAttendance(
        studentId,
        currentStudent.classLevel
      );
      setAttendanceData(data);
    };

    window.addEventListener('attendanceUpdated', handleAttendanceUpdate);
    return () => window.removeEventListener('attendanceUpdated', handleAttendanceUpdate);
  }, [currentStudent]);

  const getDaysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-8" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = attendanceService.formatDateKey(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    );
    const status = attendanceData[dateKey];

    let bgClass = 'bg-gray-600 text-white';
    if (status === true) bgClass = 'bg-green-500 text-white';
    if (status === false) bgClass = 'bg-red-500 text-white';

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

  if (!currentStudent) {
    return (
      <div className="rounded-xl bg-[#0e1628] p-6 text-center text-white">
        <h3 className="font-semibold mb-2">Please login to view your attendance</h3>
        <p className="text-gray-400 text-sm">Your calendar will appear here after login</p>
      </div>
    );
  }

  const presentCount = Object.values(attendanceData).filter(s => s === true).length;
  const absentCount = Object.values(attendanceData).filter(s => s === false).length;

  return (
    <div className="rounded-xl bg-[#0e1628] p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-semibold text-white">Your Attendance</h3>
          <p className="text-sm text-gray-400">
            {currentStudent.name || 'Student'} • Class {currentStudent.classLevel}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="text-gray-400 hover:text-white"
          >‹</button>
          <span className="text-sm text-gray-300">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="text-gray-400 hover:text-white"
          >›</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="h-6 flex items-center justify-center text-gray-500 font-medium">
            {d}
          </div>
        ))}
        {days}
      </div>

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

      <div className="mt-4 pt-4 border-t border-gray-700 text-center text-xs text-gray-400">
        <span className="text-green-400">{presentCount} Present</span>
        <span className="mx-2">•</span>
        <span className="text-red-400">{absentCount} Absent</span>
      </div>
    </div>
  );
};

export default AttendanceCalendar;
