"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import api from "@/lib/axios";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import axios, { isAxiosError } from "axios";

interface CourseForm {
  name: string;
  description: string;
  credits: string;
}

export default function AddCoursePage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseForm>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: CourseForm) => {
    setLoading(true);
    try {
      await api.post("/courses", data);
      toast.success("Course Added Successfully!");
      setTimeout(() => router.push("/courses"), 1000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to add course");
      } else {
        toast.error("Failed to add course");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <Toaster />
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/courses"
          className="p-2 bg-black rounded shadow hover:bg-gray-50"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Add New Course</h1>
      </div>

      <div className="bg-black p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Course Name
            </label>
            <input
              {...register("name", { required: "Course name is required" })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Advanced Mathematics"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Credits */}
          <div>
            <label className="block text-sm font-medium mb-1">Credits</label>
            <input
              type="text" // Backend DTO mein ye string hai
              {...register("credits", { required: "Credits are required" })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. 4"
            />
            {errors.credits && (
              <p className="text-red-500 text-xs mt-1">
                {errors.credits.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              rows={4}
              placeholder="Enter course details..."
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {loading ? "Saving..." : "Save Course"}
          </button>
        </form>
      </div>
    </div>
  );
}
