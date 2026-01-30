"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { Plus, CalendarDays, Search, Check, X, User } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// ✅ Interfaces defined
interface Student {
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface AttendanceRecord {
  attendance_id: string;
  date: string;
  status: string;
  remarks: string;
  course: {
    name: string;
  } | null;
}

export default function AttendanceDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // 1️⃣ Load Students List for Dropdown
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await api.get("/students?limit=100");
        setStudents(data.data);
      } catch (error) {
        toast.error("Failed to load students");
      }
    };
    fetchStudents();
  }, []);

  // 2️⃣ Fetch Attendance when Student is Selected
  useEffect(() => {
    if (!selectedStudent) {
      setAttendance([]);
      return;
    }

    const fetchAttendance = async () => {
      setLoading(true);
      try {
        // ✅ API: GET /attendance/student/:id
        console.log(`Fetching attendance for: ${selectedStudent}`);
        const { data } = await api.get(
          `/attendance/student/${selectedStudent}`,
        );
        setAttendance(data);
      } catch (error) {
        toast.error("Failed to fetch attendance records");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [selectedStudent]);

  return (
    <div>
      <Toaster />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-black text-2xl font-bold flex items-center gap-2">
          <CalendarDays className="text-blue-600" /> Attendance Manager
        </h1>
        <Link
          href="/attendance/add"
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 shadow"
        >
          <Plus size={18} /> Mark Attendance
        </Link>
      </div>

      {/* 🔍 Filter Area */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 border-l-4 border-blue-500">
        <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
          <Search size={16} /> View History By Student
        </h2>
        <select
          className="w-full p-3 border rounded-lg bg-gray-50 text-gray-800 text-lg outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          <option value="">-- Select Student --</option>
          {students.map((s) => (
            <option key={s.student_id} value={s.student_id}>
              {s.first_name} {s.last_name} ({s.email})
            </option>
          ))}
        </select>
      </div>

      {/* 📊 Results Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden min-h-[300px]">
        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading attendance records...
          </div>
        ) : !selectedStudent ? (
          <div className="p-10 text-center flex flex-col items-center text-gray-400">
            <User size={48} className="mb-2 opacity-50" />
            <p>
              Please select a student above to see their attendance history.
            </p>
          </div>
        ) : attendance.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No attendance records found for this student.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-bold">
              <tr>
                <th className="p-4 border-b">Date</th>
                <th className="p-4 border-b">Course Name</th>
                <th className="p-4 border-b">Status</th>
                <th className="p-4 border-b">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record) => (
                <tr
                  key={record.attendance_id}
                  className="hover:bg-gray-50 border-b last:border-0"
                >
                  <td className="p-4 font-medium text-gray-800">
                    <span className="flex items-center gap-2">
                      <CalendarDays size={14} className="text-gray-400" />
                      {/* Backend se date string aati hai, use format karein */}
                      {new Date(record.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 font-medium">
                    {record.course?.name || "Unknown Course"}
                  </td>
                  <td className="p-4">
                    {record.status === "present" ? (
                      <span className="text-black inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                        <Check size={12} /> Present
                      </span>
                    ) : (
                      <span className="text-black inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                        <X size={12} /> Absent
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-gray-500 italic text-sm">
                    {record.remarks || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
