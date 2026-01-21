import React, { useState, useEffect } from 'react';
import { Calendar, Check, X, Users, Save } from 'lucide-react';
import attendanceService from '../../data/attendanceService.js';
import { useNavigate } from 'react-router-dom';

const AdminAttendance = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState('12th');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Load students data (you can replace this with actual API call)
  useEffect(() => {
    loadStudents();
  }, [selectedClass]);

  const loadStudents = async () => {
    try {
      // For now, using static data - replace with actual API call
      const studentsData = selectedClass === '11th' ? [
        { id: 41, name: "Priyank Mathur", stream: "JEE" },
        { id: 42, name: "Utkarsh Mishra", stream: "NEET" },
        { id: 43, name: "Suhani Pediwal", stream: "JEE" },
        { id: 44, name: "Bhawesh Mulchandani", stream: "JEE" },
        { id: 45, name: "Bhavya Mulchandani", stream: "JEE" },
        { id: 46, name: "Yashvi sadarangani", stream: "NEET" },
        { id: 47, name: "Aastha gujrati", stream: "NEET" },
        { id: 48, name: "Charvi Mathur", stream: "JEE" },
        { id: 49, name: "Khanak Lohra", stream: "JEE" },
        { id: 50, name: "Harsh chittara", stream: "JEE" },
      ] : [
        { id: 1, name: "Milin mathur", stream: "JEE" },
        { id: 2, name: "Preet Choudhary", stream: "NEET" },
        { id: 3, name: "Dhananjay Kaushish", stream: "JEE" },
        { id: 4, name: "Yogesh Paliwal", stream: "JEE" },
        { id: 5, name: "Aradhya Mathur", stream: "JEE" },
        { id: 6, name: "Samarth Mathur", stream: "JEE" },
        { id: 7, name: "Harshal Mathur", stream: "JEE" },
        { id: 8, name: "Lakshya", stream: "JEE" },
        { id: 9, name: "Kashvi Goil", stream: "JEE" },
        { id: 10, name: "Dhairy Solanki", stream: "JEE" },
      ];
      
      setStudents(studentsData);
      
      // Load existing attendance for this date
      loadExistingAttendance(selectedDate);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const loadExistingAttendance = async (date) => {
    try {
      const dateKey = formatDateKey(date);
      const existingAttendance = await attendanceService.getAttendance(date, selectedClass);
      setAttendance(existingAttendance);
    } catch (error) {
      console.error('Error loading existing attendance:', error);
      setAttendance({});
    }
  };

  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    loadExistingAttendance(date);
  };

  const handleAttendanceChange = (studentId, isPresent) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: isPresent
    }));
  };

  const handleMarkAll = (isPresent) => {
    const newAttendance = {};
    students.forEach(student => {
      newAttendance[student.id] = isPresent;
    });
    setAttendance(newAttendance);
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedMessage('');
    
    try {
      const dateKey = formatDateKey(selectedDate);
      const success = await attendanceService.saveAttendance(selectedDate, selectedClass, attendance);
      
      if (success) {
        setSavedMessage('✅ Attendance saved successfully!');
        
        // Clear message after 3 seconds
        setTimeout(() => setSavedMessage(''), 3000);
        
        // Dispatch event to update other components
        window.dispatchEvent(new CustomEvent('attendanceUpdated', {
          detail: { date: dateKey, class: selectedClass, attendance }
        }));
      } else {
        setSavedMessage('❌ Failed to save attendance');
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      setSavedMessage('❌ Error saving attendance');
    } finally {
      setSaving(false);
    }
  };

  const getAttendanceStats = () => {
    const total = students.length;
    const present = Object.values(attendance).filter(Boolean).length;
    const absent = total - present;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    
    return { total, present, absent, percentage };
  };

  const stats = getAttendanceStats();

  return (
    <div className="min-h-screen bg-[#0b1020] text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <Calendar className="w-5 h-5" />
            Back to Admin
          </button>
          
          <h1 className="text-2xl font-bold">Mark Attendance</h1>
          
          <div className="flex items-center gap-4">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-[#0e1628] border border-white/10 rounded-lg px-3 py-2 text-white"
            >
              <option value="11th">11th Class</option>
              <option value="12th">12th Class</option>
            </select>
            
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => handleDateChange(new Date(e.target.value))}
              className="bg-[#0e1628] border border-white/10 rounded-lg px-3 py-2 text-white"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#0e1628] rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Students</p>
                <p className="text-xl font-bold">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#0e1628] rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Check className="w-6 h-6 text-green-400" />
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
                <X className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Absent</p>
                <p className="text-xl font-bold text-red-400">{stats.absent}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#0e1628] rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Attendance %</p>
                <p className="text-xl font-bold text-yellow-400">{stats.percentage}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3">
            <button
              onClick={() => handleMarkAll(true)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              Mark All Present
            </button>
            <button
              onClick={() => handleMarkAll(false)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Mark All Absent
            </button>
          </div>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>

        {/* Success Message */}
        {savedMessage && (
          <div className="mb-4 p-3 bg-green-900/50 border border-green-500 rounded-lg text-green-300 text-center">
            {savedMessage}
          </div>
        )}

        {/* Students List */}
        <div className="bg-[#0e1628] rounded-xl border border-white/5 overflow-hidden">
          <div className="px-6 py-4 bg-[#0a1929] border-b border-white/5">
            <h2 className="text-lg font-semibold">
              {monthNames[selectedDate.getMonth()]} {selectedDate.getDate()}, {selectedDate.getFullYear()} - {selectedClass}
            </h2>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between px-6 py-3 border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-sm font-medium">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-gray-400">{student.stream}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleAttendanceChange(student.id, true)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      attendance[student.id] === true
                        ? 'bg-green-600 border-green-400 text-white'
                        : 'bg-gray-700 border-gray-600 text-gray-400 hover:bg-green-600 hover:border-green-400'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleAttendanceChange(student.id, false)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      attendance[student.id] === false
                        ? 'bg-red-600 border-red-400 text-white'
                        : 'bg-gray-700 border-gray-600 text-gray-400 hover:bg-red-600 hover:border-red-400'
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAttendance;
