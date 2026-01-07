// Script to clear all previous attendance data except today
// Run this in browser console to remove old attendance records

// Get today's date
const today = new Date();
const todayYear = today.getFullYear();
const todayMonth = String(today.getMonth() + 1).padStart(2, '0');
const todayDay = String(today.getDate()).padStart(2, '0');
const todayDateKey = `${todayYear}-${todayMonth}-${todayDay}`;

console.log('🗓️ Today is:', todayDateKey);
console.log('🧹 Clearing all previous attendance data...');

// Get current attendance data
const attendanceData = JSON.parse(localStorage.getItem('attendanceData') || '{}');

// Clear all dates except today
Object.keys(attendanceData).forEach(dateKey => {
  if (dateKey !== todayDateKey) {
    delete attendanceData[dateKey];
    console.log(`✅ Cleared attendance for ${dateKey}`);
  }
});

// Save updated data back to localStorage
localStorage.setItem('attendanceData', JSON.stringify(attendanceData));

console.log('✅ Previous attendance data cleared!');
console.log('📅 Only today\'s attendance remains');
console.log('🔄 Refresh the calendar to see changes');

// Trigger attendance update event to refresh calendar
window.dispatchEvent(new CustomEvent('attendanceUpdated', {
  detail: { 
    date: today, 
    action: 'cleared-previous' 
  }
}));
