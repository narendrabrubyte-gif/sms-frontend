"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import LibrarySidebar from "../components/LibrarySidebar";

interface Book {
  id: string;
  title: string;
}

interface Student {
  student_id: string;
  first_name: string;
  last_name: string;
}

export default function AddRecord() {
  const router = useRouter();

  const [books, setBooks] = useState<Book[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [form, setForm] = useState({
    bookId: "",
    studentId: "",
  });

  // FETCH DATA
  const fetchData = async () => {
    try {
      const bookRes = await api.get("/library/books");
      const studentRes = await api.get("/students");

      const bookList =
        bookRes.data?.data ||
        bookRes.data?.books ||
        bookRes.data;

      const studentList =
        studentRes.data?.data ||
        studentRes.data?.students ||
        studentRes.data;

      setBooks(Array.isArray(bookList) ? bookList : []);
      setStudents(Array.isArray(studentList) ? studentList : []);

    } catch (err) {
      console.log(err);
      toast.error("Failed loading dropdown data");
    }
  };

  useEffect(() => {
    const fetch = async () => {
      await fetchData();
    };
    fetch();
  }, []);

  // SUBMIT
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.bookId || !form.studentId)
      return toast.error("Select book & student");

    try {
      await api.post("/library/assign", {
        bookId: form.bookId,
        studentId: form.studentId,
      });

      toast.success("Book Assigned Successfully");
      router.push("/library");

    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || "Assign failed");
    }
  };

  return (
    <div className="flex">
      <LibrarySidebar />

      <div className="p-6 max-w-lg mx-auto w-full text-black">
        <h1 className="text-2xl font-bold mb-6">Add Record</h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* BOOK DROPDOWN */}
          <select
            value={form.bookId}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                bookId: e.target.value,
              }))
            }
            className="w-full border p-3 rounded"
          >
            <option value="">Select Book</option>

            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
          </select>

          {/* STUDENT DROPDOWN */}
          <select
            value={form.studentId}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                studentId: e.target.value,
              }))
            }
            className="w-full border p-3 rounded"
          >
            <option value="">Select Student</option>

            {students.map((s) => (
              <option key={s.student_id} value={s.student_id}>
                {s.first_name} {s.last_name}
              </option>
            ))}
          </select>

          <button className="bg-blue-600 text-white w-full p-3 rounded hover:bg-blue-700">
            Save Record
          </button>

        </form>
      </div>
    </div>
  );
}
