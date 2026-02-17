/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import toast from "react-hot-toast";

interface Book {
  id: string;
  title: string;
  bookClass: string;
  total_quantity: number;
  available_quantity: number;
  status: string;
}

export default function BooksPage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      const res = await api.get("/library/books");
      setBooks(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this book?")) return;

    try {
      await api.delete(`/library/books/${id}`);
      toast.success("Deleted");
      fetchBooks();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading)
    return <div className="p-6 text-lg font-semibold">Loading books...</div>;

  return (
    <div className="p-6 text-black">

      {/* HEADER */}
      <div className="flex justify-between mb-6">

        {/* LEFT SIDE (Back + Title) */}
        <div className="flex items-center gap-5 bg-blue-600 p-2 rounded">
          <button
            onClick={() => router.back()}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          >
            ← Back
          </button>

          <h1 className="text-2xl font-bold">Books</h1>
        </div>

        {/* RIGHT SIDE */}
        <button
          onClick={() => router.push("/library/books/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Book
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-black">
            <tr>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Class</th>
              <th className="p-3 border">Total</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>

          <tbody>
            {books.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  No books found
                </td>
              </tr>
            ) : (
              books.map((b) => (
                <tr key={b.id} className="text-center hover:bg-gray-50">
                  <td className="border p-2">{b.title}</td>
                  <td className="border p-2">{b.bookClass}</td>
                  <td className="border p-2">{b.total_quantity}</td>

                  <td className="border p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        b.status === "available"
                          ? "bg-green-200"
                          : "bg-red-200"
                      }`}
                    >
                      {b.status}
                    </span>
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
