'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { Edit, Trash2, Eye, Plus, Search, BookOpen } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// Backend DTO Interface
interface Course {
  course_id: string;
  name: string;
  description: string;
  credits: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/courses?search=${search}&limit=100`);
      setCourses(data.data);
    } catch (error) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await api.delete(`/courses/${id}`);
      toast.success('Course deleted');
      fetchCourses();
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  return (
    <div>
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="text-blue-600" /> Courses Management
        </h1>
        <Link 
          href="/courses/add" 
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={18} /> Add New Course
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded shadow mb-4 flex gap-2 items-center">
        <Search className="text-gray-400" />
        <input 
          type="text"
          placeholder="Search courses..."
          className="w-full outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-700 uppercase text-sm">
            <tr>
              <th className="p-4 border-b">Course Name</th>
              <th className="p-4 border-b">Description</th>
              <th className="p-4 border-b">Credits</th>
              <th className="p-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-4 text-center">Loading...</td></tr>
            ) : courses.length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-center">No courses found</td></tr>
            ) : (
              courses.map((course) => (
                <tr key={course.course_id} className="hover:bg-gray-50 border-b last:border-0">
                  <td className="p-4 font-medium text-black">{course.name}</td>
                  <td className="p-4 text-gray-600 truncate max-w-xs">{course.description}</td>
                  <td className="p-4 text-gray-800 font-semibold">{course.credits}</td>
                  <td className="p-4 flex justify-center gap-2">
                    <Link href={`/courses/${course.course_id}`} className="p-2 text-gray-600 hover:text-blue-600">
                      <Eye size={18} />
                    </Link>
                    <Link href={`/courses/${course.course_id}/edit`} className="p-2 text-gray-600 hover:text-yellow-600">
                      <Edit size={18} />
                    </Link>
                    <button onClick={() => handleDelete(course.course_id)} className="p-2 text-gray-600 hover:text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}