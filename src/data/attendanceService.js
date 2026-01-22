// Attendance data storage service
class AttendanceService {
  constructor() {
    this.initializeStorage();
    this.API_BASE = import.meta.env.VITE_API_BASE_URL || "https://hybridx-uhj9.onrender.com/api";
  }

  initializeStorage() {
    try {
      if (!localStorage.getItem('attendanceData')) {
        localStorage.setItem('attendanceData', JSON.stringify({}));
        console.log('📦 Created new attendance storage in localStorage');
      } else {
        console.log('📦 Found existing attendance storage in localStorage');
        // Verify data integrity
        const data = localStorage.getItem('attendanceData');
        const parsed = JSON.parse(data);
        console.log('📊 Current attendance data:', {
          totalDates: Object.keys(parsed).length,
          dates: Object.keys(parsed),
          dataSize: data.length
        });
      }
      
      // Initialize backup storage if not exists
      if (!localStorage.getItem('attendanceDataBackup')) {
        localStorage.setItem('attendanceDataBackup', JSON.stringify({}));
        console.log('📦 Created attendance backup storage');
      }
      
      // Check for data corruption and restore from backup if needed
      this.validateAndRestoreData();
      
    } catch (error) {
      console.error('❌ Error initializing localStorage:', error);
      this.attendanceData = {};
      // Create fresh storage if corrupted
      try {
        localStorage.setItem('attendanceData', JSON.stringify({}));
        localStorage.setItem('attendanceDataBackup', JSON.stringify({}));
      } catch (backupError) {
        console.error('❌ Failed to create fresh storage:', backupError);
      }
    }
  }
  
  // Validate data integrity and restore from backup if needed
  validateAndRestoreData() {
    try {
      const currentData = localStorage.getItem('attendanceData');
      const backupData = localStorage.getItem('attendanceDataBackup');
      
      if (!currentData || currentData === 'undefined') {
        console.log('⚠️ Current data corrupted, attempting restore from backup');
        if (backupData && backupData !== 'undefined') {
          localStorage.setItem('attendanceData', backupData);
          console.log('✅ Data restored from backup');
        } else {
          localStorage.setItem('attendanceData', JSON.stringify({}));
          console.log('📦 Created fresh data storage');
        }
      }
      
      // Create backup of current valid data
      const validData = localStorage.getItem('attendanceData');
      if (validData && validData !== 'undefined') {
        localStorage.setItem('attendanceDataBackup', validData);
        console.log('💾 Backup updated');
      }
    } catch (error) {
      console.error('❌ Error in data validation:', error);
    }
  }
  
  // Force data backup after important operations
  createBackup() {
    try {
      const currentData = localStorage.getItem('attendanceData');
      if (currentData && currentData !== 'undefined') {
        localStorage.setItem('attendanceDataBackup', currentData);
        console.log('💾 Manual backup created');
        return true;
      }
    } catch (error) {
      console.error('❌ Error creating backup:', error);
    }
    return false;
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
  
  // Get auth headers for API calls
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }
  
  // Save attendance for a specific date and class
  async saveAttendance(date, classData, attendanceRecord) {
    const dateKey = this.formatDateKey(date);
    
    try {
      console.log('💾 saveAttendance called with:', { 
        date: dateKey, 
        classData, 
        attendanceRecord,
        recordKeys: Object.keys(attendanceRecord),
        recordValues: Object.values(attendanceRecord)
      });
      
      // Try to save to backend first
      const backendSuccess = await this.saveToBackend(date, classData, attendanceRecord);
      
      if (backendSuccess) {
        console.log('✅ Attendance saved to backend successfully');
        
        // Also save to localStorage as backup
        const saveSuccess = this.saveToLocalStorage(dateKey, classData, attendanceRecord);
        
        if (!saveSuccess) {
          console.warn('⚠️ Backend save succeeded but localStorage backup failed');
        }
        
        // Dispatch event to notify all components (including student calendars)
        console.log('📡 Dispatching attendanceUpdated event with:', { 
          date: dateKey, 
          class: classData, 
          attendance: attendanceRecord,
          studentIds: Object.keys(attendanceRecord)
        });
        
        window.dispatchEvent(new CustomEvent('attendanceUpdated', {
          detail: { date: dateKey, class: classData, attendance: attendanceRecord }
        }));
        
        console.log('✅ Attendance saved permanently:', { dateKey, classData, recordCount: Object.keys(attendanceRecord).length });
        return true;
      } else {
        console.warn('⚠️ Backend save failed, falling back to localStorage only');
        
        // Fallback to localStorage only
        const saveSuccess = this.saveToLocalStorage(dateKey, classData, attendanceRecord);
        
        if (saveSuccess) {
          // Dispatch event for local updates
          window.dispatchEvent(new CustomEvent('attendanceUpdated', {
            detail: { date: dateKey, class: classData, attendance: attendanceRecord }
          }));
          
          console.log('✅ Attendance saved to localStorage fallback:', { dateKey, classData });
          return true;
        } else {
          console.error('❌ Both backend and localStorage save failed');
          return false;
        }
      }
    } catch (error) {
      console.error('❌ Error saving attendance:', error);
      
      // Try localStorage as final fallback
      try {
        const dateKey = this.formatDateKey(date);
        const saveSuccess = this.saveToLocalStorage(dateKey, classData, attendanceRecord);
        
        if (saveSuccess) {
          window.dispatchEvent(new CustomEvent('attendanceUpdated', {
            detail: { date: dateKey, class: classData, attendance: attendanceRecord }
          }));
          console.log('✅ Attendance saved to localStorage after error:', { dateKey, classData });
          return true;
        }
      } catch (fallbackError) {
        console.error('❌ Fallback save also failed:', fallbackError);
      }
      
      return false;
    }
  }
  
  // Save to backend API
  async saveToBackend(date, classData, attendanceRecord) {
    try {
      const headers = this.getAuthHeaders();
      if (!headers) {
        console.warn('⚠️ No auth token available, cannot save to backend');
        return false;
      }

      const response = await fetch(`${this.API_BASE}/attendance/save`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          date: this.formatDateKey(date),
          classLevel: classData,
          attendanceRecord
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Backend save successful:', result);
        return true;
      } else {
        const error = await response.json();
        console.error('❌ Backend save failed:', error);
        return false;
      }
    } catch (error) {
      console.error('❌ Error saving to backend:', error);
      return false;
    }
  }

  // Save to localStorage helper
  saveToLocalStorage(dateKey, classData, attendanceRecord) {
    try {
      // Validate data before saving
      this.validateAndRestoreData();
      
      const attendanceData = this.getAllAttendance();
      
      // Initialize date object if it doesn't exist
      if (!attendanceData[dateKey]) {
        attendanceData[dateKey] = {};
      }
      
      // COMPLETELY REPLACE existing attendance for this class and date
      // This ensures that if you change from present to absent, it updates properly
      attendanceData[dateKey][classData] = { ...attendanceRecord };
      
      // Save to localStorage with verification
      localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
      
      // Create backup immediately after successful save
      this.createBackup();
      
      // Verify the save was successful
      const verifyData = localStorage.getItem('attendanceData');
      const verifyParsed = JSON.parse(verifyData);
      const isSaved = verifyParsed[dateKey]?.[classData];
      
      console.log('✅ Attendance saved to localStorage:', { dateKey, classData, attendanceRecord });
      console.log('📝 Saved attendance keys:', Object.keys(attendanceRecord));
      console.log('🔄 Replaced any existing attendance for this date and class');
      console.log('🔍 Verification - Data exists in localStorage:', !!isSaved);
      console.log('📊 Total stored dates:', Object.keys(verifyParsed).length);
      
      if (!isSaved) {
        console.error('❌ CRITICAL: Attendance save verification failed!');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('❌ Error saving to localStorage:', error);
      if (!this.attendanceData) this.attendanceData = {};
      if (!this.attendanceData[dateKey]) this.attendanceData[dateKey] = {};
      // Also replace in memory storage
      this.attendanceData[dateKey][classData] = { ...attendanceRecord };
      return false;
    }
  }

  // Get attendance for a specific date and class
  async getAttendance(date, classData) {
    const dateKey = this.formatDateKey(date);
    
    try {
      // Try to get from backend first
      const backendData = await this.getFromBackend(date, classData);
      
      if (backendData) {
        console.log('✅ Retrieved attendance from backend:', { dateKey, classData, recordCount: Object.keys(backendData).length });
        
        // Also cache in localStorage for offline access
        this.cacheInLocalStorage(dateKey, classData, backendData);
        
        return backendData;
      } else {
        console.log('⚠️ Backend returned no data, checking localStorage cache');
        
        // Fallback to localStorage
        const attendanceData = this.getAllAttendance();
        const classAttendance = attendanceData[dateKey]?.[classData];
        const result = classAttendance || {};
        
        console.log('📅 Using localStorage attendance:', { 
          dateKey, 
          classData, 
          recordCount: Object.keys(result).length,
          hasData: Object.keys(result).length > 0
        });
        
        return result;
      }
    } catch (error) {
      console.error('❌ Error loading attendance:', error);
      
      // Final fallback to localStorage
      try {
        const attendanceData = this.getAllAttendance();
        const classAttendance = attendanceData[dateKey]?.[classData];
        const result = classAttendance || {};
        
        console.log('📅 Using localStorage fallback after error:', { 
          dateKey, 
          classData, 
          recordCount: Object.keys(result).length
        });
        
        return result;
      } catch (fallbackError) {
        console.error('❌ Even localStorage fallback failed:', fallbackError);
        return {};
      }
    }
  }

  // Get all attendance data
  getAllAttendance() {
    try {
      // Validate data before retrieving
      this.validateAndRestoreData();
      
      const data = localStorage.getItem('attendanceData');
      if (data && data !== 'undefined') {
        const parsed = JSON.parse(data);
        console.log('📦 Raw localStorage data:', parsed);
        console.log('📊 Available dates:', Object.keys(parsed));
        console.log('🔍 Jan 9 data exists:', !!parsed['2026-01-09']);
        if (parsed['2026-01-09']) {
          console.log('📅 Jan 9 class data:', parsed['2026-01-09']);
          console.log('📚 Jan 9 12th class:', parsed['2026-01-09']['12th']);
        }
        return parsed;
      } else {
        console.log('📦 No attendance data found in localStorage, attempting restore from backup');
        // Try to restore from backup
        const backupData = localStorage.getItem('attendanceDataBackup');
        if (backupData && backupData !== 'undefined') {
          localStorage.setItem('attendanceData', backupData);
          console.log('✅ Data restored from backup');
          return JSON.parse(backupData);
        } else {
          console.log('📦 Creating fresh attendance storage');
          const freshData = {};
          localStorage.setItem('attendanceData', JSON.stringify(freshData));
          return freshData;
        }
      }
    } catch (error) {
      console.warn('Error reading from localStorage:', error);
      // Try to restore from backup on error
      try {
        const backupData = localStorage.getItem('attendanceDataBackup');
        if (backupData && backupData !== 'undefined') {
          localStorage.setItem('attendanceData', backupData);
          console.log('✅ Data restored from backup after error');
          return JSON.parse(backupData);
        }
      } catch (backupError) {
        console.error('❌ Backup restoration failed:', backupError);
      }
      return {};
    }
  }

  // Get attendance from backend API
  async getFromBackend(date, classData) {
    try {
      const headers = this.getAuthHeaders();
      if (!headers) {
        console.warn('⚠️ No auth token available, cannot fetch from backend');
        return null;
      }

      const response = await fetch(`${this.API_BASE}/attendance?date=${this.formatDateKey(date)}&classLevel=${classData}`, {
        method: 'GET',
        headers
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Backend fetch successful:', result);
        return result.data || {};
      } else {
        const error = await response.json();
        console.error('❌ Backend fetch failed:', error);
        return null;
      }
    } catch (error) {
      console.error('❌ Error fetching from backend:', error);
      return null;
    }
  }

  // Cache data in localStorage
  cacheInLocalStorage(dateKey, classData, attendanceData) {
    try {
      const allData = this.getAllAttendance();
      
      if (!allData[dateKey]) {
        allData[dateKey] = {};
      }
      
      allData[dateKey][classData] = { ...attendanceData };
      
      localStorage.setItem('attendanceData', JSON.stringify(allData));
      this.createBackup();
      
      console.log('💾 Cached backend data in localStorage:', { dateKey, classData });
    } catch (error) {
      console.error('❌ Error caching in localStorage:', error);
    }
  }

  // Get student attendance from backend or localStorage
  async getStudentAttendance(studentId, classData) {
    try {
      // Try backend first
      const headers = this.getAuthHeaders();
      if (headers) {
        const response = await fetch(`${this.API_BASE}/attendance/student?studentId=${studentId}&classLevel=${classData}`, {
          method: 'GET',
          headers
        });

        if (response.ok) {
          const result = await response.json();
          console.log('✅ Student attendance from backend:', result.data);
          
          // Cache in localStorage for offline access
          this.cacheStudentAttendance(studentId, classData, result.data);
          
          return result.data || {};
        } else {
          console.warn('⚠️ Backend student attendance fetch failed, using localStorage');
        }
      }
    } catch (error) {
      console.error('❌ Error fetching student attendance from backend:', error);
    }
    
    // Fallback to localStorage
    return this.getStudentAttendanceFromLocal(studentId, classData);
  }
  
  // Get student attendance from localStorage (helper method)
  getStudentAttendanceFromLocal(studentId, classData) {
    const attendanceData = this.getAllAttendance();
    const studentAttendance = {};
    
    console.log('🔍 Looking for student attendance:', { studentId, classData, studentIdType: typeof studentId });
    
    Object.keys(attendanceData).forEach(dateKey => {
      if (attendanceData[dateKey][classData]) {
        const classAttendance = attendanceData[dateKey][classData];
        console.log(`📅 Checking date ${dateKey}:`, Object.keys(classAttendance));
        
        // Try both string and number ID matching
        const studentIdStr = String(studentId);
        const studentIdNum = parseInt(studentId);
        
        if (classAttendance[studentIdStr] !== undefined) {
          studentAttendance[dateKey] = classAttendance[studentIdStr];
          console.log(`✅ Found attendance for ${studentIdStr} on ${dateKey}:`, classAttendance[studentIdStr]);
        } else if (classAttendance[studentIdNum] !== undefined) {
          studentAttendance[dateKey] = classAttendance[studentIdNum];
          console.log(`✅ Found attendance for ${studentIdNum} on ${dateKey}:`, classAttendance[studentIdNum]);
        }
      }
    });
    
    console.log('📊 Final student attendance:', studentAttendance);
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
