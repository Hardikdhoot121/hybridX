// Attendance data storage service
class AttendanceService {
  constructor() {
    this.initializeStorage();
  }

  initializeStorage() {
    if (!localStorage.getItem('attendanceData')) {
      localStorage.setItem('attendanceData', JSON.stringify({}));
    }
  }

  // Save attendance for a specific date and class
  saveAttendance(date, classData, attendanceRecord) {
    const attendanceData = this.getAllAttendance();
    const dateKey = this.formatDateKey(date);
    
    if (!attendanceData[dateKey]) {
      attendanceData[dateKey] = {};
    }
    
    attendanceData[dateKey][classData] = attendanceRecord;
    
    localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
  }

  // Get attendance for a specific date and class
  getAttendance(date, classData) {
    const attendanceData = this.getAllAttendance();
    const dateKey = this.formatDateKey(date);
    
    return attendanceData[dateKey]?.[classData] || {};
  }

  // Get all attendance data
  getAllAttendance() {
    const data = localStorage.getItem('attendanceData');
    return data ? JSON.parse(data) : {};
  }

  // Get attendance for a student across all dates
  getStudentAttendance(studentId, classData) {
    const attendanceData = this.getAllAttendance();
    const studentAttendance = {};
    
    Object.keys(attendanceData).forEach(dateKey => {
      if (attendanceData[dateKey][classData] && attendanceData[dateKey][classData][studentId] !== undefined) {
        studentAttendance[dateKey] = attendanceData[dateKey][classData][studentId];
      }
    });
    
    return studentAttendance;
  }

  // Format date as YYYY-MM-DD
  formatDateKey(date) {
    if (typeof date === 'string') {
      return date;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Get attendance statistics for a class on a specific date
  getAttendanceStats(date, classData, totalStudents) {
    const attendance = this.getAttendance(date, classData);
    const presentCount = Object.values(attendance).filter(Boolean).length;
    const absentCount = totalStudents - presentCount;
    const percentage = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;
    
    return {
      present: presentCount,
      absent: absentCount,
      total: totalStudents,
      percentage: percentage
    };
  }
}

export default new AttendanceService();
