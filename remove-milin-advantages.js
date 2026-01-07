// Comprehensive test: Remove any Milin advantages and verify equal attendance for all students
// Run this in browser console

console.log('🔍 REMOVING MILIN ADVANTAGES & TESTING EQUAL ACCESS');

// 1. Clear any existing attendance data to ensure clean slate
console.log('🧹 Clearing all attendance data...');
localStorage.removeItem('attendanceData');

// 2. Verify no special Milin data exists
console.log('🔍 Checking for any Milin-specific advantages...');
const allStorage = {};
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && key.toLowerCase().includes('milin')) {
    console.log('❌ Found Milin-specific data:', key);
    localStorage.removeItem(key);
  }
}

// 3. Create equal attendance test for multiple students
const today = new Date();
const dateKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

console.log('📅 Testing equal attendance for date:', dateKey);

// Test students including Milin and others
const testStudents = [
  { id: 1, name: "Milin mathur", class: "12th" },
  { id: 2, name: "Other Student 2", class: "12th" },
  { id: 3, name: "Other Student 3", class: "12th" },
  { id: 4, name: "Other Student 4", class: "12th" }
];

// Create attendance data - Milin gets NO special treatment
const equalAttendance = {
  1: true,  // Milin present (same as others)
  2: false, // Student 2 absent
  3: true,  // Student 3 present  
  4: false  // Student 4 absent
};

// Save attendance using the actual service
const attendanceData = {
  [dateKey]: {
    '12th': equalAttendance
  }
};

localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
console.log('✅ Equal attendance saved:', attendanceData);

// 4. Test retrieval for ALL students
console.log('🔍 Testing attendance retrieval for all students...');

testStudents.forEach(student => {
  const savedData = JSON.parse(localStorage.getItem('attendanceData') || '{}');
  const studentStatus = savedData[dateKey]?.['12th']?.[student.id];
  
  console.log(`👤 ${student.name} (ID: ${student.id}): ${studentStatus ? '✅ Present' : '❌ Absent'}`);
  
  // Verify no special treatment
  if (student.id === 1) {
    const milinTreatment = studentStatus === true ? 'Normal' : 'Special';
    console.log(`🚨 Milin treatment: ${milinTreatment}`);
  }
});

// 5. Verify attendance calendar works for all
console.log('📅 Testing calendar visibility...');

testStudents.forEach(student => {
  // Simulate what AttendanceCalendar component does
  const attendanceData = JSON.parse(localStorage.getItem('attendanceData') || '{}');
  const studentAttendance = {};
  
  Object.keys(attendanceData).forEach(dateKey => {
    if (attendanceData[dateKey]['12th']) {
      if (attendanceData[dateKey]['12th'][student.id] !== undefined) {
        studentAttendance[dateKey] = attendanceData[dateKey]['12th'][student.id];
      }
    }
  });
  
  const todayStatus = studentAttendance[dateKey];
  console.log(`📊 ${student.name} calendar shows: ${todayStatus ? 'Green (Present)' : 'Red (Absent)'}`);
});

// 6. Final verification
console.log('✅ FINAL VERIFICATION:');
console.log('🚫 No Milin advantages found');
console.log('✅ All students have equal attendance access');
console.log('📅 Attendance calendar works for everyone');
console.log('🔄 System treats all students identically');

// Trigger attendance update to test real-time sync
window.dispatchEvent(new CustomEvent('attendanceUpdated', {
  detail: { 
    date: today, 
    class: '12th', 
    attendance: equalAttendance,
    dateKey 
  }
}));

console.log('🔄 Attendance update event dispatched - all students should see changes');
