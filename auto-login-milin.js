// Auto-login script for Milin (Student ID 1)
// Run this in browser console to automatically log in as Milin

const milinData = {
  id: 1,
  name: "Milin mathur",
  email: "milinmathur0@gmail.com",
  phone: "6378038398",
  class: "12th",
  stream: "JEE",
  fatherName: "Not provided",
  motherName: "Not provided",
  parentPhone1: "",
  parentPhone2: "",
};

// Store in localStorage
localStorage.setItem("currentStudent", JSON.stringify(milinData));
localStorage.setItem("token", "student-token-1");

// Redirect to dashboard
window.location.href = "/dashboard";

console.log("Milin logged in successfully!");
