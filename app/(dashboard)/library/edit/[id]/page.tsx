/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import toast from "react-hot-toast";

interface Student {
  student_id: string;
  first_name: string;
  last_name: string;
}

interface Book {
  id: string;
  title: string;
}

export default function EditRecordPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [students, setStudents] = useState<Student[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    studentId: "",
    bookId: "",
    status: "ISSUED"
  });

  // ---------- ARRAY EXTRACTOR ----------
  const extractArray = (res: any) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.data?.data)) return res.data.data;
    return [];
  };

  // ---------- LOAD DATA ----------
  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const [recordRes, studentRes, bookRes] = await Promise.all([
          api.get(`/library/records/${id}`),
          api.get(`/students`),
          api.get(`/library/books`)
        ]);

        const record = recordRes?.data?.data || recordRes?.data;

        setStudents(extractArray(studentRes.data));
        setBooks(extractArray(bookRes.data));

        setForm({
          studentId: record?.student?.student_id ?? "",
          bookId: record?.book?.id ?? "",
          status: record?.status ?? "ISSUED"
        });

      } catch (err) {
        console.log(err);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  // ---------- CHANGE ----------
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // ---------- UPDATE ----------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.patch(`/library/records/${id}`, {
  studentId: form.studentId,
  bookId: form.bookId,
  status: form.status
});

      toast.success("Record Updated Successfully");
      router.push("/library");

    } catch (err: any) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6 text-black">
        Edit Record
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* STUDENT */}
        <div>
          <label className="block mb-1 text-black">Student</label>

          <select
            name="studentId"
            value={form.studentId}
            onChange={handleChange}
            className="w-full border p-2 rounded text-black"
          >
            <option value="">Select Student</option>

            {students.map(s => (
              <option key={s.student_id} value={s.student_id}>
                {s.first_name} {s.last_name}
              </option>
            ))}
          </select>
        </div>

        {/* BOOK */}
        <div>
          <label className="block mb-1 text-black">Book</label>

          <select
            name="bookId"
            value={form.bookId}
            onChange={handleChange}
            className="w-full border p-2 rounded text-black"
          >
            <option value="">Select Book</option>

            {books.map(b => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
          </select>
        </div>

        {/* STATUS */}
        <div>
          <label className="block mb-1 text-black">Status</label>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border p-2 rounded text-black"
          >
            <option value="ISSUED">ISSUED</option>
            <option value="RETURNED">RETURNED</option>
          </select>
        </div>

        {/* BUTTON */}
        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Update Record
        </button>

      </form>
    </div>
  );
}
