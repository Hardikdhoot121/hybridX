import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { use11thStudents } from '../classData/11th_real';
import { use12thStudents } from '../classData/12th_real';

const StudentsTable = () => {
  const [selectedClass, setSelectedClass] = useState('12th');
  const navigate = useNavigate();
  
  // Fetch dynamic student data from backend
  const { students: students11th, loading: loading11th, error: error11th } = use11thStudents();
  const { students: students12th, loading: loading12th, error: error12th } = use12thStudents();

  // Combine and sort students by class (11th first, then 12th)
  const allStudents = [...students11th, ...students12th].sort((a, b) => {
    if (a.class === '11th' && b.class === '12th') return -1;
    if (a.class === '12th' && b.class === '11th') return 1;
    return 0;
  });
  const loading = loading11th || loading12th;
  const error = error11th || error12th;

  // Debug logging
  console.log('🔍 StudentTable Debug:');
  console.log('  students11th:', students11th.length, 'loading:', loading11th, 'error:', error11th);
  console.log('  students12th:', students12th.length, 'loading:', loading12th, 'error:', error12th);
  console.log('  allStudents:', allStudents.length);
  console.log('  loading:', loading);
  console.log('  error:', error);
  console.log('  selectedClass:', selectedClass);

  const getFilteredStudents = () => {
    return selectedClass === 'all' ? allStudents : allStudents.filter(student => student.class === selectedClass);
  };

  // Handle loading state
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#42BA96]"></div>
          <p className="mt-2 text-gray-600">Loading student data...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️ Error</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-[#42BA96] text-white rounded-lg hover:bg-[#369877] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Handle empty state
  if (!loading && allStudents.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="text-center">
          <div className="text-gray-400 mb-2">📚</div>
          <p className="text-gray-600">No students found</p>
          <p className="text-sm text-gray-500 mt-1">Students will appear here once they are added to the system</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      {/* Class Filter */}
      <div className="px-6 py-4 bg-gray-50 border-b">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Student List ({getFilteredStudents().length} students)</h3>
          <select 
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border border-[#42BA96] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#42BA96] bg-white text-gray-700 font-medium"
          >
            <option value="all">All Classes ({allStudents.length} students)</option>
            <option value="12th">Class 12th ({students12th.length} students)</option>
            <option value="11th">Class 11th ({students11th.length} students)</option>
          </select>
        </div>
      </div>

      <table className="w-full text-sm text-left">

        {/* Table Head */}
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Class</th>
            <th className="px-6 py-4">Stream</th>
            <th className="px-6 py-4">Phone Number</th>
            <th className="px-6 py-4">Attendance</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y">
          {getFilteredStudents().map((student) => (
            <tr key={student.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-800">
                {student.name}
              </td>

              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                  {student.class}
                </span>
              </td>

              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${student.stream === "JEE"
                      ? "bg-blue-100 text-blue-600"
                      : student.stream === "NEET"
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-600"
                    }
                    `}
                >
                  {student.stream}
                </span>
              </td>

              <td className="px-6 py-4 text-gray-600">
                {student.phone}
              </td>

              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  Math.random() > 0.3 ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                }`}>
                  {Math.floor(Math.random() * 30 + 70)}%
                </span>
              </td>

              <td className="px-6 py-4 text-right">
                <button onClick={() => navigate(`/admin/student/${student.id}`)} className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition" >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default StudentsTable;
