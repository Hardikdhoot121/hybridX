// Attendance data storage service
class AttendanceService {
  constructor() {
    this.initializeStorage();
    this.API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  }

  initializeStorage() {
    try {
      if (!localStorage.getItem('attendanceData')) {
        localStorage.setItem('attendanceData', JSON.stringify({}));
      }
    } catch {
      console.warn('localStorage not available, using memory storage');
      this.attendanceData = {};
    }
  }
  
  // Check if backend is available
  async isBackendAvailable() {
    try {
      const response = await fetch(`${this.API_BASE}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
  
  // Save attendance for a specific date and class
  async saveAttendance(date, classData, attendanceRecord) {
    const dateKey = this.formatDateKey(date);
    const backendAvailable = await this.isBackendAvailable();
    
    if (backendAvailable) {
      // Save to backend
      try {
        const response = await fetch(`${this.API_BASE}/attendance`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: dateKey,
            class: classData,
            attendance: attendanceRecord
          })
        });
        
        if (response.ok) {
          console.log('✅ Attendance saved to backend:', { dateKey, classData });
          // Also save to localStorage as backup
          this.saveToLocalStorage(dateKey, classData, attendanceRecord);
          return true;
        }
      } catch (error) {
        console.warn('⚠️ Backend save failed, using localStorage:', error);
      }
    }
    
    // Fallback to localStorage
    this.saveToLocalStorage(dateKey, classData, attendanceRecord);
    return true;
  }
  
  // Save to localStorage helper
  saveToLocalStorage(dateKey, classData, attendanceRecord) {
    try {
      const attendanceData = this.getAllAttendance();
      
      if (!attendanceData[dateKey]) {
        attendanceData[dateKey] = {};
      }
      
      attendanceData[dateKey][classData] = attendanceRecord;
      
      localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
      console.log('✅ Attendance saved to localStorage:', { dateKey, classData });
    } catch (error) {
      console.warn('Error saving to localStorage:', error);
      if (!this.attendanceData) this.attendanceData = {};
      if (!this.attendanceData[dateKey]) this.attendanceData[dateKey] = {};
      this.attendanceData[dateKey][classData] = attendanceRecord;
    }
  }

  // Get attendance for a specific date and class
  async getAttendance(date, classData) {
    const dateKey = this.formatDateKey(date);
    const backendAvailable = await this.isBackendAvailable();
    
    if (backendAvailable) {
      // Try to get from backend first
      try {
        const response = await fetch(`${this.API_BASE}/attendance/${dateKey}/${classData}`);
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Attendance loaded from backend:', { dateKey, classData });
          // Also cache in localStorage
          this.saveToLocalStorage(dateKey, classData, data);
          return data;
        }
      } catch (error) {
        console.warn('⚠️ Backend fetch failed, using localStorage:', error);
      }
    }
    
    // Fallback to localStorage
    const attendanceData = this.getAllAttendance();
    return attendanceData[dateKey]?.[classData] || {};
  }

  // Get all attendance data
  getAllAttendance() {
    try {
      const data = localStorage.getItem('attendanceData');
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.warn('Error reading from localStorage:', error);
      return this.attendanceData || {};
    }
  }

  // Get attendance for a student across all dates
  async getStudentAttendance(studentId, classData) {
    const backendAvailable = await this.isBackendAvailable();
    
    if (backendAvailable) {
      // Try to get from backend first
      try {
        const response = await fetch(`${this.API_BASE}/attendance`);
        if (response.ok) {
          const allData = await response.json();
          const studentAttendance = {};
          
          if (allData.success && allData.data) {
            Object.keys(allData.data).forEach(dateKey => {
              if (allData.data[dateKey][classData]) {
                if (allData.data[dateKey][classData][studentId] !== undefined) {
                  studentAttendance[dateKey] = allData.data[dateKey][classData][studentId];
                }
              }
            });
          }
          
          console.log('✅ Student attendance loaded from backend:', { studentId, classData });
          // Also cache in localStorage
          this.cacheStudentAttendance(studentId, classData, studentAttendance);
          return studentAttendance;
        }
      } catch (error) {
        console.warn('⚠️ Backend student fetch failed, using localStorage:', error);
      }
    }
    
    // Fallback to localStorage
    const attendanceData = this.getAllAttendance();
    const studentAttendance = {};
    
    Object.keys(attendanceData).forEach(dateKey => {
      if (attendanceData[dateKey][classData]) {
        // Try both string and number ID matching
        const studentIdStr = String(studentId);
        const studentIdNum = parseInt(studentId);
        
        if (attendanceData[dateKey][classData][studentIdStr] !== undefined) {
          studentAttendance[dateKey] = attendanceData[dateKey][classData][studentIdStr];
        } else if (attendanceData[dateKey][classData][studentIdNum] !== undefined) {
          studentAttendance[dateKey] = attendanceData[dateKey][classData][studentIdNum];
        }
      }
    });
    
    return studentAttendance;
  }
  
  // Cache student attendance in localStorage
  cacheStudentAttendance(studentId, classData, studentAttendance) {
    try {
      const attendanceData = this.getAllAttendance();
      
      Object.keys(studentAttendance).forEach(dateKey => {
        if (!attendanceData[dateKey]) {
          attendanceData[dateKey] = {};
        }
        if (!attendanceData[dateKey][classData]) {
          attendanceData[dateKey][classData] = {};
        }
        attendanceData[dateKey][classData][studentId] = studentAttendance[dateKey];
      });
      
      localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
    } catch (error) {
      console.warn('Error caching student attendance:', error);
    }
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

  // Clear attendance for specific dates
  clearAttendanceForDates(dates) {
    try {
      const attendanceData = this.getAllAttendance();
      
      dates.forEach(date => {
        const dateKey = this.formatDateKey(date);
        if (attendanceData[dateKey]) {
          delete attendanceData[dateKey];
          console.log(`Cleared attendance for date: ${dateKey}`);
        }
      });
      
      localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
    } catch (error) {
      console.warn('Error clearing attendance:', error);
    }
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
