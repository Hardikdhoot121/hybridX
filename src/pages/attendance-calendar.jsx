import React from 'react';
import AttendanceCalendar from '../components/AttendanceCalendar';

const AttendanceCalendarPage = () => {
  return (
    <div className="min-h-screen bg-[#15191e] p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">My Attendance Calendar</h1>
        <AttendanceCalendar />
      </div>
    </div>
  );
};

export default AttendanceCalendarPage;
