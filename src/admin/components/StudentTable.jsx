import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentsTable = () => {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      const { data } = await axios.get(
        "https://hybridx-uhj9.onrender.com/api/admin/students",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          // bearer token addition 
        }
      );

      // bug is that authourization token nhi bheja hua idhar
      setStudents(data);
    };
    fetchStudents();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <table className="w-full text-sm text-left">

        {/* Table Head */}
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Stream</th>
            <th className="px-6 py-4">Phone Number</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>


        {/* Table Body */}
        <tbody className="divide-y">
          {students.map((student) => (
            <tr key={student._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-800">
                {student.name}
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
                <button onClick={() => navigate(`/admin/student/${student._id}`)} className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition" >
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
