"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import api from "@/lib/axios";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, CheckCircle, XCircle } from "lucide-react";
import axios, { isAxiosError } from "axios";

// ✅ Interfaces (No 'any')
interface Student {
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Course {
  course_id: string;
  name: string;
  credits: string;
}

interface AttendanceForm {
  student_id: string;
  course_id: string;
  date: string;
  status: "present" | "absent";
  remarks?: string;
}

export default function MarkAttendancePage() {
  const router = useRouter();

  // ✅ Form Setup with Default Values
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AttendanceForm>({
    defaultValues: {
      date: new Date().toISOString().split("T")[0], // Aaj ki date default (YYYY-MM-DD)
      status: "present",
      remarks: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Dropdown Data States
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  // 1️⃣ Load Students & Courses for Dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, coursesRes] = await Promise.all([
          api.get("/students?limit=100"),
          api.get("/courses?limit=100"),
        ]);
        setStudents(studentsRes.data.data);
        setCourses(coursesRes.data.data);
      } catch (error) {
        toast.error("Failed to load dropdown data");
      } finally {
        setPageLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2️⃣ Submit Logic (Exact JSON Payload)
  const onSubmit = async (data: AttendanceForm) => {
    setLoading(true);
    console.log("Submitting Attendance:", data); // Debugging ke liye

    try {
      // ✅ API: POST /attendance
      await api.post("/attendance", data);

      toast.success("Attendance Marked Successfully!");
      setTimeout(() => router.push("/attendance"), 1000);
    } catch (error: unknown) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to mark attendance",
        );
      } else {
        toast.error("Failed to mark attendance");
      }
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading)
    return <div className="p-10 text-center">Loading form...</div>;

  return (
    <div className="max-w-xl mx-auto">
      <Toaster />

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/attendance"
          className="p-2 bg-black rounded shadow hover:bg-gray-50"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-black text-2xl font-bold">Mark Attendance</h1>
      </div>

      <div className="bg-black p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Student Select */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Select Student
            </label>
            <select
              {...register("student_id", { required: "Student is required" })}
              className="text-black w-full p-2 border rounded bg-white"
            >
              <option value="">-- Choose Student --</option>
              {students.map((s) => (
                <option key={s.student_id} value={s.student_id}>
                  {s.first_name} {s.last_name} ({s.email})
                </option>
              ))}
            </select>
            {errors.student_id && (
              <p className="text-red-500 text-xs mt-1">
                {errors.student_id.message}
              </p>
            )}
          </div>

          {/* Course Select */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Select Course
            </label>
            <select
              {...register("course_id", { required: "Course is required" })}
              className="text-black w-full p-2 border rounded bg-white"
            >
              <option value="">-- Choose Course --</option>
              {courses.map((c) => (
                <option key={c.course_id} value={c.course_id}>
                  {c.name} (Credits: {c.credits})
                </option>
              ))}
            </select>
            {errors.course_id && (
              <p className="text-red-500 text-xs mt-1">
                {errors.course_id.message}
              </p>
            )}
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              {...register("date", { required: "Date is required" })}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Status (Present/Absent UI) */}
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <div className="flex gap-4">
              {/* Present Option */}
              <label className="flex items-center gap-2 p-3 border rounded cursor-pointer hover:bg-green-50 w-full justify-center has-[:checked]:bg-green-100 has-[:checked]:border-green-500 transition-all">
                <input
                  type="radio"
                  value="present"
                  {...register("status")}
                  className="accent-green-600 w-4 h-4"
                />
                <span className="font-medium text-green-700 flex items-center gap-1">
                  <CheckCircle size={18} /> Present
                </span>
              </label>

              {/* Absent Option */}
              <label className="flex items-center gap-2 p-3 border rounded cursor-pointer hover:bg-red-50 w-full justify-center has-[:checked]:bg-red-100 has-[:checked]:border-red-500 transition-all">
                <input
                  type="radio"
                  value="absent"
                  {...register("status")}
                  className="accent-red-600 w-4 h-4"
                />
                <span className="font-medium text-red-700 flex items-center gap-1">
                  <XCircle size={18} /> Absent
                </span>
              </label>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Remarks (Optional)
            </label>
            <textarea
              {...register("remarks")}
              className="w-full p-2 border rounded"
              rows={2}
              placeholder="e.g. Late arrival, Sick leave..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save size={20} />
            )}
            {loading ? "Saving..." : "Save Attendance"}
          </button>
        </form>
      </div>
    </div>
  );
}
