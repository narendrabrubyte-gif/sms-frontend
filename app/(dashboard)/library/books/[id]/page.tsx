"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useParams } from "next/navigation";

export default function ViewBook() {
  const { id } = useParams();
  const [book, setBook] = useState<any>(null);

  useEffect(() => {
    api.get(`/library/books/${id}`).then(res => setBook(res.data));
  }, []);

  if (!book) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl font-bold mb-4">Book Details</h1>

      <div className="space-y-2">
        <p><b>Title:</b> {book.title}</p>
        <p><b>Class:</b> {book.bookClass}</p>
        <p><b>Quantity:</b> {book.total_quantity}</p>
        <p><b>Status:</b> {book.status}</p>
      </div>
    </div>
  );
}
