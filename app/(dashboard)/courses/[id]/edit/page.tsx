"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CourseForm>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch Existing Data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(`/courses/${courseId}`);
        setValue("name", data.name);
        setValue("description", data.description);
        setValue("credits", data.credits);
      } catch (error) {
        toast.error("Could not fetch course details");
        router.push("/courses");
      } finally {
        setFetching(false);
      }
    };
    if (courseId) fetchCourse();
  }, [courseId, setValue, router]);

  // Update Data
  const onSubmit = async (data: CourseForm) => {
    setLoading(true);
    try {
      await api.patch(`/courses/${courseId}`, data);
      toast.success("Course Updated Successfully!");
      setTimeout(() => router.push("/courses"), 1000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to update");
      } else {
        toast.error("Failed to update");
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return <div className="p-8 text-center">Loading Course Data...</div>;

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
        <h1 className="text-2xl font-bold">Edit Course</h1>
      </div>

      <div className="bg-black p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Course Name
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              className="w-full p-2 border rounded"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Credits</label>
            <input
              {...register("credits", { required: "Credits required" })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              {...register("description", { required: "Description required" })}
              className="w-full p-2 border rounded"
              rows={4}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-600 text-white p-3 rounded font-medium hover:bg-yellow-700 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {loading ? "Updating..." : "Update Course"}
          </button>
        </form>
      </div>
    </div>
  );
}
