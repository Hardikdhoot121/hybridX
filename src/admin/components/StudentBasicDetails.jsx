import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import Section from "./Section";
import Detail from "./Detail";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const StudentBasicDetails = () => {
  const { _id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${API_BASE}/admin/student/${_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStudent(res.data);
    };
    fetchStudent();
  }, [_id]);

  if (!student) return <p className="p-8 text-center text-gray-500">Loading student details...</p>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4">
      <button
        onClick={() => navigate('/admin')}
        className="flex items-center gap-2 text-gray-300 hover:text-white font-medium transition-colors cursor-pointer py-2"
      >
        <ArrowLeft size={18} /> Back to Admin Dashboard
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl border p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800"> {student.name} </h1>
          <p className="text-sm font-semibold text-gray-500"> Class {student.classLevel} • {student.batch} </p>
        </div>
        <span className="px-4 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700"> Active </span>
      </div>

      {/* BASIC DETAILS */}
      <Section title="Basic Information">
        <Detail label="Email" value={student.email} />
        <Detail label="Phone" value={student.phone} />
        <Detail label="Class" value={student.classLevel} />
        <Detail label="Batch" value={student.batch} />
      </Section>

      {/* PARENT DETAILS */}
      <Section title="Parent Information">
        <Detail label="Father Name" value={student.fatherName || "-"} />
        <Detail label="Mother Name" value={student.motherName || "-"} />
        <Detail label="Parent Phone 1" value={student.parentPhone1 || "-"} />
        <Detail label="Parent Phone 2" value={student.parentPhone2 || "-"} />
      </Section>
      {/* ACADEMIC SUMMARY (Placeholder) */}
      <Section title="Academic Summary">
        <Detail label="Stream" value={student.stream || (student.batch === "Batch 1" ? "JEE" : "NEET")} />
        <Detail label="Attendance" value={student.attendancePercentage || "0%"} />
        <Detail label="Average Score" value={student.averageScore || "82%"} />
        <Detail label="Weekly Questions" value={student.weeklyQuestions || "0 / 30"} />
      </Section>

      {/* ADMIN ACTIONS */}
      <div className="bg-white rounded-xl border p-6 flex gap-4">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"> Edit Student </button>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"> Block Student </button>
      </div>
      <br></br>
    </div>
  );
};

export default StudentBasicDetails;
