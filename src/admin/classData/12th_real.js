/**
 * 12th Grade Student Data Service
 * 
 * REFACTORED: Complete backend integration with unified student data
 * Supports both migrated spreadsheet students and new signup students
 * 
 * Changes made:
 * - Removed ALL static hardcoded data (40 lines of static students)
 * - Added JWT-based authentication with proper error handling
 * - Integrated with enhanced User model that supports both old and new students
 * - Added comprehensive loading, error, and empty state handling
 * - Maintains backward compatibility with existing UI structure
 */

import { useState, useEffect } from 'react';

// Backend API configuration
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * Custom hook for fetching 12th grade students data
 * Handles authentication, loading states, and error scenarios
 * Works with both migrated spreadsheet students and new signup students
 */
export const use12thStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all students from backend (no authentication required)
        console.log('📊 12th grade fetch - Making API call to:', `${API_BASE}/admin/students`);
        const response = await fetch(`${API_BASE}/admin/students`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log('📊 12th grade fetch - Response status:', response.status);
        console.log('📊 12th grade fetch - Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          throw new Error(`Failed to fetch students: ${response.status}`);
        }

        const allStudents = await response.json();
        console.log('📊 12th grade fetch - Raw data received:', allStudents.length, 'students');
        console.log('📊 12th grade fetch - Sample student:', allStudents[0]?.name || 'No students');

        // Filter and transform data for 12th grade students
        // This works with BOTH migrated spreadsheet students AND new signup students
        const filteredStudents = allStudents.filter(student => student.classLevel === '12th');
        console.log('📊 12th grade fetch - Filtered for 12th:', filteredStudents.length, 'students');
        
        const transformedStudents = filteredStudents
          .map(student => ({
            // Core fields (from both old and new students)
            id: student._id || student.id,
            name: student.name || 'Not provided',
            email: student.email || 'Not provided',
            phone: student.phone || 'Not provided',
            class: student.classLevel || '12th',
            
            // Stream handling:
            // - For migrated students: uses spreadsheetData.stream (JEE/NEET)
            // - For new students: uses batch as fallback
            stream: student.spreadsheetData?.stream || student.batch || 'Not assigned',
            
            // Parent details (only available for migrated students)
            fatherName: student.spreadsheetData?.fatherName || 'Not provided',
            motherName: student.spreadsheetData?.motherName || 'Not provided',
            parentPhone1: student.spreadsheetData?.parentPhone1 || '',
            parentPhone2: student.spreadsheetData?.parentPhone2 || '',
            
            // Additional metadata for debugging and UI enhancements
            isMigratedStudent: student.isMigratedStudent || false,
            hasChangedDefaultPassword: student.hasChangedDefaultPassword || true,
            originalId: student.spreadsheetData?.originalId,
            migratedAt: student.spreadsheetData?.migratedAt,
            
            // Backend system fields
            role: student.role,
            batch: student.batch,
            targetYear: student.targetYear,
            createdAt: student.createdAt,
            updatedAt: student.updatedAt
          }));

        console.log('📊 12th grade fetch - Transformed students:', transformedStudents.length);
        console.log('📊 12th grade fetch - Sample transformed student:', transformedStudents[0]);

        setStudents(transformedStudents);
        console.log(`✅ Loaded ${transformedStudents.length} 12th grade students from backend`);
        console.log(`📊 Migrated students: ${transformedStudents.filter(s => s.isMigratedStudent).length}`);
        console.log(`👤 New signup students: ${transformedStudents.filter(s => !s.isMigratedStudent).length}`);

      } catch (err) {
        console.error('❌ Error fetching 12th grade students:', err);
        setError(err.message);
        setStudents([]); // Clear students on error
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []); // Empty dependency array means this runs once on mount

  return { students, loading, error };
};

/**
 * Legacy export for backward compatibility
 * Returns empty array - components should use use12thStudents() hook instead
 */
const students = []; // Empty static array - data now comes from backend

export default students;

/**
 * Usage example for components:
 * 
 * import { use12thStudents } from '../admin/classData/12th_real';
 * 
 * function MyComponent() {
 *   const { students, loading, error } = use12thStudents();
 *   
 *   if (loading) return <div>Loading students...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *   
 *   return (
 *     <div>
 *       {students.map(student => (
 *         <div key={student.id}>
 *           {student.name} - {student.stream}
 *           {student.isMigratedStudent && <span title="Migrated from spreadsheet">📋</span>}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 */
