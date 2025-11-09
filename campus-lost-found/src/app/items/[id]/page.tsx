"use client";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function ItemDetailPage() {
  const { isAuthed } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  if (!isAuthed) {
    if (typeof window !== "undefined") router.replace("/login");
    return null;
  }

  const { data, error, isLoading } = useSWR(id ? `/api/items/${id}` : null, fetcher);

  if (isLoading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">Failed to load.</div>;
  if (!data) return null;

  return (
    <div className="p-6 space-y-2">
      <h1 className="text-2xl font-semibold">{data.title}</h1>
      <p className="opacity-80">{data.description}</p>
      <div className="text-sm">
        Type: {data.type} | Category: {data.category ?? "—"} | Location: {data.locationFound ?? "—"}
      </div>
    </div>
  );
}
