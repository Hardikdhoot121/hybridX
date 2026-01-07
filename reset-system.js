// Reset system - Logout Milin, clear demo mode, and reset attendance
// Run this in browser console

console.log('🔄 RESETTING SYSTEM - Clearing Demo Mode');

// 1. Logout Milin Mathur
console.log('🚪 Logging out Milin Mathur...');
localStorage.removeItem('token');
localStorage.removeItem('currentStudent');
console.log('✅ Milin logged out');

// 2. Clear all attendance data
console.log('🧹 Clearing all attendance data...');
localStorage.removeItem('attendanceData');
console.log('✅ All attendance data cleared');

// 3. Clear any other demo data
console.log('🧹 Clearing other demo data...');
const keysToKeep = [];
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && !keysToKeep.includes(key)) {
    console.log(`Removing: ${key}`);
    localStorage.removeItem(key);
  }
}

// 4. Clear any backend data (if backend is running)
console.log('🧹 Clearing backend data...');
fetch('http://localhost:5000/api/attendance', {
  method: 'DELETE'
}).then(() => {
  console.log('✅ Backend attendance data cleared');
}).catch(() => {
  console.log('⚠️ Backend not running, only localStorage cleared');
});

// 5. Set system to clean state
console.log('✅ System reset complete');
console.log('📋 Login page will be first page');
console.log('📅 No attendance data exists');
console.log('👥 Fresh start for all users');

// 6. Redirect to login page
window.location.href = '/login';

console.log('🔄 Redirecting to login page...');
