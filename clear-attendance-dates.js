// Script to clear attendance for dates 4 and 5 of current month
// Run this in browser console to remove unwanted attendance data

// Get current month and year
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = String(now.getMonth() + 1).padStart(2, '0');

// Create dates to clear (4th and 5th of current month)
const datesToClear = [
  `${currentYear}-${currentMonth}-04`,
  `${currentYear}-${currentMonth}-05`
];

console.log('Clearing attendance for dates:', datesToClear);

// Get current attendance data
const attendanceData = JSON.parse(localStorage.getItem('attendanceData') || '{}');

// Clear the specific dates
datesToClear.forEach(dateKey => {
  if (attendanceData[dateKey]) {
    delete attendanceData[dateKey];
    console.log(`✅ Cleared attendance for ${dateKey}`);
  }
});

// Save updated data back to localStorage
localStorage.setItem('attendanceData', JSON.stringify(attendanceData));

console.log('✅ Attendance clearing completed!');
console.log('📅 Refresh the calendar to see changes');
