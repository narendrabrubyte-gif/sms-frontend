"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import api from "@/lib/axios";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import axios from "axios";

// Form Data Type match backend Expectation
interface EnrollmentForm {
  student_id: string;
  course_id: string;
  enrolled_on: string;
  status: string;
}

export default function AddEnrollmentPage() {
  const router = useRouter();

  // ✅ Default Values set ki hain taaki API ko undefined data na mile
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EnrollmentForm>({
    defaultValues: {
      enrolled_on: new Date().toISOString().split("T")[0], // "2024-05-20" format
      status: "active",
    },
  });
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
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
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

  // 2️⃣ Submit Logic - Sends exact data backend wants
  const onSubmit = async (data: EnrollmentForm) => {
    setLoading(true);
    console.log("Sending Payload:", data); // Check console for debugging

    try {
      // ✅ API CALL: POST /enrollments
      await api.post("/enrollments", data);

      toast.success("Student Enrolled Successfully!");
      setTimeout(() => router.push("/enrollments"), 1000);
    } catch (error: unknown) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Enrollment failed");
      } else {
        toast.error("Enrollment failed");
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
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/enrollments"
          className="p-2 bg-black rounded shadow hover:bg-gray-50"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-black text-2xl font-bold">New Enrollment</h1>
      </div>

      <div className="bg-black p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          </div>

          {/* Course Select */}
          <div>
            <label className="text-black block text-sm font-medium mb-1">
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
          </div>

          {/* Date Picker */}
          <div>
            <label className=" text-black block text-sm font-medium mb-1">
              Enrollment Date
            </label>
            <input
              type="date"
              {...register("enrolled_on")}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Status Select */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              {...register("status")}
              className="text-black w-full p-2 border rounded bg-white"
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="dropped">Dropped</option>
            </select>
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
            {loading ? "Processing..." : "Enroll Student"}
          </button>
        </form>
      </div>
    </div>
  );
}
