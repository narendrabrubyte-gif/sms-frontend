"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handelLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", { email, password });

      Cookies.set("token", data.access_token, { expires: 1 });
      toast.success("Login Successful !");
      router.push("/dashboard");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.request?.data?.message || "Login Failed");
      } else {
        toast.error("Login Failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <Toaster />
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl text-red-500 font-bold text-center mb-6">
          Student Managament System Login
        </h2>
        <form onSubmit={handelLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-stone-950 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-black w-full p-2 border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-black font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-black w-full p-2 border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded mt-2"
              required
            />
          </div>
          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
