'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { Plus, Trash2, BookOpen, User, Calendar, XCircle, Search } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// ✅ Interfaces defined based on your Backend DTO
interface Course {
  name: string;
  credits: string;
  description: string;
}

interface Enrollment {
  enrollment_id: string;
  status: string;
  enrolled_on: string;
  course: Course | null; // Course details nested hongi
}

interface Student {
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export default function EnrollmentPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState(''); // Dropdown value
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);

  // 1️⃣ Page Load hone par sirf STUDENTS ki list lao (Dropdown ke liye)
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await api.get('/students?limit=100');
        setStudents(data.data);
      } catch (error) {
        toast.error('Failed to load students list');
      }
    };
    fetchStudents();
  }, []);

  // 2️⃣ Jab User Student Select karega, tabhi API call hogi
  useEffect(() => {
    if (!selectedStudent) {
      setEnrollments([]); // Agar kuch select nahi hai to table khali rakho
      return;
    }

    const fetchStudentEnrollments = async () => {
      setLoading(true);
      try {
        // ✅ AAPKI API: Get Courses by Student ID
        console.log(`Fetching enrollments for student: ${selectedStudent}`);
        const { data } = await api.get(`/enrollments/students/${selectedStudent}`);
        setEnrollments(data);
      } catch (error) {
        console.error(error);
        toast.error('No enrollments found or API error');
        setEnrollments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentEnrollments();
  }, [selectedStudent]);

  // 3️⃣ Delete Logic (Aapki Delete API ke hisab se)
  const handleDelete = async (enrollment_id: string) => {
    if (!confirm('Are you sure you want to delete this enrollment?')) return;
    
    try {
      // ✅ AAPKI API: Delete Enrollment by ID
      await api.delete(`/enrollments/${enrollment_id}`);
      
      toast.success('Unenrolled successfully');
      
      // List ko refresh karo (Same student API call again)
      const { data } = await api.get(`/enrollments/students/${selectedStudent}`);
      setEnrollments(data);
    } catch (error) {
      toast.error('Failed to delete enrollment');
    }
  };

  return (
    <div>
      <Toaster />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-black text-2xl font-bold flex items-center gap-2">
          <User className="text-black" /> Enrollment Manager
        </h1>
        <Link 
          href="/enrollments/add" 
          className="bg-purple-600 text-black px-4 py-2 rounded flex items-center gap-2 hover:bg-purple-700 shadow-md"
        >
          <Plus size={18} /> New Enrollment
        </Link>
      </div>

      {/* 🔻 STUDENT SELECTION DROPDOWN (Iske bina list nahi dikhegi) */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 border-l-4 border-purple-500">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Search size={16} /> Select Student to View Courses
        </h2>
        <select 
            className="w-full p-3 border rounded-lg bg-gray-50 text-gray-800 text-lg focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
        >
            <option value="">-- Click to Select Student --</option>
            {students.map(s => (
                <option key={s.student_id} value={s.student_id}>
                    {s.first_name} {s.last_name} ({s.email})
                </option>
            ))}
        </select>
      </div>

      {/* 🔻 RESULTS TABLE */}
      <div className="bg-white rounded-lg shadow overflow-hidden min-h-[300px]">
        {loading ? (
            <div className="p-10 text-center text-gray-500">Fetching records...</div>
        ) : !selectedStudent ? (
            // Jab tak student select na ho, ye dikhao
            <div className="p-10 text-center flex flex-col items-center text-gray-400">
                <BookOpen size={48} className="mb-2 opacity-50" />
                <p>Please select a student from the dropdown above to see their courses.</p>
            </div>
        ) : enrollments.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
                This student has not enrolled in any course yet.
            </div>
        ) : (
            <table className="w-full text-left border-collapse">
                <thead className="bg-purple-50 text-purple-900 uppercase text-xs font-bold">
                    <tr>
                        <th className="p-4 border-b">Course Name</th>
                        <th className="p-4 border-b">Credits</th>
                        <th className="p-4 border-b">Enrolled On</th>
                        <th className="p-4 border-b">Status</th>
                        <th className="p-4 border-b text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {enrollments.map((item) => (
                        <tr key={item.enrollment_id} className="hover:bg-gray-50 border-b last:border-0">
                            <td className="p-4 font-medium text-gray-800">
                                {item.course?.name || 'Unknown Course'}
                            </td>
                            <td className="p-4 text-gray-600">
                                {item.course?.credits}
                            </td>
                            <td className="p-4 text-gray-600 flex items-center gap-2">
                                <Calendar size={14} />
                                {item.enrolled_on}
                            </td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                                    item.status === 'active' ? 'bg-green-100 text-green-700' :
                                    item.status === 'dropped' ? 'bg-red-100 text-red-700' :
                                    'bg-gray-100 text-gray-700'
                                }`}>
                                    {item.status}
                                </span>
                            </td>
                            <td className="p-4 text-center">
                                <button 
                                    onClick={() => handleDelete(item.enrollment_id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                                    title="Delete Enrollment"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
      </div>
    </div>
  );
}