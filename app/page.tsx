"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import api from "@/lib/axios";
import axios from "axios";

export default function HomePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Email & Password required");
      return;
    }

    setLoading(true);

    try {
      // ✅ Backend login API (change if your endpoint is different)
      const res = await api.post("/auth/login", form);

      // ✅ If backend returns token
      const token = res.data?.access_token || res.data?.token;

      if (token) {
        localStorage.setItem("token", token);
      }

      toast.success("Login successful!");
      setTimeout(() => router.push("/students"), 800);
    } catch (error: unknown) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Login failed");
      } else {
        toast.error("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Toaster />

      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold text-center text-black">
          Student Management System
        </h1>
        <p className="text-center text-gray-500 mt-1">
          Login to continue
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="Enter email"
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              placeholder="Enter password"
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          Default: admin@gmail.com / 123456
        </div>
      </div>
    </div>
  );
}
