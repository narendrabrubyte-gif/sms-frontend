"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form"; // ✅ Best for Forms
import api from "@/lib/axios";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import axios from "axios";

// Form Data Type
interface StudentForm {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  status: string;
}

export default function AddStudentPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentForm>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: StudentForm) => {
    setLoading(true);
    try {
      // ✅ Backend Call
      await api.post("/students", data);
      toast.success("Student Added Successfully!");

      // Thoda wait karke redirect karo
      setTimeout(() => router.push("/students"), 1000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to add student");
      } else {
        toast.error("Failed to add student");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Toaster />

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/students"
          className="p-2 bg-black rounded shadow hover:bg-gray-50"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-black text-2xl font-bold">Add New Student</h1>
      </div>

      {/* Form Card */}
      <div className="bg-black p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name
              </label>
              <input
                {...register("first_name", {
                  required: "First Name is required",
                })}
                className="w-full p-2 border rounded"
                placeholder="Rahul"
              />
              {errors.first_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <input
                {...register("last_name", {
                  required: "Last Name is required",
                })}
                className="w-full p-2 border rounded"
                placeholder="Sharma"
              />
              {errors.last_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="w-full p-2 border rounded"
                placeholder="rahul@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                {...register("phone", { required: "Phone is required" })}
                className="w-full p-2 border rounded"
                placeholder="9876543210"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* DOB */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                {...register("dob", { required: "DOB is required" })}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                {...register("gender", { required: "Gender is required" })}
                className="text-black w-full p-2 border rounded bg-white"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              {...register("address", { required: "Address is required" })}
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="Full address here..."
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              {...register("status", { required: "Status is required" })}
              className="text-black w-full p-2 border rounded bg-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded font-medium hover:bg-blue-700 flex items-center justify-center gap-2 disabled:bg-gray-400"
          >
            <Save size={20} />
            {loading ? "Saving..." : "Save Student"}
          </button>
        </form>
      </div>
    </div>
  );
}
