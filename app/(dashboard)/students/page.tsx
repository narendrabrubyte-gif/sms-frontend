/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
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

interface StudentsResponse {
  data: Student[];
  meta: {
    total: number;
    page: number;
    limit: number;
    last_page: number;
  };
}

// ✅ Pagination pages generator (1 2 3 ... 10)
const getPaginationPages = (current: number, last: number) => {
  const pages: (number | "...")[] = [];

  if (last <= 7) {
    for (let i = 1; i <= last; i++) pages.push(i);
    return pages;
  }

  pages.push(1);

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(last - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < last - 2) pages.push("...");

  pages.push(last);

  return pages;
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ pagination
  const [page, setPage] = useState(1);
  const limit = 5;

  // meta info
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<StudentsResponse>(
        `/students?search=${search}&page=${page}&limit=${limit}`
      );

      setStudents(data.data || []);
      setTotal(data.meta?.total || 0);
      setLastPage(data.meta?.last_page || 1);
    } catch (error) {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, page]);

  // search change -> reset page 1
  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      await api.delete(`/students/${id}`);
      toast.success("Student deleted");

      // agar page me last item delete hua and page>1 -> prev page
      if (students.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchStudents();
      }
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const pages = getPaginationPages(page, lastPage);

  return (
    <div className="p-4">
      <Toaster />

      {/* Header */}
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
                <td colSpan={4} className="p-6 text-center text-gray-600">
                  Loading...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-600">
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
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        student.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {student.status.toUpperCase()}
                    </span>
                  </td>

                  <td className="p-4 flex justify-center gap-2">
                    <Link
                      href={`/students/${student.student_id}`}
                      className="p-2 text-gray-600 hover:text-blue-600"
                      title="View"
                    >
                      <Eye size={18} />
                    </Link>

                    <Link
                      href={`/students/${student.student_id}/edit`}
                      className="p-2 text-gray-600 hover:text-yellow-600"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </Link>

                    <button
                      onClick={() => handleDelete(student.student_id)}
                      className="p-2 text-gray-600 hover:text-red-600"
                      title="Delete"
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

      {/* ✅ Pagination with Numbers */}
      {!loading && total > 5 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 bg-white p-4 rounded shadow">
          <p className="text-gray-700 text-sm">
            Showing page <b>{page}</b> of <b>{lastPage}</b> | Total:{" "}
            <b>{total}</b>
          </p>

          <div className="flex gap-2 items-center">
            {/* Prev */}
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50 text-black"
            >
              Prev
            </button>

            {/* Numbers */}
            {pages.map((p, index) =>
              p === "..." ? (
                <span key={index} className="px-2 text-gray-500">
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-2 rounded ${
                    page === p
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-black hover:bg-gray-200"
                  }`}
                >
                  {p}
                </button>
              )
            )}

            {/* Next */}
            <button
              disabled={page === lastPage}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50 text-black"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
