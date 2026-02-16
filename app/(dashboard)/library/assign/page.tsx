"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

type Book = {
  id: string;
  title: string;
  // add other fields as needed
};

type Student = {
  student_id: string;
  first_name: string;
  last_name: string;
  // add other fields as needed
};

export default function AssignPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [form, setForm] = useState({
    bookId: "",
    studentId: "",
  });

  const fetchData = async () => {
    const b = await api.get("/library/books");
    const s = await api.get("/students");

    setBooks(Array.isArray(b.data) ? b.data : []);
    setStudents(Array.isArray(s.data) ? s.data : []);
  };

  useEffect(() => {
    const fetch = async () => {
      await fetchData();
    };
    fetch();
  }, []);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await api.post("/library/assign", form);
      toast.success("Book Assigned");
    } catch (err: unknown) {
      type AxiosErrorResponse = {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      const error = err as AxiosErrorResponse;

      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (error.response) === "object" &&
        error.response !== undefined &&
        "data" in error.response &&
        typeof (error.response.data) === "object" &&
        error.response.data !== undefined &&
        "message" in error.response.data
      ) {
        toast.error(error.response.data?.message || "Error");
      } else {
        toast.error("Error");
      }
    }
  };

  return (
    <div className="p-6 text-black max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Assign Book</h1>

      <form onSubmit={submit} className="space-y-4">

        {/* BOOK */}
        <select
          name="bookId"
          onChange={(e) =>
            setForm({ ...form, bookId: e.target.value })
          }
          className="w-full border p-2"
        >
          <option value="">Select Book</option>

          {books.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title}
            </option>
          ))}
        </select>

        {/* STUDENT */}
        <select
          name="studentId"
          onChange={(e) =>
            setForm({ ...form, studentId: e.target.value })
          }
          className="w-full border p-2"
        >
          <option value="">Select Student</option>

          {students.map((s) => (
            <option key={s.student_id} value={s.student_id}>
              {s.first_name} {s.last_name}
            </option>
          ))}
        </select>

        <button className="bg-green-600 text-white w-full p-2 rounded">
          Assign
        </button>
      </form>
    </div>
  );
}
