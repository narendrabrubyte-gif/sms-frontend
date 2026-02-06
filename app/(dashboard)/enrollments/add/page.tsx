"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import api from "@/lib/axios";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import axios from "axios";

interface EnrollmentForm {
  student_id: string;
  course_id: string;
  enrolled_on: string;
  status: "active" | "withdrawn";
}

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

export default function AddEnrollmentPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EnrollmentForm>({
    defaultValues: {
      enrolled_on: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      status: "active",
    },
  });

  // Load dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, coursesRes] = await Promise.all([
          api.get("/students?limit=100"),
          api.get("/courses?limit=100"),
        ]);

        setStudents(studentsRes.data?.data || []);
        setCourses(coursesRes.data?.data || []);
      } catch (_error) {
        toast.error("Failed to load dropdown data");
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, []);

  // Submit
  const onSubmit = async (data: EnrollmentForm) => {
    setLoading(true);

    try {
      // ✅ Strict payload
      const payload = {
        student_id: data.student_id,
        course_id: data.course_id,
        enrolled_on: data.enrolled_on, // keep YYYY-MM-DD (ISO valid)
        status: data.status,
      };

      // ✅ Frontend validation
      if (!payload.student_id) {
        toast.error("Student is required");
        setLoading(false);
        return;
      }

      if (!payload.course_id) {
        toast.error("Course is required");
        setLoading(false);
        return;
      }

      if (!payload.enrolled_on) {
        toast.error("Enrollment date is required");
        setLoading(false);
        return;
      }

      if (!["active", "withdrawn"].includes(payload.status)) {
        toast.error("Status must be active or withdrawn");
        setLoading(false);
        return;
      }

      console.log("FINAL PAYLOAD:", payload);

      await api.post("/enrollments", payload);

      toast.success("Student Enrolled Successfully!");
      setTimeout(() => router.push("/enrollments"), 1000);
    } catch (error: unknown) {
      console.error("ERROR:", error);

      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message;

        // NestJS sometimes returns array of messages
        if (Array.isArray(msg)) toast.error(msg.join(", "));
        else toast.error(msg || "Enrollment failed");
      } else {
        toast.error("Enrollment failed");
      }
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <div className="p-10 text-center">Loading form...</div>;

  return (
    <div className="max-w-xl mx-auto">
      <Toaster />

      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/enrollments"
          className="p-2 bg-black text-white rounded shadow hover:bg-gray-800"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-black text-2xl font-bold">New Enrollment</h1>
      </div>

      <div className="bg-black p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Student Select */}
          <div>
            <label className="block text-sm font-medium mb-1 text-white">
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
              <p className="text-red-400 text-sm mt-1">
                {errors.student_id.message}
              </p>
            )}
          </div>

          {/* Course Select */}
          <div>
            <label className="block text-sm font-medium mb-1 text-white">
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
              <p className="text-red-400 text-sm mt-1">
                {errors.course_id.message}
              </p>
            )}
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-sm font-medium mb-1 text-white">
              Enrollment Date
            </label>
            <input
              type="date"
              {...register("enrolled_on", { required: "Date is required" })}
              className="text-black w-full p-2 border rounded bg-white"
            />
            {errors.enrolled_on && (
              <p className="text-red-400 text-sm mt-1">
                {errors.enrolled_on.message}
              </p>
            )}
          </div>

          {/* Status Select */}
          <div>
            <label className="block text-sm font-medium mb-1 text-white">
              Status
            </label>
            <select
              {...register("status", { required: "Status is required" })}
              className="text-black w-full p-2 border rounded bg-white"
            >
              <option value="active">Active</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            {loading ? "Processing..." : "Enroll Student"}
          </button>
        </form>
      </div>
    </div>
  );
}
