import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import attendanceService from '../data/attendanceService.js';

const AttendanceCalendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('12th');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateKey = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const loadAttendanceData = async () => {
    try {
      setLoading(true);
      const data = attendanceService.getAllAttendance();
      setAttendanceData(data);
    } catch (error) {
      console.error('Error loading attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendanceData();
  }, []);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day) => {
    const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(dateKey);
  };

  const getAttendanceStatus = (day) => {
    const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
    const classAttendance = attendanceData[dateKey]?.[selectedClass];
    
    if (!classAttendance) return 'none';
    
    // Check if any student is marked present
    const hasPresent = Object.values(classAttendance).some(status => status === true);
    const hasAbsent = Object.values(classAttendance).some(status => status === false);
    
    if (hasPresent && !hasAbsent) return 'present';
    if (hasAbsent && !hasPresent) return 'absent';
    if (hasPresent && hasAbsent) return 'mixed';
    return 'none';
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const status = getAttendanceStatus(day);
      const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isSelected = selectedDate === dateKey;
      
      let bgColor = 'bg-gray-800 hover:bg-gray-700';
      let textColor = 'text-gray-300';
      
      if (status === 'present') {
        bgColor = 'bg-green-900 hover:bg-green-800';
        textColor = 'text-green-300';
      } else if (status === 'absent') {
        bgColor = 'bg-red-900 hover:bg-red-800';
        textColor = 'text-red-300';
      } else if (status === 'mixed') {
        bgColor = 'bg-yellow-900 hover:bg-yellow-800';
        textColor = 'text-yellow-300';
      }
      
      if (isSelected) {
        bgColor += ' ring-2 ring-blue-500';
      }

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${bgColor} ${textColor}`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const getAttendanceStats = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    let present = 0, absent = 0, total = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const status = getAttendanceStatus(day);
      if (status === 'present') {
        present++;
        total++;
      } else if (status === 'absent') {
        absent++;
        total++;
      } else if (status === 'mixed') {
        present++;
        absent++;
        total += 2;
      }
    }

    return { present, absent, total, percentage: total > 0 ? Math.round((present / total) * 100) : 0 };
  };

  const stats = getAttendanceStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1020] text-white flex items-center justify-center">
        <div className="text-center">
          <CalendarIcon className="w-12 h-12 mx-auto mb-4 animate-pulse" />
          <p>Loading attendance calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1020] text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            Back to Dashboard
          </button>
          
          <h1 className="text-2xl font-bold">Attendance Calendar</h1>
          
          <div className="flex items-center gap-4">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-[#0e1628] border border-white/10 rounded-lg px-3 py-2 text-white"
            >
              <option value="11th">11th Class</option>
              <option value="12th">12th Class</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#0e1628] rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Days</p>
                <p className="text-xl font-bold">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#0e1628] rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Present</p>
                <p className="text-xl font-bold text-green-400">{stats.present}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#0e1628] rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Absent</p>
                <p className="text-xl font-bold text-red-400">{stats.absent}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#0e1628] rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Attendance %</p>
                <p className="text-xl font-bold text-blue-400">{stats.percentage}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-[#0e1628] rounded-xl p-6 border border-white/5">
          {/* Month Navigation */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            
            <h2 className="text-xl font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="h-10 flex items-center justify-center text-sm font-medium text-gray-400">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {renderCalendarDays()}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-[#0e1628] rounded-xl p-4 border border-white/5">
          <h3 className="font-semibold mb-3">Legend</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-900 rounded"></div>
              <span className="text-sm text-gray-300">All Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-900 rounded"></div>
              <span className="text-sm text-gray-300">All Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-900 rounded"></div>
              <span className="text-sm text-gray-300">Mixed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-800 rounded"></div>
              <span className="text-sm text-gray-300">No Data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;
