/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import toast from "react-hot-toast";

export default function ViewRecordPage() {
  const { id } = useParams();
  const router = useRouter();

  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const res = await api.get(`/library/records/${id}`);
        setRecord(res.data);
      } catch (err) {
        toast.error("Failed to load record");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return <div className="p-6 text-black">Loading...</div>;
  if (!record) return <div className="p-6 text-black">No Data</div>;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4 text-black">

      <h1 className="text-2xl font-bold">Record Details</h1>

      <div className="border p-4 rounded space-y-2">

        <p><b>Student:</b> {record.student?.first_name} {record.student?.last_name}</p>

        <p><b>Book:</b> {record.book?.title}</p>

        <p><b>Status:</b> {record.status}</p>

        <p>
          <b>Issue Date:</b>{" "}
          {record.issuedAt
            ? new Date(record.issuedAt).toLocaleDateString()
            : "N/A"}
        </p>

      </div>

      <button
        onClick={() => router.back()}
        className="bg-gray-700 text-white px-4 py-2 rounded"
      >
        Back
      </button>

    </div>
  );
}
