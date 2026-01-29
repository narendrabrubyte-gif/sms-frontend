"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { Edit, Trash2, Eye, Plus, Search } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface Student {
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/students?search=${search}&limit=100`);
      setStudents(data.data);
    } catch (error) {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      await api.delete(`/students/${id}`);
      toast.success("Student deleted");
      fetchStudents(); // Refresh list
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div>
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-black text-2xl font-bold">Students Management</h1>
        <Link
          href="/students/add"
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={18} /> Add New Student
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded shadow mb-4 flex gap-2 items-center">
        <Search className="text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          className="text-black w-full outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-700 uppercase text-sm">
            <tr>
              <th className="p-4 border-b">Name</th>
              <th className="p-4 border-b">Email</th>
              <th className="p-4 border-b">Status</th>
              <th className="p-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  No students found
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr
                  key={student.student_id}
                  className="hover:bg-gray-50 border-b last:border-0"
                >
                  <td className="text-black p-4 font-medium">
                    {student.first_name} {student.last_name}
                  </td>
                  <td className="p-4 text-gray-600">{student.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        student.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {student.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    {/* Actions */}
                    <Link
                      href={`/students/${student.student_id}`}
                      className="p-2 text-gray-600 hover:text-blue-600"
                    >
                      <Eye size={18} />
                    </Link>
                    <Link
                      href={`/students/${student.student_id}/edit`}
                      className="p-2 text-gray-600 hover:text-yellow-600"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(student.student_id)}
                      className="p-2 text-gray-600 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
