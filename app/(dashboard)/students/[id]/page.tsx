/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import {
  ArrowLeft,
  Edit,
  Calendar,
  Mail,
  Phone,
  MapPin,
  User,
  Activity,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// Backend DTO se match karein
interface Student {
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  status: string;
  created_at: string;
}

export default function ViewStudentPage() {
  const params = useParams();
  const id = params.id; // URL se ID mili

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const { data } = await api.get(`/students/${id}`);
        setStudent(data);
      } catch (error) {
        toast.error("Failed to load student details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchStudent();
  }, [id]);

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500">Loading details...</div>
    );
  if (!student)
    return (
      <div className="p-10 text-center text-red-500">Student not found!</div>
    );

  return (
    <div className="max-w-4xl mx-auto">
      <Toaster />

      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/students"
            className="p-2 bg-white rounded shadow hover:bg-gray-50 transition"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Student Profile</h1>
        </div>

        <Link
          href={`/students/${id}/edit`}
          className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
        >
          <Edit size={18} /> Edit Profile
        </Link>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Top Banner with Name */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold backdrop-blur-sm">
              {student.first_name[0]}
              {student.last_name[0]}
            </div>
            <div>
              <h2 className="text-3xl font-bold">
                {student.first_name} {student.last_name}
              </h2>
              <p className="text-blue-100 mt-1 flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                    student.status === "active"
                      ? "bg-green-400 text-green-900"
                      : "bg-red-400 text-red-900"
                  }`}
                >
                  {student.status}
                </span>
                <span>• ID: {student.student_id.split("-")[0]}...</span>
              </p>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <div className="flex items-start gap-3">
              <Mail className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium text-gray-800">{student.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium text-gray-800">{student.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium text-gray-800">
                  {new Date(student.dob).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium text-gray-800 capitalize">
                  {student.gender}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 md:col-span-2">
              <MapPin className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium text-gray-800">{student.address}</p>
              </div>
            </div>

            {/* <div className="flex items-start gap-3">
              <Activity className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500">Joined On</p>
                <p className="font-medium text-gray-800">
                  {new Date(student.created_at).toLocaleDateString()}
                </p>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
