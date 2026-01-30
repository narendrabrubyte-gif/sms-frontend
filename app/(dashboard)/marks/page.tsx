"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { Plus, GraduationCap, Search, Award } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// ✅ Interfaces
interface Student {
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface MarkRecord {
  marks_id: string; // ya 'id' check karlena backend se
  exam_type: string;
  score: number;
  max_score: number;
  course: {
    name: string;
    credits: string;
  } | null;
}

export default function MarksDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [marks, setMarks] = useState<MarkRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // 1️⃣ Load Students
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

  // 2️⃣ Load Marks when student selected
  useEffect(() => {
    if (!selectedStudent) {
      setMarks([]);
      return;
    }

    const fetchMarks = async () => {
      setLoading(true);
      try {
        // ✅ API: GET /marks/student/:id
        console.log(`Fetching marks for: ${selectedStudent}`);
        const { data } = await api.get(`/marks/student/${selectedStudent}`);
        setMarks(data);
      } catch (error) {
        toast.error("Failed to fetch marks");
        setMarks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMarks();
  }, [selectedStudent]);

  // Helper to calculate percentage
  const getPercentage = (score: number, max: number): string => {
    if (max === 0) return "0";
    return ((score / max) * 100).toFixed(1);
  };

  return (
    <div>
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-black text-2xl font-bold flex items-center gap-2">
          <GraduationCap className="text-blue-600" /> Marks & Results
        </h1>
        <Link
          href="/marks/add"
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-yellow-700 shadow"
        >
          <Plus size={18} /> Add Marks
        </Link>
      </div>

      {/* 🔍 Select Student Filter */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 border-l-4 border-yellow-500">
        <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
          <Search size={16} /> View Report Card
        </h2>
        <select
          className="w-full p-3 border rounded-lg bg-gray-50 text-gray-800 text-lg outline-none focus:ring-2 focus:ring-yellow-500 cursor-pointer"
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
            Loading results...
          </div>
        ) : !selectedStudent ? (
          <div className="p-10 text-center flex flex-col items-center text-gray-400">
            <Award size={48} className="mb-2 opacity-50" />
            <p>Select a student to view their academic performance</p>
          </div>
        ) : marks.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No marks records found for this student.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="text-black bg-yellow-50 text-yellow-900 uppercase text-xs font-bold">
              <tr>
                <th className="p-4 border-b">Course Name</th>
                <th className="p-4 border-b">Exam Type</th>
                <th className="p-4 border-b">Score</th>
                <th className="p-4 border-b">Percentage</th>
                <th className="p-4 border-b">Result</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((record, index) => {
                const percent = parseFloat(
                  getPercentage(record.score, record.max_score),
                );
                const isPass = percent >= 40; // Example pass logic

                return (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 border-b last:border-0"
                  >
                    <td className="p-4 font-medium text-gray-800">
                      {record.course?.name || "Unknown Course"}
                    </td>
                    <td className="p-4 text-gray-600">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">
                        {record.exam_type.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-gray-700">
                      {record.score}{" "}
                      <span className="text-gray-400 font-normal text-sm">
                        / {record.max_score}
                      </span>
                    </td>
                    <td className="p-4 text-black text-blue-600 font-medium">
                      {percent}%
                    </td>
                    <td className="p-4">
                      {isPass ? (
                        <span className="text-green-600 text-black font-bold text-xs bg-green-100 px-2 py-1 rounded">
                          PASS
                        </span>
                      ) : (
                        <span className="text-red-600 text-black font-bold text-xs bg-red-100 px-2 py-1 rounded">
                          FAIL
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
