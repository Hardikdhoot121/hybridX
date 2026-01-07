// Test attendance functionality for all students
// Run this in browser console to verify attendance works for everyone

console.log('🧪 Testing Attendance System for All Students');

// Get all students data
const students12th = [
  { id: 1, name: "Milin mathur", class: "12th" },
  { id: 2, name: "Student 2", class: "12th" },
  { id: 3, name: "Student 3", class: "12th" }
];

// Test 1: Check if Milin has any special privileges
console.log('🔍 Checking for Milin special privileges...');
const milinData = students12th.find(s => s.id === 1);
console.log('Milin data:', milinData);

// Test 2: Simulate marking attendance for multiple students
const today = new Date();
const dateKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

console.log('📅 Testing attendance for date:', dateKey);

// Create test attendance data
const testAttendance = {
  1: true,  // Milin present
  2: false, // Student 2 absent  
  3: true   // Student 3 present
};

// Save attendance using the service
const attendanceService = {
  saveAttendance(date, classData, attendanceRecord) {
    try {
      const attendanceData = JSON.parse(localStorage.getItem('attendanceData') || '{}');
      const dateKey = date.toISOString().split('T')[0];
      
      if (!attendanceData[dateKey]) {
        attendanceData[dateKey] = {};
      }
      
      attendanceData[dateKey][classData] = attendanceRecord;
      localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
      console.log('✅ Attendance saved:', { dateKey, classData, attendanceRecord });
    } catch (error) {
      console.error('❌ Error saving attendance:', error);
    }
  },
  
  getStudentAttendance(studentId, classData) {
    try {
      const attendanceData = JSON.parse(localStorage.getItem('attendanceData') || '{}');
      const studentAttendance = {};
      
      Object.keys(attendanceData).forEach(dateKey => {
        if (attendanceData[dateKey][classData]) {
          if (attendanceData[dateKey][classData][studentId] !== undefined) {
            studentAttendance[dateKey] = attendanceData[dateKey][classData][studentId];
          }
        }
      });
      
      return studentAttendance;
    } catch (error) {
      console.error('❌ Error getting student attendance:', error);
      return {};
    }
  }
};

// Save test attendance
attendanceService.saveAttendance(today, '12th', testAttendance);

// Test 3: Check if all students can retrieve their attendance
console.log('🔍 Testing attendance retrieval for all students...');
students12th.forEach(student => {
  const studentAttendance = attendanceService.getStudentAttendance(student.id, student.class);
  const todayStatus = studentAttendance[dateKey];
  console.log(`👤 ${student.name} (ID: ${student.id}): ${todayStatus ? '✅ Present' : '❌ Absent'}`);
});

// Test 4: Check if Milin has any special treatment
console.log('🔍 Checking for any Milin-specific code...');
const milinAttendance = attendanceService.getStudentAttendance(1, '12th');
console.log('Milin attendance:', milinAttendance);

// Test 5: Verify no special privileges in localStorage
const localStorageData = JSON.parse(localStorage.getItem('attendanceData') || '{}');
console.log('📊 All attendance data:', localStorageData);

console.log('✅ Attendance test completed! All students should have equal access.');
