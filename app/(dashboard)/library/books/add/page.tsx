
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import toast from "react-hot-toast";

export default function AddBookPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    bookClass: "",
    total_quantity: 1,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await api.post("/library/books", {
        ...form,
        total_quantity: Number(form.total_quantity),
      });

      toast.success("Book Added");
      router.push("/library/books");
    } catch {
      toast.error("Error adding book");
    }
  };

  return (
    <div className="p-6 text-black max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Book</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Book Title"
          onChange={handleChange}
          className="w-full border p-2"
        />

        <input
          name="bookClass"
          placeholder="Class"
          onChange={handleChange}
          className="w-full border p-2"
        />

        <input
          type="number"
          name="total_quantity"
          placeholder="Quantity"
          onChange={handleChange}
          className="w-full border p-2"
        />

        <button className="bg-blue-600 text-white w-full p-2 rounded">
          Save
        </button>
      </form>
    </div>
  );
}
