import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import students11th from '../classData/11th';
import students12th from '../classData/12th';

const StudentsTable = () => {
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('12th');
  const navigate = useNavigate();

  useEffect(() => {
    // Combine students from both classes
    const allStudents = [...students12th, ...students11th];
    setStudents(allStudents);
  }, []);

  const getFilteredStudents = () => {
    return selectedClass === 'all' ? students : students.filter(student => student.class === selectedClass);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      {/* Class Filter */}
      <div className="px-6 py-4 bg-gray-50 border-b">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Student List</h3>
          <select 
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Classes</option>
            <option value="12th">Class 12th</option>
            <option value="11th">Class 11th</option>
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
                      : "bg-green-100 text-green-600"
                    }
                    `}
                >
                  {student.stream}
                </span>
              </td>

              <td className="px-6 py-4 text-gray-600">
                {student.phone}
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
