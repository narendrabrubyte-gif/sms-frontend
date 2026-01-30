"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import api from "@/lib/axios";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, GraduationCap } from "lucide-react";
import axios from "axios";

// ✅ Interfaces
interface Student {
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Course {
  course_id: string;
  name: string;
}

interface MarksForm {
  student_id: string;
  course_id: string;
  exam_type: string;
  score: number;
  max_score: number;
}

export default function AddMarksPage() {
  const router = useRouter();

  // ✅ Form Setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MarksForm>({
    defaultValues: {
      exam_type: "Final", // Default value
      max_score: 100,
    },
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  // 1️⃣ Load Dropdown Data
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

  // 2️⃣ Submit Logic
  const onSubmit = async (data: MarksForm) => {
    setLoading(true);
    console.log("Submitting Marks:", data);

    try {
      // ✅ API: POST /marks
      await api.post("/marks", data);

      toast.success("Marks Added Successfully!");
      setTimeout(() => router.push("/marks"), 1000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to add marks");
      } else {
        toast.error("Failed to add marks");
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
          href="/marks"
          className="p-2 bg-black rounded shadow hover:bg-gray-50"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-black text-2xl font-bold">Add Student Marks</h1>
      </div>

      <div className="bg-black p-6 rounded-lg shadow border-t-4 border-blue-500">
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
                  {c.name}
                </option>
              ))}
            </select>
            {errors.course_id && (
              <p className="text-red-500 text-xs mt-1">
                {errors.course_id.message}
              </p>
            )}
          </div>

          {/* Exam Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Exam Type</label>
            <select
              {...register("exam_type", { required: "Exam type is required" })}
              className="text-black w-full p-2 border rounded bg-white"
            >
              <option value="Final">Final Exam</option>
              <option value="Midterm">Midterm</option>
              <option value="Quiz">Quiz</option>
              <option value="Assignment">Assignment</option>
            </select>
          </div>

          {/* Scores Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Score Obtained
              </label>
              <input
                type="number"
                {...register("score", {
                  required: "Score is required",
                  valueAsNumber: true,
                })}
                className="w-full p-2 border rounded"
                placeholder="e.g. 85"
              />
              {errors.score && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.score.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Max Score
              </label>
              <input
                type="number"
                {...register("max_score", {
                  required: "Max Score is required",
                  valueAsNumber: true,
                })}
                className="w-full p-2 border rounded"
                placeholder="e.g. 100"
              />
            </div>
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
            {loading ? "Saving Result..." : "Save Marks"}
          </button>
        </form>
      </div>
    </div>
  );
}
