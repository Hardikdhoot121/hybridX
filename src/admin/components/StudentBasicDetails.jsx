import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Section from "./Section";
import Detail from "./Detail";

const StudentBasicDetails = () => {
  const { _id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      const res = await axios.get(
        `https://hybridx-uhj9.onrender.com/api/admin/student/${_id}`
      );
      setStudent(res.data);
    };
    fetchStudent();
  }, [_id]);

  if (!student) return <p>Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800"> {student.name} </h1>
          <p className="text-sm font-semibold text-gray-500"> Class {student.classLevel} • {student.batch} </p>
        </div> <span className="px-4 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700"> Active </span> </div>
      {/* BASIC DETAILS */}
      <Section title="Basic Information">
        <Detail label="Email" value={student.email} />
        <Detail label="Phone" value={student.phone} />
        <Detail label="Class" value={student.classLevel} />
        <Detail label="Batch" value={student.batch} />
      </Section>
      {/* PARENT DETAILS */}
      <Section title="Parent Information">
        <Detail label="Parent Name" value={student.fatherName || "-"} />
        <Detail label="Parent Name" value={student.motherName || "-"} />
        <Detail label="Parent Phone 1" value={student.parentPhone1 || "-"} />
        <Detail label="Parent Phone 2" value={student.parentPhone2 || "-"} />
      </Section>
      {/* ACADEMIC SUMMARY (Placeholder) */}
      <Section title="Academic Summary">
        <Detail label="Stream" value="JEE / NEET" />
        <Detail label="Attendance" value="92%" />
        <Detail label="Average Score" value="82%" />
        <Detail label="Completed Chapters" value="48 / 65" />
      </Section> {/* ADMIN ACTIONS */} <div className="bg-white rounded-xl border p-6 flex gap-4">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"> Edit Student </button>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"> Block Student </button>
      </div>
      <br></br>
    </div>);
};

export default StudentBasicDetails;
