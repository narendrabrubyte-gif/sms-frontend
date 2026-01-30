"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { ArrowLeft, Edit, BookOpen, Hash, AlignLeft } from "lucide-react";
import toast from "react-hot-toast";

interface Course {
  course_id: string;
  name: string;
  description: string;
  credits: string;
}

export default function ViewCoursePage() {
  const params = useParams();
  const id = params.id;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(`/courses/${id}`);
        setCourse(data);
      } catch (error) {
        toast.error("Failed to load course");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCourse();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!course)
    return (
      <div className="p-10 text-center text-red-500">Course not found!</div>
    );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/courses"
            className="p-2 bg-black rounded shadow hover:bg-gray-50"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-black text-2xl font-bold">Course Details</h1>
        </div>
        <Link
          href={`/courses/${id}/edit`}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 flex items-center gap-2"
        >
          <Edit size={18} /> Edit
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Banner */}
        <div className="bg-indigo-600 p-6 text-black">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <BookOpen size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{course.name}</h2>
              <p className="text-indigo-200 text-sm mt-1">
                ID: {course.course_id}
              </p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-6">
          <div className="flex gap-4 items-start">
            <Hash className="text-gray-400 mt-1" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Credits</h3>
              <p className="text-black text-lg font-semibold">
                {course.credits}
              </p>
            </div>
          </div>

          <hr />

          <div className="flex gap-4 items-start">
            <AlignLeft className="text-gray-400 mt-1" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="text-gray-800 leading-relaxed mt-1">
                {course.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
