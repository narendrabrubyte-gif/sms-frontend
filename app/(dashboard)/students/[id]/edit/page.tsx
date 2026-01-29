"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import api from "@/lib/axios";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import axios from "axios";

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

export default function EditStudentPage() {
  const router = useRouter();
  const params = useParams(); // ✅ URL se ID nikalne ke liye
  const studentId = params.id;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StudentForm>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // ✅ 1. Pehle Student ka Data lao
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const { data } = await api.get(`/students/${studentId}`);
        // Form fields ko backend data se bharo
        setValue("first_name", data.first_name);
        setValue("last_name", data.last_name);
        setValue("email", data.email);
        setValue("phone", data.phone);
        setValue("dob", data.dob.split("T")[0]); // Date format fix
        setValue("gender", data.gender);
        setValue("address", data.address);
        setValue("status", data.status);
      } catch (error) {
        toast.error("Could not fetch student details");
        router.push("/students");
      } finally {
        setFetching(false);
      }
    };

    if (studentId) fetchStudent();
  }, [studentId, setValue, router]);

  // ✅ 2. Update API Call
  const onSubmit = async (data: StudentForm) => {
    setLoading(true);
    try {
      await api.patch(`/students/${studentId}`, data);
      toast.success("Student Updated Successfully!");
      setTimeout(() => router.push("/students"), 1000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to update");
      } else {
        toast.error("Failed to Update");
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return <div className="p-8 text-center">Loading Student Data...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <Toaster />
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/students"
          className="p-2 bg-black rounded shadow hover:bg-gray-50"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-black text-2xl font-bold">Edit Student</h1>
      </div>

      <div className="bg-black p-6 rounded-lg shadow">
        {/* Form Same as Add Page, bas onSubmit alag hai */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name
              </label>
              <input
                {...register("first_name")}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <input
                {...register("last_name")}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                {...register("email")}
                className="text-black w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                readOnly
                disabled
              />
              {/* Note: Email usually change nahi karte, isliye disabled rakha hai */}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                {...register("phone")}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* ... Baaki fields same Add form jaise ... */}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                {...register("status")}
                className="text-black w-full p-2 border rounded bg-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>{/* Space holder for grid */}</div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-600 text-white p-3 rounded font-medium hover:bg-yellow-700 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {loading ? "Updating..." : "Update Student"}
          </button>
        </form>
      </div>
    </div>
  );
}
