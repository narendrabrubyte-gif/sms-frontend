/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import LibrarySidebar from "./components/LibrarySidebar";

interface RecordType {
  id: string;
  issuedAt: string;
  returnedAt?: string;

  student: {
    student_id: string;
    first_name: string;
    last_name: string;
  };

  book: {
    id: string;
    title: string;
  };
}

export default function LibraryRecordsPage() {
  const [records, setRecords] = useState<RecordType[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(""); // ✅ SEARCH STATE
  const router = useRouter();

  const limit = 10;

  const fetchRecords = async () => {
    try {
      const res = await api.get("/library/records");

      const data = Array.isArray(res.data) ? res.data : [];

      const formatted = data.map((r: any) => ({
        ...r,
        returnedAt: r.returnedAt || r.returned_at || null
      }));

      setRecords(formatted);
    } catch {
      toast.error("Failed to load records");
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // DELETE
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this record?")) return;

    try {
      await api.delete(`/library/records/${id}`);
      toast.success("Deleted");

      setRecords(prev => prev.filter(r => r.id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  // ✅ SEARCH FILTER LOGIC
  const filteredRecords = records.filter(r =>
    `${r.student?.first_name} ${r.student?.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    r.book?.title.toLowerCase().includes(search.toLowerCase())
  );

  // PAGINATION
  const totalPages = Math.ceil(filteredRecords.length / limit);
  const start = (page - 1) * limit;
  const paginated = filteredRecords.slice(start, start + limit);

  return (
    <div className="flex">
      <LibrarySidebar />

      <div className="flex-1 p-6 text-black">

        {/* HEADER */}
        <div className="flex justify-between mb-5">
          <h1 className="text-2xl font-bold">Library Records</h1>

          <button
            onClick={() => router.push("/library/add")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            + Add Record
          </button>
        </div>

        {/* ✅ SEARCH INPUT */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by student or book..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border px-3 py-2 rounded w-full max-w-md"
          />
        </div>

        {/* TABLE */}
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Student</th>
              <th className="p-2 border">Book</th>
              <th className="p-2 border">Issue Date</th>
              <th className="p-2 border">Return Date</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  No Records Found
                </td>
              </tr>
            ) : (
              paginated.map((r) => (
                <tr key={r.id}>
                  <td className="border p-2">
                    {r.student?.first_name} {r.student?.last_name}
                  </td>

                  <td className="border p-2">{r.book?.title}</td>

                  <td className="border p-2">
                    {r.issuedAt
                      ? new Date(r.issuedAt).toLocaleDateString()
                      : "No Date"}
                  </td>

                  <td className="border p-2">
                    {r.returnedAt
                      ? new Date(r.returnedAt).toLocaleDateString()
                      : "Not Returned"}
                  </td>

                  {/* ACTION BUTTONS */}
                  <td className="border p-2 space-x-2">

                    <button
                      onClick={() => router.push(`/library/view/${r.id}`)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>

                    <button
                      onClick={() => router.push(`/library/edit/${r.id}`)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(r.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>

                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">

            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  page === i + 1 ? "bg-blue-600 text-white" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
