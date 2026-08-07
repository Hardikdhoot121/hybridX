import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Attach Bearer token to every request
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

//helper func to convert date format to "YYYY-MM-DD" format
const helper = (date) => {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

class AttendanceService {

  // 1. admin: Save attendance for a class on a specific date
  async saveAttendance(date, classLevel, attendanceRecord) {
    try {
      const res = await axios.post(
        `${API_BASE}/attendance/save`,
        { date: helper(date), classLevel, attendanceRecord },
        { headers: getAuthHeaders() }
      );
      return res.data.success;
    } catch (error) {
      console.error('❌ saveAttendance failed:', error.response?.data || error.message);
      return false;
    }
  }

  // 2. admin: Fetch attendance sheet for a class on a specific date
  async getAttendance(date, classLevel) {
    try {
      const res = await axios.get(`${API_BASE}/attendance`, {
        params: { date: helper(date), classLevel },
        headers: getAuthHeaders()
      });
      return res.data.data || {};
    } catch (error) {
      console.error('❌ getAttendance failed:', error.response?.data || error.message);
      return {};
    }
  }

  // 3. student: Fetch own attendance calendar (all dates)
  async getStudentAttendance(studentId, classLevel) {
    try {
      const res = await axios.get(`${API_BASE}/attendance/student`, {
        params: { studentId, classLevel },
        headers: getAuthHeaders()
      });
      return res.data.data || {};
    } catch (error) {
      console.error('❌ getStudentAttendance failed:', error.response?.data || error.message);
      return {};
    }
  }

  // 4. admin: Fetch stats (present %, total, absent) for a class on a date
  async getAttendanceStats(date, classLevel) {
    try {
      const res = await axios.get(`${API_BASE}/attendance/stats`, {
        params: { date: helper(date), classLevel },
        headers: getAuthHeaders()
      });
      return res.data.data || { present: 0, absent: 0, total: 0, percentage: 0 };
    } catch (error) {
      console.error(' getAttendanceStats failed:', error.response?.data || error.message);
      return { present: 0, absent: 0, total: 0, percentage: 0 };
    }
  }

  // ulitliy-> can be used anywhere where the format we want should be in yyyy-mm-dd
  formatDateKey(date) {
    return helper(date);
  }
}

export default new AttendanceService();
